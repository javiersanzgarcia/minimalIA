use serde::Serialize;
use sysinfo::System;

#[derive(Serialize)]
struct SystemInfo {
    os: String,
    cpu_cores: u64,
    total_ram_gb: u64,
    gpu: String,
    vram_gb: u64,
}

#[derive(Serialize)]
struct RepoContext {
    tree: String,
    files: Vec<FileContent>,
}

#[derive(Serialize)]
struct FileContent {
    path: String,
    content: String,
}

// ── Linux GPU ──────────────────────────────────────────────────────────────

#[cfg(target_os = "linux")]
fn get_gpu_info() -> (String, u64) {
    let mut gpu_name = String::new();
    let mut vram_gb: u64 = 0;

    // sysfs
    if let Ok(entries) = std::fs::read_dir("/sys/class/drm/") {
        for entry in entries.flatten() {
            let name = entry.file_name();
            let name_str = name.to_string_lossy();
            if !name_str.starts_with("card") || name_str.contains('-') {
                continue;
            }
            let dev = entry.path().join("device");
            if !dev.exists() {
                continue;
            }
            let vendor = std::fs::read_to_string(dev.join("vendor"))
                .ok()
                .map(|s| s.trim().to_string());
            let device_id = std::fs::read_to_string(dev.join("device"))
                .ok()
                .map(|s| s.trim().to_string());
            let vram_path = dev.join("mem_info_vram_total");
            if let Ok(v) = std::fs::read_to_string(&vram_path) {
                if let Ok(bytes) = v.trim().parse::<u64>() {
                    vram_gb = (bytes as f64 / 1_073_741_824.0).round() as u64;
                }
            }
            gpu_name = match (vendor, device_id) {
                (Some(v), Some(_)) => match v.trim() {
                    "0x10de" => String::from("NVIDIA"),
                    "0x1002" => String::from("AMD"),
                    "0x8086" => String::from("Intel"),
                    _ => format!("GPU ({})", v),
                },
                _ => continue,
            };
            break;
        }
    }

    // lspci fallback
    if gpu_name.is_empty() {
        if let Ok(out) = std::process::Command::new("lspci").output() {
            let s = String::from_utf8_lossy(&out.stdout);
            for line in s.lines() {
                let lower = line.to_lowercase();
                if lower.contains("vga") || lower.contains("3d") || lower.contains("display") {
                    if let Some((_, rest)) = line.split_once(' ') {
                        if let Some(name) = rest.trim().split(" (rev").next() {
                            gpu_name = name.trim().to_string();
                            break;
                        }
                    }
                }
            }
        }
    }

    // nvidia-smi VRAM fallback
    if vram_gb == 0 {
        if let Ok(out) = std::process::Command::new("nvidia-smi")
            .args(["--query-gpu=memory.total", "--format=csv,noheader,nounits"])
            .output()
        {
            if out.status.success() {
                vram_gb = String::from_utf8_lossy(&out.stdout)
                    .trim()
                    .parse::<u64>()
                    .unwrap_or(0);
            }
        }
    }

    if gpu_name.is_empty() {
        gpu_name = String::from("Unknown");
    }
    (gpu_name, vram_gb)
}

// ── macOS GPU ──────────────────────────────────────────────────────────────

#[cfg(target_os = "macos")]
fn get_gpu_info() -> (String, u64) {
    let mut gpu_name = String::from("Unknown");
    let mut vram_gb: u64 = 0;

    if let Ok(out) = std::process::Command::new("system_profiler")
        .args(["SPDisplaysDataType"])
        .output()
    {
        let s = String::from_utf8_lossy(&out.stdout);
        for line in s.lines() {
            let trimmed = line.trim();
            if let Some(val) = trimmed.strip_prefix("Chipset Model: ") {
                gpu_name = val.trim().to_string();
            }
            // "VRAM (Total): 16 GB" or "VRAM (Dynamic, Max): 16 GB"
            if trimmed.contains("VRAM") && trimmed.ends_with("GB") {
                if let Some(num) = trimmed.split(": ").nth(1) {
                    if let Some(gb) = num.trim().split(' ').next() {
                        vram_gb = gb.parse::<u64>().unwrap_or(0);
                    }
                }
            }
        }
    }

    (gpu_name, vram_gb)
}

// ── Windows GPU ────────────────────────────────────────────────────────────

