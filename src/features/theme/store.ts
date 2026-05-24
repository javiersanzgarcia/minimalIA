import { create } from "zustand"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  toggle: () => void
}

function getInitialTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("elevate-theme") as Theme | null
    if (stored) return stored
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  return "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

const initial = getInitialTheme()
applyTheme(initial)

export const useTheme = create<ThemeState>((set) => ({
  theme: initial,
  toggle: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("elevate-theme", next)
      applyTheme(next)
      return { theme: next }
    }),
}))
