import { useTranslation } from "react-i18next"

export function InstallOllama({
  onRetry,
  retrying,
}: {
  onRetry: () => void
  retrying: boolean
}) {
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
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          className="button-primary"
          onClick={handleInstall}
        >
          {t("ollama.install")}
        </button>
        <button
          type="button"
          className="!py-2 !px-4 !text-xs !h-auto !bg-transparent !border !border-[var(--elevate-border)] !text-[var(--elevate-muted)] hover:!text-[var(--elevate-text)]"
          onClick={onRetry}
          disabled={retrying}
        >
          {retrying ? t("ollama.checking") : t("ollama.retry")}
        </button>
      </div>
    </section>
  )
}
