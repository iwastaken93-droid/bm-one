# BridgeMind One 🧠

> The Multi-Agent AI Workspace & Coding Harness — Built with React 18, TypeScript, and Tauri v2.

---

## 🌟 Overview

**BridgeMind One** is a high-performance desktop workspace designed for orchestrating autonomous AI coding agents, managing project workspaces, running interactive terminal sessions, and scheduling recurring developer routines.

### Key Capabilities:
- **13 AI Agent Drivers:** Claude Code, Codex CLI, Cursor Agent, Google Gemini CLI, GitHub Copilot, Droid, OpenCode, DeepSeek, Grok Build, Amp, Antigravity, Aider, and Terminal PTY.
- **24 Ecosystem Plugins & MCP Connectors:** Seamless integrations for GitHub, Vercel, Supabase, Cloudflare, Linear, Notion, Stripe, RevenueCat, Unreal Engine, Unity, Blender, and more.
- **Workspace Studio:** Recursive tiling window manager supporting splits up to 16 levels deep, ConPTY terminals, embedded browsers, and code diff viewers.
- **Agent Working Memory & Skills Catalog:** SQLite Write-Ahead Logging (`WAL`) storage for long-term memory, context retention, and custom tool extensions.
- **Automated Routines:** Built-in interval and clock cadence scheduler for recurring tasks.
- **Offline In-Bundle Mock Engine:** Runs completely in any web browser without requiring a native backend.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/) (v1.75+)
- [C++ Build Tools for Windows](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (or platform build essentials)

---

### 1. Web Development / Mock Mode (Browser Only)
Run the application in browser development mode with the built-in mock simulation server:

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open **`http://localhost:1420/`** in your browser.

---

### 2. Native Desktop Development (Tauri v2)
Run the application as a live hot-reloading native desktop app:

```bash
npm run tauri dev
```

---

### 3. Production Release Build

#### Build Frontend Assets:
```bash
npm run build
```

#### Build Standalone Desktop Binary:
```bash
cargo build --release --manifest-path src-tauri/Cargo.toml
```
The optimized native executable will be available at `src-tauri/target/release/bridgemind-one-rust.exe`.

---

## 📁 Repository Structure

```
bridgemind-one/
├── .github/workflows/release.yml   # Multi-platform CI/CD release workflow
├── package.json                    # Frontend dependencies & scripts
├── vite.config.ts                  # Vite + React configuration
├── tsconfig.json                   # TypeScript configuration
├── index.html                      # Webview document entrypoint
│
├── src/                            # Frontend TypeScript + React Source (56 files)
│   ├── types/                      # Zod 3 runtime schemas & type definitions
│   ├── services/                   # Tauri native IPC & in-memory mock backend
│   ├── hooks/                      # 29-action reducer, useAuth, useAgentMind, useRoutines
│   └── components/                 # UI design system components (Agent, Code, Chat, Auth)
│
└── src-tauri/                      # Backend Rust + Tauri v2 Source (12 files)
    ├── Cargo.toml                  # 92 discovered Rust dependencies
    ├── tauri.conf.json             # Desktop app window & security configuration
    └── src/
        ├── main.rs & lib.rs        # App runtime & plugin initialization
        ├── app/                    # 65+ IPC command handlers & SQLite mind storage
        └── platform/               # Windows ConPTY & Credential Manager integrations
```

---

## 📦 CI/CD & Automated Releases

A GitHub Action is configured in `.github/workflows/release.yml`. When you push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow automatically builds and drafts a cross-platform GitHub Release with binary installers:
- **Windows:** `.exe` and `.msi` installers
- **macOS:** `.dmg` and `.app` bundles (Intel and Apple Silicon)
- **Linux:** `.AppImage` and `.deb` packages

---

## 📄 License
MIT License
