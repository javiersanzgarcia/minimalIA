import { useState } from "react"
import {
  type OllamaModel,
  useDeleteModel,
  usePullModel,
  useRunModel,
} from "./api"

type Category = "chat" | "code"

export interface ModelManager {
  results: Record<string, string>
  isInstalled: (name: string) => boolean
  isInstalling: (name: string) => boolean
  isRunning: (name: string, category: Category) => boolean
  isAnyRunning: (category: Category) => boolean
  isUninstalling: (name: string) => boolean
  install: (name: string) => Promise<void>
  run: (name: string, category: Category) => Promise<void>
  uninstall: (name: string) => void
}

export function useModelManager(
  installed: OllamaModel[] | undefined,
): ModelManager {
  const pullModel = usePullModel()
  const runModel = useRunModel()
  const deleteModel = useDeleteModel()
  const [results, setResults] = useState<Record<string, string>>({})
  const [installingModels, setInstallingModels] = useState<
    Record<string, boolean>
  >({})
  const [runningModel, setRunningModel] = useState<{
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
      /* error handled — button returns to "Install" */
    } finally {
      setInstallingModels((prev) => ({ ...prev, [name]: false }))
    }
  }

  const run = async (name: string, category: Category) => {
    setRunningModel((prev) => ({ ...prev, [category]: name }))
    try {
      const res = await runModel.mutateAsync(name)
      setResults((prev) => ({ ...prev, [name]: res }))
    } catch {
      /* error handled — button returns to "Run" */
    } finally {
      setRunningModel((prev) => ({ ...prev, [category]: null }))
    }
  }

  const uninstall = (name: string) => {
    deleteModel.mutate(name)
  }

  return {
    results,
    isInstalled,
    isInstalling: (name: string) => installingModels[name] ?? false,
    isRunning: (name: string, category: Category) =>
      runningModel[category] === name,
    isAnyRunning: (category: Category) => runningModel[category] !== null,
    isUninstalling: (name: string) =>
      deleteModel.isPending && deleteModel.variables === name,
    install,
    run,
    uninstall,
  }
}
