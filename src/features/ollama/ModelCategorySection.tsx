import { useTranslation } from "react-i18next"
import { ChatView } from "./ChatView"
import type { CatalogModel } from "./catalog"
import { modelFullName } from "./catalog"
import { ModelCard } from "./ModelCard"
import type { ModelManager } from "./manager"
import { getRecommendedChat, getRecommendedCode } from "./system"
import { useSystemSpecs } from "./use-system-specs"

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
  const specs = useSystemSpecs()
  const recommended =
    specs &&
    (category === "chat"
      ? getRecommendedChat(specs)
      : getRecommendedCode(specs))
  const activeModel = manager.activeChat(category)
  const isActive = (name: string) => activeModel === name

  return (
    <section className="flex flex-col h-full">
      <h2 className="text-xl font-[domine-bold] text-[var(--elevate-heading)] mb-4 text-center">
        {t(`ollama.category.${category}`)}
      </h2>
      <div className="flex flex-col">
        {activeModel && (
          <>
            {models
              .filter((m) => isActive(modelFullName(m)))
              .map((m) => {
                const fullName = modelFullName(m)
                return (
                  <ModelCard
                    key={fullName}
                    model={m}
                    isRecommended={fullName === recommended}
                    onInstall={() => manager.install(fullName)}
                    onRun={() => manager.startChat(fullName, category)}
                    onStop={() => manager.stopChat(category)}
                    onUninstall={() => {
                      if (isActive(fullName)) manager.stopChat(category)
                      manager.uninstall(fullName)
                    }}
                    isInstalled={manager.isInstalled(fullName)}
                    isPulling={manager.isInstalling(fullName)}
                    isActive={isActive(fullName)}
                  />
                )
              })}
            <ChatView
              modelName={activeModel}
              category={category}
              onStop={() => manager.stopChat(category)}
            />
          </>
        )}
        {!activeModel &&
          [...models]
            .sort((a, b) => {
              const aRec = modelFullName(a) === recommended ? -1 : 0
              const bRec = modelFullName(b) === recommended ? -1 : 0
              return aRec - bRec
            })
            .map((m) => {
              const fullName = modelFullName(m)
              return (
                <ModelCard
                  key={fullName}
                  model={m}
                  isRecommended={fullName === recommended}
                  onInstall={() => manager.install(fullName)}
                  onRun={() => manager.startChat(fullName, category)}
                  onStop={() => manager.stopChat(category)}
                  onUninstall={() => manager.uninstall(fullName)}
                  isInstalled={manager.isInstalled(fullName)}
                  isPulling={manager.isInstalling(fullName)}
                  isActive={false}
                />
              )
            })}
      </div>
    </section>
  )
}