#[cfg(target_os = "windows")]
fn get_gpu_info() -> (String, u64) {
    let mut gpu_name = String::from("Unknown");
    let mut vram_gb: u64 = 0;

    // Try PowerShell (modern) then fallback to wmic (legacy)
    let result = std::process::Command::new("powershell")
        .args([
            "-Command",
            "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM | Format-List",
        ])
        .output();

    if let Ok(out) = result {
        let s = String::from_utf8_lossy(&out.stdout);
        let mut got_name = false;
        for line in s.lines() {
            let trimmed = line.trim();
            if let Some(val) = trimmed.strip_prefix("Name : ") {
                gpu_name = val.trim().to_string();
                got_name = true;
            }
            if let Some(val) = trimmed.strip_prefix("AdapterRAM : ") {
                if let Ok(bytes) = val.trim().parse::<u64>() {
                    vram_gb = (bytes as f64 / 1_073_741_824.0).round() as u64;
                }
                if got_name {
                    break;
                }
            }
        }
    }

    // wmic fallback
    if gpu_name == "Unknown" {
        if let Ok(out) = std::process::Command::new("wmic")
            .args(["path", "win32_VideoController", "get", "name,adapterram"])
            .output()
        {
            let s = String::from_utf8_lossy(&out.stdout);
            for line in s.lines() {
                let trimmed = line.trim();
                if trimmed.is_empty() || trimmed.contains("Name") {
                    continue;
                }
                // Format: "NVIDIA GeForce RTX 3080  8589934592"
                let parts: Vec<&str> = trimmed.split_whitespace().collect();
                if parts.len() >= 2 {
                    if let Ok(bytes) = parts.last().unwrap_or(&"0").parse::<u64>() {
                        vram_gb = (bytes as f64 / 1_073_741_824.0).round() as u64;
                        let name = parts[..parts.len() - 1].join(" ");
                        if !name.is_empty() {
                            gpu_name = name;
                        }
                    }
                }
            }
        }
    }

    (gpu_name, vram_gb)
}

// ── Platform info ──────────────────────────────────────────────────────────

#[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
fn get_gpu_info() -> (String, u64) {
    (String::from("Unknown"), 0)
}

const KEY_FILES: &[&str] = &[
    "Cargo.toml",
    "package.json",
    "pyproject.toml",
    "go.mod",
    "README.md",
    "README",
    "docker-compose.yml",
    "Dockerfile",
    "Makefile",
    "CMakeLists.txt",
];

fn walk_tree(path: &std::path::Path, depth: usize, max_depth: usize) -> String {
    if depth > max_depth {
        return String::new();
    }
    let Ok(entries) = std::fs::read_dir(path) else {
        return String::new();
    };
    let mut result = String::new();
    let mut dirs: Vec<_> = Vec::new();
    let mut files: Vec<_> = Vec::new();
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with('.') || name == "node_modules" || name == "target" {
            continue;
        }
        if entry.file_type().map(|t| t.is_dir()).unwrap_or(false) {
            dirs.push(name);
        } else {
            files.push(name);
        }
    }
    dirs.sort();
    files.sort();
    let indent = "  ".repeat(depth);
    for d in &dirs {
        result.push_str(&format!("{}{}/\n", indent, d));
        let sub = walk_tree(&path.join(d), depth + 1, max_depth);
        result.push_str(&sub);
    }
    for f in &files {
        result.push_str(&format!("{}{}\n", indent, f));
    }
    result
}

#[tauri::command]
fn get_repo_context(path: String) -> Result<RepoContext, String> {
    let p = std::path::Path::new(&path);
    if !p.exists() || !p.is_dir() {
        return Err("Directory does not exist".to_string());
    }
    let tree = walk_tree(p, 0, 3);
    let mut files = Vec::new();
    for key in KEY_FILES {
        let fpath = p.join(key);
        if fpath.exists() && fpath.is_file() {
            let content = std::fs::read_to_string(&fpath).unwrap_or_default();
            if content.len() > 10_000 {
                files.push(FileContent {
                    path: key.to_string(),
                    content: format!("(truncated, {} bytes)", content.len()),
                });
            } else if !content.is_empty() {
                files.push(FileContent {
                    path: key.to_string(),
                    content,
                });
            }
        }
    }
    Ok(RepoContext { tree, files })
}

#[tauri::command]
fn validate_path(path: String) -> bool {
    std::fs::metadata(&path)
        .map(|m| m.is_dir())
        .unwrap_or(false)
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_memory();
    sys.refresh_cpu_all();

    let cpu_cores = sys.cpus().len() as u64;
    let total_ram_gb = (sys.total_memory() as f64 / 1_073_741_824.0).round() as u64;

    let os_name = System::name().unwrap_or_default();
    let os_ver = System::os_version().unwrap_or_default();
    let os = if os_ver.is_empty() {
        os_name
    } else {
        format!("{} {}", os_name, os_ver)
    };

    let (gpu, vram_gb) = get_gpu_info();

    SystemInfo {
        os,
        cpu_cores,
        total_ram_gb,
        gpu,
        vram_gb,
    }
}

fn stop_ollama() {
    #[cfg(target_os = "linux")]
    {
        let _ = std::process::Command::new("systemctl")
            .args(["--user", "stop", "ollama"])
            .output();
        let _ = std::process::Command::new("pkill").arg("ollama").output();
        let _ = std::process::Command::new("sudo")
            .args(["-n", "pkill", "ollama"])
            .output();
        let _ = std::process::Command::new("systemctl")
            .args(["stop", "ollama"])
            .output();
    }
    #[cfg(target_os = "macos")]
    {
        let _ = std::process::Command::new("pkill").arg("ollama").output();
    }
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("taskkill")
            .args(["/IM", "ollama.exe", "/F"])
            .output();
    }
}

#[tauri::command]
fn start_ollama() {
    #[cfg(target_os = "linux")]
    {
        let _ = std::process::Command::new("systemctl")
            .args(["--user", "start", "ollama"])
            .output();
    }
    #[cfg(not(target_os = "linux"))]
    {
        let _ = std::process::Command::new("ollama").arg("serve").spawn();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_system_info, get_repo_context, validate_path, start_ollama])
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                stop_ollama();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
