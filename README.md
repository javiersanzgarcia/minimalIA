# minimalIA

A desktop application built with **Tauri v2** (Rust) + **React** (TypeScript) — a side project to learn Rust integration in a modern cross-platform app.

---

## Roadmap

### Fase 1 — Inicialización

- [x] Scaffold Tauri v2 + React + TypeScript con `create-tauri-app`
- [x] Instalar dependencias del sistema Linux (webkit2gtk, librsvg2, etc.)
- [x] Verificar compilación Rust (`cargo check`) y build completo (`.deb`, `.rpm`)
- [x] Configurar **Tailwind CSS v4** con `@tailwindcss/vite`

### Fase 2 — Stack frontend

- [x] Integrar **@tanstack/react-query** (React Query v5) — `QueryClientProvider` en `main.tsx`
- [x] Integrar **zustand** para manejo de estado global
- [x] Store de ejemplo: `src/store/use-counter.ts` → migrado a `src/store/use-theme.ts`

### Fase 3 — Sistema de diseño Elevate

- [x] Importar base CSS **Elevate10** desde `/home/pracker/Descargas/Elevate10`
- [x] Extraer tipografía: fuentes **Roboto** (8 pesos) y **Domine** (regular, bold)
- [x] Crear `src/styles/elevate-fonts.css` — declaraciones `@font-face`
- [x] Crear `src/styles/elevate-base.css` — helpers y resets
- [x] Crear `src/styles/elevate-theme.css` — sistema de colores, tipografía, botones, formularios con variables CSS

### Fase 4 — Tema oscuro/claro

- [x] Store Zustand `use-theme.ts` con persistencia a `localStorage`
- [x] Respeta `prefers-color-scheme` del sistema operativo
- [x] Aplica clase `dark` en `<html>` para activar variables CSS del tema oscuro
- [x] Alternar tema con botón sol/luna en el header
- [x] Variables CSS adaptadas para light/dark en `elevate-theme.css`
- [x] Extraer `ThemeToggle` a `src/components/ThemeToggle.tsx` como <button> semántico

### Fase 5 — Tooling y refactor

- [x] Instalar **Biome** (`@biomejs/biome`) como linter + formateador
- [x] Configurar `biome.json` — sin punto y coma (`semicolons: "asNeeded"`), indentación space 2
- [x] Reemplazar todos los `style={}` inline por clases Tailwind con valores arbitrarios (`bg-[var(--elevate-bg)]`, `font-[roboto-black]`, etc.)
- [x] Corregir colisión de capas CSS: `@layer utilities` de Tailwind v4 vs reglas sin capa de elevate-theme.css — usar `!` prefix en clases para `!important`

### Fase 6 — Internacionalización (i18n)

- [x] Instalar `react-i18next` + `i18next` + `i18next-browser-languagedetector`
- [x] Crear `src/i18n/i18n.ts` con configuración (fallback inglés, detección automática)
- [x] Crear traducciones EN/ES en `src/i18n/locales/`
- [x] Crear `LangToggle` — botón EN/ES a la derecha del selector de tema
- [x] Reemplazar textos estáticos por `useTranslation()` en App.tsx y ThemeToggle

---

## Referencias

| Recurso | Uso |
|---|---|
| **[Tauri v2](https://v2.tauri.app)** | Framework de escritorio multiplataforma (Rust + webview) |
| **[React 19](https://react.dev)** | UI declarativa con TypeScript |
| **[Vite](https://vite.dev)** | Build tool y dev server |
| **[Tailwind CSS v4](https://tailwindcss.com)** | Utilidades CSS, integrado via `@tailwindcss/vite` |
| **[@tanstack/react-query](https://tanstack.com/query/latest)** | Data fetching y caché asíncrona |
| **[Zustand](https://github.com/pmndrs/zustand)** | Estado global liviano |
| **[react-i18next](https://react.i18next.com)** | Internacionalización (i18n) con detección de idioma del navegador |
| **[Biome](https://biomejs.dev)** | Linter y formateador de código |
| **[Elevate10](https://www.styleshout.com)** | Plantilla landing page — fuentes Roboto/Domine, sistema de diseño base |
| **Font Awesome** | (disponible en Elevate, no usado — se prefieren SVG inline) |

---

## Requisitos

- **Rust** (≥1.70) con `cargo`
- **Node.js** (≥18) con `npm`
- **Linux**: `libwebkit2gtk-4.1-dev`, `librsvg2-dev`, `build-essential`, `libssl-dev`, `libayatana-appindicator3-dev`

```sh
# Debian/Ubuntu
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

Para macOS y Windows consulta la [guía de prerequisitos de Tauri](https://v2.tauri.app/start/prerequisites/).

---

## Desarrollo

```sh
# Clonar e instalar dependencias
npm install

# Iniciar servidor de desarrollo con hot-reload (Tauri + Vite)
npm run tauri dev

# Build de producción (binario + paquetes .deb/.rpm/.appimage)
npm run tauri build

# Solo frontend (para pruebas rápidas en navegador)
npm run dev
```

El comando `npm run tauri dev` levanta Vite en el puerto 1420 y abre la ventana nativa de Tauri con hot-reload en ambos lados (Rust y React).

```sh
# Linting y formato con Biome
npm run lint
npm run format
```

---

## Estructura del proyecto

```
minimalIA/
├── src/                    # Frontend React + TypeScript
│   ├── assets/fonts/       # Fuentes Roboto y Domine (woff/woff2)
│   ├── components/
│   │   ├── LangToggle.tsx   # Selector de idioma EN/ES
│   │   └── ThemeToggle.tsx  # Botón de cambio de tema
│   ├── i18n/
│   │   ├── i18n.ts          # Configuración de react-i18next
│   │   └── locales/
│   │       ├── en.json      # Traducciones inglés
│   │       └── es.json      # Traducciones español
│   ├── styles/
│   │   ├── elevate-fonts.css
│   │   ├── elevate-base.css
│   │   └── elevate-theme.css
│   ├── store/
│   │   └── use-theme.ts    # Estado del tema (Zustand)
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── src-tauri/              # Backend Rust (Tauri)
│   ├── src/lib.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── index.html
├── biome.json               # Configuración de Biome (linter + formateador)
├── package.json
├── vite.config.ts
└── README.md
```

---

## Licencia

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
