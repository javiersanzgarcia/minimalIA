import { useTranslation } from "react-i18next"
import type { CatalogModel } from "./catalog"
import { modelFullName } from "./catalog"

export function ModelCard({
  model,
  isRecommended,
  onInstall,
  onRun,
  onStop,
  onUninstall,
  isInstalled,
  isPulling,
  isActive,
}: {
  model: CatalogModel
  isRecommended: boolean
  onInstall: () => void
  onRun: () => void
  onStop: () => void
  onUninstall: () => void
  isInstalled: boolean
  isPulling: boolean
  isActive: boolean
}) {
  const { t } = useTranslation()
  const fullName = modelFullName(model)

  return (
    <div className="flex flex-col p-4 rounded-lg bg-[var(--elevate-input-bg)] w-full min-h-[190px] mb-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-[roboto-medium] text-[var(--elevate-heading)] flex items-center gap-1.5">
            {isRecommended && (
              <svg
                aria-hidden="true"
                className="h-4 w-4 text-yellow-500 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            {fullName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-[var(--elevate-muted)]">{model.size}</p>
            {isRecommended && (
              <span className="text-[10px] uppercase tracking-wider font-[roboto-bold] text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                {t("ollama.recommended")}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0">
          {isInstalled ? (
            <div className="flex gap-2">
              <button
                type="button"
                className="button-primary !py-2 !px-4 !text-xs !h-auto"
                onClick={isActive ? onStop : onRun}
              >
                {isActive ? t("ollama.stop") : t("ollama.run")}
              </button>
              <button
                type="button"
                className="!py-2 !px-4 !text-xs !h-auto !bg-transparent !border !border-[var(--elevate-border)] !text-[var(--elevate-muted)] hover:!text-[var(--elevate-text)]"
                onClick={onUninstall}
                disabled={isPulling}
              >
                {t("ollama.uninstall")}
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
    </div>
  )
}
