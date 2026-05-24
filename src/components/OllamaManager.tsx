import { useTranslation } from "react-i18next"
import { useOllamaStatus } from "../hooks/use-ollama"
import { InstallOllama } from "./ollama/InstallOllama"

export function OllamaManager() {
  const { t } = useTranslation()
  const { data: models, isLoading, error } = useOllamaStatus()

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

  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-[domine-bold] text-[var(--elevate-heading)]">
          {t("ollama.models")}
        </h2>
        <span className="text-sm text-[var(--elevate-muted)]">
          {models?.length ?? 0} {t("ollama.modelsCount")}
        </span>
      </div>

      <div className="space-y-3">
        {models?.map((model) => (
          <div
            key={model.digest}
            className="p-4 rounded-lg bg-[var(--elevate-input-bg)] flex items-center justify-between"
          >
            <div>
              <h3 className="font-[roboto-medium] text-[var(--elevate-heading)]">
                {model.name}
              </h3>
              <p className="text-sm text-[var(--elevate-muted)]">
                {(model.size / 1_000_000_000).toFixed(1)} GB
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
