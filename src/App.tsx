import { useTranslation } from "react-i18next"
import { LangToggle } from "./components/LangToggle"
import { ThemeToggle } from "./components/ThemeToggle"
import "./App.css"

function App() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--elevate-bg)] text-[var(--elevate-text)]">
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-3xl leading-none m-0 text-[var(--elevate-heading)] font-[roboto-black]">
          minimalIA
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LangToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12 text-center">
        <section className="mb-16">
          <h5 className="text-[var(--elevate-accent)] tracking-[.4rem]">
            {t("app.tagline")}
          </h5>
          <h1 className="mt-2 font-[domine-bold]">{t("app.headline")}</h1>
          <p className="lead max-w-2xl mx-auto mt-6">{t("app.description")}</p>
        </section>

        <section className="mb-16">
          <div className="flex flex-wrap justify-center gap-6">
            <button type="button" className="button-primary">
              {t("hero.getStarted")}
            </button>
            <button type="button" className="stroke">
              {t("hero.learnMore")}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { titleKey: "features.rustCore", descKey: "features.rustCoreDesc" },
            {
              titleKey: "features.reactFrontend",
              descKey: "features.reactFrontendDesc",
            },
            { titleKey: "features.tailwind", descKey: "features.tailwindDesc" },
          ].map((f, i) => (
            <article
              key={f.titleKey}
              className="p-6 rounded-lg bg-[var(--elevate-input-bg)]"
            >
              <span className="block text-4xl mb-4 text-[var(--elevate-accent)] font-[roboto-bold]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-[roboto-medium]">{t(f.titleKey)}</h3>
              <p className="text-[var(--elevate-muted)]">{t(f.descKey)}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 pt-8 border-t-[1px_solid_var(--elevate-border)]">
          <blockquote className="text-center max-w-xl mx-auto border-none pl-0">
            <p>{t("quote.text")}</p>
            <cite>{t("quote.author")}</cite>
          </blockquote>
        </section>
      </main>
    </div>
  )
}

export default App
