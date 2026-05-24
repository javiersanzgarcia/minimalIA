import { useTranslation } from "react-i18next"

export function InstallOllama() {
  const { t } = useTranslation()

  const handleInstall = async () => {
    const { openUrl } = await import("@tauri-apps/plugin-opener")
    await openUrl("https://ollama.com/download")
  }

  return (
    <section className="text-center py-20">
      <h2 className="text-3xl font-[domine-bold] text-[var(--elevate-heading)] mb-4">
        {t("ollama.notRunning")}
      </h2>
      <p className="text-[var(--elevate-muted)] max-w-lg mx-auto mb-8">
        {t("ollama.notRunningDesc")}
      </p>
      <button type="button" className="button-primary" onClick={handleInstall}>
        {t("ollama.install")}
      </button>
    </section>
  )
}
