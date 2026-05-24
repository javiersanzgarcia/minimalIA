import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { CatalogModel } from "../../data/models"
import { chatModels, codeModels, modelFullName } from "../../data/models"
import {
  useDeleteModel,
  useOllamaStatus,
  usePullModel,
  useRunModel,
} from "../../hooks/use-ollama"
import { InstallOllama } from "./InstallOllama"
import { ModelCard } from "./ModelCard"

export function OllamaManager() {
  const { t } = useTranslation()
  const { data: installed, isLoading, error } = useOllamaStatus()
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

  const isInstalled = (fullName: string) =>
    installed?.some(
      (m) => m.name === fullName || m.name.startsWith(`${fullName}:`),
    ) ?? false

  const handleInstall = async (fullName: string) => {
    setInstallingModels((prev) => ({ ...prev, [fullName]: true }))
    try {
      await pullModel.mutateAsync(fullName)
    } catch {
      // error handled — model stays uninstalled, button returns to "Install"
    } finally {
      setInstallingModels((prev) => ({ ...prev, [fullName]: false }))
    }
  }

  const handleRun = async (fullName: string, category: "chat" | "code") => {
    setRunningModel((prev) => ({ ...prev, [category]: fullName }))
    try {
      const res = await runModel.mutateAsync(fullName)
      setResults((prev) => ({ ...prev, [fullName]: res }))
    } catch {
      // error handled — button returns to "Run"
    } finally {
      setRunningModel((prev) => ({ ...prev, [category]: null }))
    }
  }

  if (isLoading) {
    return (
      <section className="text-center py-20">
        <p className="text-[var(--elevate-muted)]">{t("ollama.checking")}</p>
      </section>
    )
  }

  if (error) {
    return <InstallOllama />
  }

  const renderCardList = (models: CatalogModel[], category: "chat" | "code") =>
    models.map((m) => {
      const fullName = modelFullName(m)
      const isThisPulling = installingModels[fullName] ?? false
      const isThisRunning = runningModel[category] === fullName
      const isCategoryBusy = runningModel[category] !== null
      return (
        <ModelCard
          key={fullName}
          model={m}
          onInstall={() => handleInstall(fullName)}
          onRun={() => handleRun(fullName, category)}
          onUninstall={() => deleteModel.mutate(fullName)}
          isInstalled={isInstalled(fullName)}
          isPulling={isThisPulling}
          isRunning={isThisRunning}
          runDisabled={isCategoryBusy && !isThisRunning}
          isUninstalling={
            deleteModel.isPending && deleteModel.variables === fullName
          }
          result={results[fullName] ?? null}
        />
      )
    })

  return (
    <div className="w-full px-4">
      <p className="text-[var(--elevate-muted)] text-balance text-center mb-8">
        {t("ollama.summary")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <section className="flex flex-col h-full">
          <h2 className="text-xl font-[domine-bold] text-[var(--elevate-heading)] mb-4 text-center">
            {t("ollama.category.chat")}
          </h2>
          <div className="flex flex-col">
            {renderCardList(chatModels, "chat")}
          </div>
        </section>

        <section className="flex flex-col h-full">
          <h2 className="text-xl font-[domine-bold] text-[var(--elevate-heading)] mb-4 text-center">
            {t("ollama.category.code")}
          </h2>
          <div className="flex flex-col">
            {renderCardList(codeModels, "code")}
          </div>
        </section>
      </div>
    </div>
  )
}
