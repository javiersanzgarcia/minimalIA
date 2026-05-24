import { useTranslation } from "react-i18next"
import { useOllamaStatus } from "./api"
import { chatModels, codeModels } from "./catalog"
import { InstallOllama } from "./InstallOllama"
import { ModelCategorySection } from "./ModelCategorySection"
import { useModelManager } from "./manager"

export function OllamaManager() {
  const { t } = useTranslation()
  const { data: installed, isLoading, error } = useOllamaStatus()
  const manager = useModelManager(installed)

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
    <div className="w-full">
      <p className="text-[var(--elevate-muted)] text-balance text-center mb-8">
        {t("ollama.summary")}
      </p>

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
