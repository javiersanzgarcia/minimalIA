import { useTranslation } from "react-i18next"
import type { CatalogModel } from "./catalog"
import { modelFullName } from "./catalog"
import { ModelCard } from "./ModelCard"
import type { ModelManager } from "./manager"

export function ModelCategorySection({
  models,
  category,
  manager,
}: {
  models: CatalogModel[]
  category: "chat" | "code"
  manager: ModelManager
}) {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col h-full">
      <h2 className="text-xl font-[domine-bold] text-[var(--elevate-heading)] mb-4 text-center">
        {t(`ollama.category.${category}`)}
      </h2>
      <div className="flex flex-col">
        {models.map((m) => {
          const fullName = modelFullName(m)
          return (
            <ModelCard
              key={fullName}
              model={m}
              onInstall={() => manager.install(fullName)}
              onRun={() => manager.run(fullName, category)}
              onUninstall={() => manager.uninstall(fullName)}
              isInstalled={manager.isInstalled(fullName)}
              isPulling={manager.isInstalling(fullName)}
              isRunning={manager.isRunning(fullName, category)}
              runDisabled={
                manager.isAnyRunning(category) &&
                !manager.isRunning(fullName, category)
              }
              isUninstalling={manager.isUninstalling(fullName)}
              result={manager.results[fullName] ?? null}
            />
          )
        })}
      </div>
    </section>
  )
}
