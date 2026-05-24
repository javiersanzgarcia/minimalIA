import { LangToggle } from "./features/i18n/LangToggle"
import { OllamaManager } from "./features/ollama/OllamaManager"
import { ThemeToggle } from "./features/theme/ThemeToggle"
import "./App.css"

function App() {
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

      <main className="w-full px-8 py-0">
        <OllamaManager />
      </main>
    </div>
  )
}

export default App
