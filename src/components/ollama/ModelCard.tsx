import { useTranslation } from "react-i18next"
import type { CatalogModel } from "../../data/models"
import { modelFullName } from "../../data/models"

export function ModelCard({
  model,
  onInstall,
  onRun,
  onUninstall,
  isInstalled,
  isPulling,
  isRunning,
  runDisabled,
  isUninstalling,
  result,
}: {
  model: CatalogModel
  onInstall: () => void
  onRun: () => void
  onUninstall: () => void
  isInstalled: boolean
  isPulling: boolean
  isRunning: boolean
  runDisabled: boolean
  isUninstalling: boolean
  result: string | null
}) {
  const { t } = useTranslation()
  const fullName = modelFullName(model)

  return (
    <div className="flex flex-col p-4 rounded-lg bg-[var(--elevate-input-bg)] w-full min-h-[190px] mb-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-[roboto-medium] text-[var(--elevate-heading)]">
            {fullName}
          </h3>
          <p className="text-sm text-[var(--elevate-muted)]">{model.size}</p>
        </div>
        <div className="shrink-0">
          {isInstalled ? (
            <div className="flex gap-2">
              <button
                type="button"
                className="button-primary !py-2 !px-4 !text-xs !h-auto"
                onClick={onRun}
                disabled={isRunning || runDisabled}
              >
                {isRunning ? t("ollama.running") : t("ollama.run")}
              </button>
              <button
                type="button"
                className="!py-2 !px-4 !text-xs !h-auto !bg-transparent !border !border-[var(--elevate-border)] !text-[var(--elevate-muted)] hover:!text-[var(--elevate-text)]"
                onClick={onUninstall}
                disabled={isUninstalling}
              >
                {isUninstalling
                  ? t("ollama.uninstalling")
                  : t("ollama.uninstall")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="button-primary !py-2 !px-4 !text-xs !h-auto !inline-flex !items-center !gap-1.5"
              onClick={onInstall}
              disabled={isPulling}
            >
              {isPulling ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="animate-spin -ml-1 mr-2 h-3 w-3 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {t("ollama.installing")}
                </>
              ) : (
                t("ollama.install")
              )}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--elevate-muted)] mt-2 flex-1">
        {t(model.descriptionKey)}
      </p>
      {result && (
        <p className="mt-auto text-sm text-[var(--elevate-text)] border-t border-[var(--elevate-border)] pt-3">
          {result}
        </p>
      )}
    </div>
  )
}
