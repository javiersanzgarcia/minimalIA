import type { CatalogModel } from "./domain/types"

export const chatModels: CatalogModel[] = [
  {
    name: "llama3.2",
    tag: "1b",
    size: "0.6 GB",
    descriptionKey: "ollama.catalog.chat.llama32",
  },
  {
    name: "phi3",
    tag: "mini",
    size: "2.2 GB",
    descriptionKey: "ollama.catalog.chat.phi3",
  },
  {
    name: "tinyllama",
    tag: "latest",
    size: "0.6 GB",
    descriptionKey: "ollama.catalog.chat.tinyllama",
  },
  {
    name: "gemma2",
    tag: "2b",
    size: "1.6 GB",
    descriptionKey: "ollama.catalog.chat.gemma2",
  },
  {
    name: "mistral",
    tag: "latest",
    size: "4.1 GB",
    descriptionKey: "ollama.catalog.chat.mistral",
  },
]

export const codeModels: CatalogModel[] = [
  {
    name: "deepseek-coder",
    tag: "1.3b",
    size: "0.8 GB",
    descriptionKey: "ollama.catalog.code.deepseek13",
  },
  {
    name: "deepseek-coder",
    tag: "6.7b",
    size: "3.8 GB",
    descriptionKey: "ollama.catalog.code.deepseek67",
  },
  {
    name: "starcoder2",
    tag: "3b",
    size: "1.7 GB",
    descriptionKey: "ollama.catalog.code.starcoder2",
  },
  {
    name: "qwen2.5-coder",
    tag: "1.5b",
    size: "0.9 GB",
    descriptionKey: "ollama.catalog.code.qwen15",
  },
  {
    name: "codegemma",
    tag: "2b",
    size: "1.4 GB",
    descriptionKey: "ollama.catalog.code.codegemma",
  },
]

export function modelFullName(m: CatalogModel): string {
  return m.tag === "latest" ? m.name : `${m.name}:${m.tag}`
}
