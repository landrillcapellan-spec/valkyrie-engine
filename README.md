# AI Hollywood Studio

AI-powered filmmaking platform for Windows — Phase 1 foundation.

A local-first, extensible desktop application in which specialized AI departments work together like a professional Hollywood production crew. The filmmaker remains the creative authority.

## Current Status — Phase 1 (Application Foundation)

Implemented and working:

- **Windows desktop shell** — Tauri 2 with a Rust backend and React/TypeScript frontend.
- **ChatGPT-style UI** — Conversational interface with sidebar navigation (New Project, Recent Projects, My Films, Character Library, Location Library, Model Library, Plugin Marketplace, Settings), top bar, and workspace area.
- **Two workspace modes** — Chat Mode (conversational filmmaking) and Studio Mode (Virtual Production Studio with the 14 AI departments and hardware profile), switchable without interrupting production.
- **Project management** — Create and list projects; persisted locally in SQLite (`database.sqlite`) under the app data directory.
- **Backend connection** — Tauri IPC commands (`project_create`, `project_list`, `project_get`, `app_info`, etc.) wired from frontend to Rust backend.
- **Hardware detection** — GPU (via `nvidia-smi`), VRAM, RAM, CPU cores, storage, OS, and a recommended quality preset (Low/Medium/High/Ultra).
- **Model Adapter interface** — Modular `ModelAdapter` trait with `ModelAdapterInfo` (capabilities, hardware requirements, dependencies, license, status). Initial model definitions: Wan 2.2, LTX-Video, RealVisXL.
- **Virtual Production Studio** — Department status cards and hardware profile panel.

## What is NOT yet implemented (planned phases)

Per the product vision, Phase 1 is the foundation only. The following are planned for later phases and are NOT yet functional:

- Python AI backend service (Phase 2)
- Actual model loading/inference (Wan 2.2, LTX-Video, RealVisXL adapters return `NotInstalled`; installation is a stub pointing to Phase 3)
- Novel-to-film, Prompt-to-film, Video Continuation generation
- Character/Location libraries, Visual Approval Gate, Production Bible
- Video segmentation, batch generation, checkpoints
- Cinematography, performance, combat, physics, audio departments
- Virtual production / previsualization, editing suite, title director
- Plugin SDK / marketplace, collaboration, licensing

No fake generation buttons or simulated model integrations are present. Unimplemented features are clearly marked.

## Hardware (initial development target)

- NVIDIA RTX 4060 Laptop GPU, 8 GB VRAM
- Target compatibility: NVIDIA RTX 20-series and newer

## Installation

### End-user (Windows)

The application is packaged with Tauri 2. On Windows, `tauri build` produces an MSI/NSIS installer under `src-tauri/target/release/bundle/`. The installer does NOT bundle large AI models; models are downloaded through the Model Manager after installation (Phase 3).

First-launch setup (planned): hardware detection, GPU/VRAM/RAM checks, Python/backend runtime setup, dependency verification, model download management, and health checks.

### Developer (this repository)

Prerequisites:
- Node.js (v18+) and pnpm
- Rust toolchain (stable) with C linker (gcc/msvc) and WebKitGTK dev libraries (Linux) / WebView2 (Windows)

```bash
# Install dependencies
pnpm install

# Typecheck
pnpm typecheck

# Lint
pnpm lint

# Start dev server (frontend)
pnpm dev

# Run Tauri in dev mode
pnpm tauri:dev

# Production build (frontend + Rust)
pnpm build

# Build installer bundle
pnpm tauri:build
```

The Rust backend is in `src-tauri/`; the frontend is in `src/`.

## Architecture

- `src/` — React + TypeScript frontend (Vite), Tailwind CSS, Zustand store.
- `src/services/api.ts` — Tauri invoke bindings.
- `src/store/useAppStore.ts` — Client state (projects, view mode, hardware, departments).
- `src/types/` — Shared TypeScript types.
- `src-tauri/src/main.rs` — Rust backend: Tauri commands, Model Adapter trait/registry, hardware detection, SQLite persistence.
- `src-tauri/Cargo.toml` — Rust dependencies (tauri, rusqlite, uuid, chrono, dirs-next).
- `src-tauri/tauri.conf.json` — Tauri configuration (allowlist, bundle, windows).

## Model Adapters

Each model adapter implements the `ModelAdapter` trait:

```rust
pub trait ModelAdapter {
    fn info(&self) -> ModelAdapterInfo;
    fn load(&self) -> Result<(), String>;
    fn unload(&self) -> Result<(), String>;
    fn is_loaded(&self) -> bool;
}
```

Adapters are registered in `ModelRegistry`. Initial adapters (definitions only, not yet loaded):

| Model | Department | Capabilities | Min VRAM | License |
|-------|-----------|-------------|----------|---------|
| Wan 2.2 | video_generation | text_to_video, image_to_video | 8192 MB | Apache-2.0 (Wan) |
| LTX-Video | video_generation | text_to_video, image_to_video | 6144 MB | Apache-2.0 |
| RealVisXL | image_generation | text_to_image | 6144 MB | RealVisXL License |

## Troubleshooting

- **App won't launch (headless/Linux CI):** Tauri requires a display server (GTK/WebView2). On Windows this is not an issue. The panic `Failed to initialize GTK` on headless Linux is environmental, not a defect.
- **`pnpm build` fails on web assets:** Ensure `pnpm install` ran and `vite build` succeeds (`src-tauri/gen/dist/` populated).
- **`cargo build` fails on `tauri::generate_context!`:** Ensure `src-tauri/build.rs` exists calling `tauri_build::build()` and `tauri-build` is in build-dependencies.
- **SQLite not found:** `rusqlite` uses the `bundled` feature, so SQLite is compiled in; no system SQLite required.

## License

Commercial-use restrictions for AI models, plugins, and imported assets are tracked per the product vision (Phase 6). Project data is kept local by default.
