export type Category = "chat" | "code"

export interface CatalogModel {
  name: string
  tag: string
  size: string
  descriptionKey: string
}

export interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
}

export interface SystemSpecs {
  os: string
  cores: number
  ram: number | null
  gpu: string
  vram: number | null
}

export interface ChatMessage {
  id: number
  role: "user" | "assistant" | "context"
  content: string
}

export interface RepoFileContent {
  path: string
  content: string
}

export interface RepoContextResult {
  tree: string
  files: RepoFileContent[]
}
