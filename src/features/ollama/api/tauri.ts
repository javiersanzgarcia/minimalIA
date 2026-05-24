import type { RepoContextResult, SystemSpecs } from "../domain/types"

export async function getSystemSpecs(): Promise<SystemSpecs | null> {
  try {
    const { invoke } = await import("@tauri-apps/api/core")
    const result = await invoke<{
      os: string
      cpu_cores: number
      total_ram_gb: number
      gpu: string
      vram_gb: number
    }>("get_system_info")
    return {
      os: result.os,
      cores: result.cpu_cores,
      ram: result.total_ram_gb,
      gpu: result.gpu,
      vram: result.vram_gb,
    }
  } catch {
    return null
  }
}

export async function validateRepoPath(path: string): Promise<boolean> {
  if (!path.trim()) return false
  try {
    const { invoke } = await import("@tauri-apps/api/core")
    return await invoke<boolean>("validate_path", { path })
  } catch {
    return false
  }
}

export async function getRepoContext(
  path: string,
): Promise<RepoContextResult | null> {
  try {
    const { invoke } = await import("@tauri-apps/api/core")
    return await invoke<RepoContextResult>("get_repo_context", { path })
  } catch {
    return null
  }
}

export async function startOllama(): Promise<void> {
  try {
    const { invoke } = await import("@tauri-apps/api/core")
    await invoke("start_ollama")
  } catch {
    /* not running in Tauri */
  }
}
