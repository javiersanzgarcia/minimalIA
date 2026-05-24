# minimalIA

**minimalIA** is a local AI model manager for **Ollama**. Built with **Tauri v2** (Rust) + **React** (TypeScript), it lets you install, run, and uninstall local models with a single click. If Ollama is not running, the app starts it automatically (or guides you through installation).

![Screenshot](./screenshots/minimalIA.png)

---

## Features

- **Model catalog** — curated lightweight models for chat and code
- **One-click install/uninstall** — via Ollama REST API
- **Chat interface** — talk to any installed model directly
- **System-aware recommendations** — detects your GPU, RAM, and VRAM to suggest the best fit
- **Repository context** — point to a local repo and the code assistant reads the project tree + key files
- **Auto cleanup** — unloads models on chat close, stops Ollama on app exit
- **i18n** — English / Spanish UI
- **Dark / Light theme**

---

## Screaming Architecture + SOLID + KISS

The codebase follows **Screaming Architecture** (the folder structure screams "Ollama manager"), **SOLID** principles, and **KISS**:

```
src/features/ollama/
├── api/
│   ├── ollama.ts       # Ollama HTTP calls (sendChatMessage, unloadModel)
│   └── tauri.ts        # Tauri invoke wrappers (getSystemSpecs, validateRepoPath, …)
├── domain/
│   └── types.ts        # Shared type definitions
├── hooks/
│   └── useChat.ts      # Chat state hook (separates logic from presentation)
├── api.ts              # React Query hooks (useOllamaStatus, usePullModel, …)
├── catalog.ts          # Model catalog data
├── manager.ts          # useModelManager hook
├── recommendations.ts  # Model recommendation logic
├── system.ts           # System detection with browser fallback
├── ChatView.tsx        # Thin presentation component (delegates to useChat)
├── InstallOllama.tsx
├── ModelCard.tsx
├── ModelCategorySection.tsx
├── OllamaManager.tsx
├── SystemInfo.tsx
└── use-system-specs.ts
```

---

## Requirements

