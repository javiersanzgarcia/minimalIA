import { useTranslation } from "react-i18next"

export function LangToggle() {
  const { t, i18n } = useTranslation()

  const toggle = () => {
    const next = i18n.language === "en" ? "es" : "en"
    i18n.changeLanguage(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="font-[roboto-bold] text-sm tracking-wider opacity-70 hover:opacity-100 transition-opacity cursor-pointer !m-0 text-[var(--elevate-heading)] hover:!text-[var(--elevate-heading)] !bg-transparent hover:!bg-transparent border-none !p-0 h-auto leading-none"
      aria-label={t("lang.switchTo")}
    >
      {i18n.language === "en" ? "ES" : "EN"}
    </button>
  )
}
