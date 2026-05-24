import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useOllamaStatus,
  usePullModel,
  useRunModel,
} from "../../hooks/use-ollama"
import { InstallOllama } from "./InstallOllama"
import { chatModels, codeModels, modelFullName } from "./models"

function ModelCard({
  modelName,
  tag,
  size,
  descriptionKey,
  onInstall,
  onRun,
  isInstalled,
  isPulling,
  isRunning,
  result,
}: {
  modelName: string
  tag: string
  size: string
  descriptionKey: string
  onInstall: () => void
  onRun: () => void
  isInstalled: boolean
  isPulling: boolean
  isRunning: boolean
  result: string | null
}) {
  const { t } = useTranslation()
  const fullName = modelFullName({ name: modelName, tag, size, descriptionKey })

  return (
    <div className="flex flex-col p-4 rounded-lg bg-[var(--elevate-input-bg)] w-full min-h-[190px] mb-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-[roboto-medium] text-[var(--elevate-heading)]">
            {fullName}
          </h3>
          <p className="text-sm text-[var(--elevate-muted)]">{size}</p>
        </div>
        <div className="shrink-0">
          {isInstalled ? (
            <button
              type="button"
              className="button-primary !py-2 !px-4 !text-xs !h-auto"
              onClick={onRun}
              disabled={isRunning}
            >
              {isRunning ? t("ollama.running") : t("ollama.run")}
            </button>
          ) : (
            <button
              type="button"
              className="button-primary !py-2 !px-4 !text-xs !h-auto"
              onClick={onInstall}
              disabled={isPulling}
            >
              {isPulling ? t("ollama.installing") : t("ollama.install")}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--elevate-muted)] mt-2 flex-1">
        {t(descriptionKey)}
      </p>
      {result && (
        <p className="mt-auto text-sm text-[var(--elevate-text)] border-t border-[var(--elevate-border)] pt-3">
          {result}
        </p>
      )}
    </div>
  )
}

export function OllamaManager() {
  const { t } = useTranslation()
  const { data: installed, isLoading, error } = useOllamaStatus()
  const pullModel = usePullModel()
  const runModel = useRunModel()
  const [results, setResults] = useState<Record<string, string>>({})

  const isInstalled = (fullName: string) =>
    installed?.some(
      (m) => m.name === fullName || m.name.startsWith(`${fullName}:`),
    ) ?? false

  const handleInstall = (fullName: string) => {
    pullModel.mutate(fullName)
  }

  const handleRun = async (fullName: string) => {
    const res = await runModel.mutateAsync(fullName)
    setResults((prev) => ({ ...prev, [fullName]: res }))
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

  const renderCardList = (models: typeof chatModels) =>
    models.map((m) => {
      const fullName = modelFullName(m)
      return (
        <ModelCard
          key={fullName}
          modelName={m.name}
          tag={m.tag}
          size={m.size}
          descriptionKey={m.descriptionKey}
          onInstall={() => handleInstall(fullName)}
          onRun={() => handleRun(fullName)}
          isInstalled={isInstalled(fullName)}
          isPulling={pullModel.isPending && pullModel.variables === fullName}
          isRunning={runModel.isPending && runModel.variables === fullName}
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
            {renderCardList(chatModels)}
          </div>
        </section>

        <section className="flex flex-col h-full">
          <h2 className="text-xl font-[domine-bold] text-[var(--elevate-heading)] mb-4 text-center">
            {t("ollama.category.code")}
          </h2>
          <div className="flex flex-col">
            {renderCardList(codeModels)}
          </div>
        </section>
      </div>
    </div>
  )
}
