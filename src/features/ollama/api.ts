import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
    queryKey: ["ollama-models"],
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

export function usePullModel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (modelName: string) => {
      const res = await fetch(`${OLLAMA_BASE}/api/pull`, {
        method: "POST",
        body: JSON.stringify({ name: modelName }),
      })
      if (!res.ok) throw new Error(`Failed to pull model ${modelName}`)
      const reader = res.body?.getReader()
      if (!reader) return
      while (true) {
        const { done } = await reader.read()
        if (done) break
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ollama-models"] })
    },
  })
}

export function useRunModel() {
  return useMutation({
    mutationFn: async (modelName: string) => {
      const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
        method: "POST",
        body: JSON.stringify({
          model: modelName,
          prompt: "Hello, respond with a single sentence.",
          stream: false,
        }),
      })
      if (!res.ok) throw new Error(`Failed to run model ${modelName}`)
      const data = await res.json()
      return data.response as string
    },
  })
}

export function useDeleteModel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (modelName: string) => {
      const res = await fetch(`${OLLAMA_BASE}/api/delete`, {
        method: "DELETE",
        body: JSON.stringify({ name: modelName }),
      })
      if (!res.ok) throw new Error(`Failed to delete model ${modelName}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ollama-models"] })
    },
  })
}
