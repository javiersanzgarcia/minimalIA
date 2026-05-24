export interface SystemSpecs {
  os: string
  cores: number
  ram: number | null
  gpu: string
  vram: number | null
}

declare global {
  interface Navigator {
    deviceMemory?: number
  }
}

function detectGPUBrowser(): string {
  try {
    const canvas = document.createElement("canvas")
    const gl =
      canvas.getContext("webgl2") ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null)
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info")
      if (ext) {
        return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string
      }
      return gl.getParameter(gl.RENDERER) as string
    }
  } catch {
    /* GPU detection failed */
  }
  return "Unknown"
}

function browserFallback(): SystemSpecs {
  return {
    os: navigator.platform,
    cores: navigator.hardwareConcurrency ?? 0,
    ram: navigator.deviceMemory ?? null,
    gpu: detectGPUBrowser(),
    vram: null,
  }
}

let cached: SystemSpecs | null = null

export async function getSystemSpecs(): Promise<SystemSpecs> {
  if (cached) return cached

  try {
    const { invoke } = await import("@tauri-apps/api/core")
    const result = await invoke<{
      os: string
      cpu_cores: number
      total_ram_gb: number
      gpu: string
      vram_gb: number
    }>("get_system_info")

    cached = {
      os: result.os,
      cores: result.cpu_cores,
      ram: result.total_ram_gb,
      gpu: result.gpu,
      vram: result.vram_gb,
    }
  } catch {
    cached = browserFallback()
  }

  return cached
}

export function getRecommendedChat(specs: SystemSpecs): string {
  const mem = Math.max(specs.ram ?? 0, specs.vram ?? 0)
  if (mem < 4 || specs.cores <= 2) return "tinyllama"
  if (mem < 8) return "phi3:mini"
  if (mem < 16) return "gemma2:2b"
  return "mistral"
}

export function getRecommendedCode(specs: SystemSpecs): string {
  const mem = Math.max(specs.ram ?? 0, specs.vram ?? 0)
  if (mem < 4 || specs.cores <= 2) return "deepseek-coder:1.3b"
  if (mem < 8) return "starcoder2:3b"
  return "deepseek-coder:6.7b"
}

export async function validateRepoPath(path: string): Promise<boolean> {
  if (!path.trim()) return false
  try {
    const { invoke } = await import("@tauri-apps/api/core")
    return await invoke<boolean>("validate_path", { path })
  } catch {
    try {
      const req = await fetch(`file://${path}`)
      return req.ok
    } catch {
      return false
    }
  }
}

interface RepoFileContent {
  path: string
  content: string
}

interface RepoContextResult {
  tree: string
  files: RepoFileContent[]
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