| Dependency | Notes |
|---|---|
| **Rust** (≥ 1.70) | `cargo` included |
| **Node.js** (≥ 18) | `npm` included |
| **Ollama** | [Download](https://ollama.com/download) |

### Linux (Debian/Ubuntu)

```sh
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

For macOS and Windows see the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/).

---

## Setting up Ollama as a user service

The app can start and stop Ollama automatically **only if Ollama runs as a user service** (not a system-wide service). Choose your platform:

<details>
<summary><b>Linux (systemd — user service)</b></summary>

```sh
# Stop the system-wide service if it exists
sudo systemctl stop ollama
sudo systemctl disable ollama

# Create the user service directory
mkdir -p ~/.config/systemd/user

# Write the service file
cat > ~/.config/systemd/user/ollama.service << 'EOF'
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF

# Enable and start the user service
systemctl --user daemon-reload
systemctl --user enable ollama
systemctl --user start ollama

# Ensure the service starts on login
loginctl enable-linger $(whoami)
```

When the app exits it runs `systemctl --user stop ollama`. On next launch it runs `systemctl --user start ollama`.
</details>

<details>
<summary><b>macOS (launchd)</b></summary>

```sh
# Create the LaunchAgent plist
mkdir -p ~/Library/LaunchAgents

cat > ~/Library/LaunchAgents/com.ollama.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load the agent
launchctl load ~/Library/LaunchAgents/com.ollama.plist
```

When the app exits it runs `pkill ollama`. On next launch it tries `ollama serve &`.
</details>

<details>
<summary><b>Windows</b></summary>

Ollama on Windows automatically installs itself as a background service. No extra setup is needed.

When the app exits it runs `taskkill /IM ollama.exe /F`. On next launch it tries to start `ollama serve` directly.
</details>

---

## Development

```sh
# Clone and install dependencies
npm install

# Start dev server with hot-reload (Tauri + Vite)
npm run tauri dev

# Production build (deb / rpm / appimage)
npm run tauri build

# Frontend-only (quick browser testing)
npm run dev
```

```sh
# Lint and format with Biome
npm run lint
npm run format
```

---

## Roadmap

### Phase 1 — Initialization
- [x] Scaffold Tauri v2 + React + TypeScript via `create-tauri-app`
- [x] Install Linux system dependencies (webkit2gtk, librsvg2, etc.)
- [x] Verify Rust compilation (`cargo check`) and full build (`.deb`, `.rpm`)
- [x] Configure **Tailwind CSS v4** with `@tailwindcss/vite`

### Phase 2 — Frontend stack
- [x] Integrate **@tanstack/react-query** (v5) — `QueryClientProvider` in `main.tsx`
- [x] Integrate **zustand** for global state

### Phase 3 — Elevate design system
- [x] Import Elevate10 base CSS
- [x] Extract fonts: **Roboto** (8 weights) and **Domine** (regular, bold)
- [x] Create `elevate-fonts.css`, `elevate-base.css`, `elevate-theme.css`

### Phase 4 — Dark/Light theme
- [x] Zustand store with `localStorage` persistence
- [x] Respect `prefers-color-scheme`
- [x] Toggle button with sun/moon icon

### Phase 5 — Tooling and refactor
- [x] Install **Biome** as linter + formatter
- [x] Replace all inline `style={}` with Tailwind arbitrary values
- [x] Fix CSS cascade collisions (use `!` prefix for `!important`)

### Phase 6 — Internationalization (i18n)
- [x] `react-i18next` + `i18next-browser-languagedetector`
- [x] EN/ES locale files
- [x] `LangToggle` component

### Phase 7 — Ollama model manager
- [x] Detect Ollama status (`GET /api/tags`)
- [x] Show install prompt if unavailable
- [x] Curated lightweight model catalog (chat + code categories)
- [x] Install via `POST /api/pull`, uninstall via `DELETE /api/delete`
- [x] Run model via `POST /api/generate`
- [x] Spinner + "Installing…" while pulling
- [x] Only one model per category can run at a time

### Phase 8 — Architecture refactor (Screaming Architecture + SOLID)
- [x] Group code by feature (`src/features/ollama/`, `theme/`, `i18n/`)
- [x] Eliminate generic `components/`, `hooks/`, `data/`, `store/` dirs
- [x] Apply SRP, OCP, DIP, KISS

### Phase 9 — System info
- [x] Rust `get_system_info` command with `sysinfo` crate
- [x] Cross-platform GPU detection
- [x] `SystemInfo` component
- [x] Dynamic model recommendations based on RAM/VRAM
- [x] Star + "Recommended" badge

### Phase 10 — Chat interface
- [x] `ChatView` with message history, input, and send button
- [x] AbortController for cancelling generation
- [x] Auto-scroll on new messages
- [x] "Stop" button (closes chat) + "Stop generation" (aborts response)
- [x] Uninstall while chat is open first stops the chat

### Phase 11 — Code assistant with repo context
- [x] Repository path input for code models
- [x] Path validation against filesystem (`validate_path`)
- [x] Rust `get_repo_context` — scans directory (3 levels, skips `.`/`node_modules`/`target`)
- [x] Reads key files (`package.json`, `Cargo.toml`, `README.md`, …)
- [x] Visible context message in chat: "Repository: /path"
- [x] Model receives project tree + key file contents

### Phase 12 — Cleanup on close
- [x] Unload model from RAM on chat close (`keep_alive: "0m"`)
- [x] `on_window_event` runs stop command on app exit
- [x] systemd user service for Ollama
- [x] Fallback strategies: `pkill`, `sudo -n pkill`, `systemctl stop`

### Phase 13 — Auto-start Ollama
- [x] Rust `start_ollama` command (`systemctl --user start ollama`)
- [x] On app launch, auto-start Ollama if it's not responding
- [x] "Start Ollama" button on the install screen for manual retry
- [x] `loginctl enable-linger` for automatic start on login

---

## License

MIT License — see the [LICENSE](LICENSE) file for details.
