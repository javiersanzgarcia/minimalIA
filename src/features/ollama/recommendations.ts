import type { SystemSpecs } from "./domain/types"

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
