import { getSystemSpecs as getTauriSpecs } from "./api/tauri"
import type { SystemSpecs } from "./domain/types"

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
  cached = (await getTauriSpecs()) ?? browserFallback()
  return cached
}
