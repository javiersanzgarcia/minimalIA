import { useQuery } from "@tanstack/react-query"

const OLLAMA_BASE = "http://localhost:11434"

export interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
}

interface TagsResponse {
  models: OllamaModel[]
}

export function useOllamaStatus() {
  return useQuery({
    queryKey: ["ollama-status"],
    queryFn: async () => {
      const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      })
      if (!res.ok) throw new Error("Ollama not available")
      const data: TagsResponse = await res.json()
      return data.models
    },
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
