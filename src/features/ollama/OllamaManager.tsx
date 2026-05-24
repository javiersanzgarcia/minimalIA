import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useOllamaStatus } from "./api"
import { startOllama } from "./api/tauri"
import { chatModels, codeModels } from "./catalog"
import { InstallOllama } from "./InstallOllama"
import { ModelCategorySection } from "./ModelCategorySection"
import { useModelManager } from "./manager"
import { SystemInfo } from "./SystemInfo"

export function OllamaManager() {
  const { t } = useTranslation()
  const [retrying, setRetrying] = useState(false)
  const { data: installed, isLoading, error, refetch } = useOllamaStatus()
  const manager = useModelManager(installed)

  const handleRetry = useCallback(async () => {
    setRetrying(true)
    await startOllama()
    setTimeout(() => {
      refetch()
      setRetrying(false)
    }, 2000)
  }, [refetch])

  useEffect(() => {
    if (error && !retrying) handleRetry()
  }, [error, retrying, handleRetry])

  if (isLoading && !retrying) {
    return (
      <section className="text-center py-20">
        <p className="text-[var(--elevate-muted)]">{t("ollama.checking")}</p>
      </section>
    )
  }

  if (error) {
    return <InstallOllama onRetry={handleRetry} retrying={retrying} />
  }

  return (
    <div className="w-full">
      <p className="text-[var(--elevate-muted)] text-balance text-center mb-8">
        {t("ollama.summary")}
      </p>

      <SystemInfo />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <ModelCategorySection
          models={chatModels}
          category="chat"
          manager={manager}
        />
        <ModelCategorySection
          models={codeModels}
          category="code"
          manager={manager}
        />
      </div>
    </div>
  )
}
