import { useState } from "react"
import { useDeleteModel, usePullModel } from "./api"
import { unloadModel } from "./api/ollama"
import type { Category, OllamaModel } from "./domain/types"

export interface ModelManager {
  isInstalled: (name: string) => boolean
  isInstalling: (name: string) => boolean
  isUninstalling: (name: string) => boolean
  activeChat: (category: Category) => string | null
  install: (name: string) => Promise<void>
  startChat: (name: string, category: Category) => void
  stopChat: (category: Category) => void
  uninstall: (name: string) => void
}

export function useModelManager(
  installed: OllamaModel[] | undefined,
): ModelManager {
  const pullModel = usePullModel()
  const deleteModel = useDeleteModel()
  const [installingModels, setInstallingModels] = useState<
    Record<string, boolean>
  >({})
  const [activeChat, setActiveChat] = useState<{
    chat: string | null
    code: string | null
  }>({ chat: null, code: null })

  const isInstalled = (name: string) =>
    installed?.some((m) => m.name === name || m.name.startsWith(`${name}:`)) ??
    false

  const install = async (name: string) => {
    setInstallingModels((prev) => ({ ...prev, [name]: true }))
    try {
      await pullModel.mutateAsync(name)
    } catch {
      /* error handled */
    } finally {
      setInstallingModels((prev) => ({ ...prev, [name]: false }))
    }
  }

  const startChat = (name: string, category: Category) => {
    setActiveChat((prev) => ({ ...prev, [category]: name }))
  }

  const stopChat = (category: Category) => {
    const modelName = activeChat[category]
    if (modelName) unloadModel(modelName)
    setActiveChat((prev) => ({ ...prev, [category]: null }))
  }

  const uninstall = (name: string) => {
    deleteModel.mutate(name)
  }

  return {
    isInstalled,
    isInstalling: (name: string) => installingModels[name] ?? false,
    isUninstalling: (name: string) =>
      deleteModel.isPending && deleteModel.variables === name,
    activeChat: (category: Category) => activeChat[category],
    install,
    startChat,
    stopChat,
    uninstall,
  }
}
