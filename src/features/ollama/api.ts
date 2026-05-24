import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { OllamaModel } from "./domain/types"

const OLLAMA_BASE = "http://localhost:11434"

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
