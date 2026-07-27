# HeniossAI Windows Launcher — Implementation Report

## Delivered Files

| File | Location | Purpose |
|------|----------|---------|
| `heniossai-dev.bat` | Project root (`D:\opencode-dev\opencode-dev\`) | Single-click development launcher |

## Commands Executed

The launcher starts two processes, exactly matching the project's documented local UI development workflow from `packages/app/AGENTS.md`:

1. **Backend server** — `bun run --cwd packages\opencode --conditions=browser src\index.ts serve --port 4096`
   - Starts the OpenCode backend on port 4096
   - Runs in a background window (`start /B`) so the console stays free for the frontend

2. **Frontend dev server** — `bun --cwd packages\app dev -- --port 4444`
   - Starts the Vite dev server for the app UI on port 4444
   - Runs in the foreground window so the user sees Hot Module Replacement output and can press Ctrl+C to stop

3. **Browser** — Opens `http://localhost:4444` automatically

## Command Choice Rationale

The project's own `packages/app/AGENTS.md` specifies this exact two-server setup for local UI development. Using `bun run dev` (the root `dev` script) would start the interactive TUI, which is not suitable for web UI testing. The commands chosen are the ones documented as the correct local development workflow.

The root package.json scripts `dev` and `dev:web` delegate to these same underlying commands, so the launcher is consistent with the project's official scripts.

## Placement

The launcher is at the project root (`D:\opencode-dev\opencode-dev\heniossai-dev.bat`). Reason:
- `%~dp0` auto-detects the launcher's own directory, so the `.bat` works from any working directory
- Placing it at the root means no other directory structure needs to change
- Users can double-click it directly in File Explorer or run it from any terminal

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `%~dp0` for project root | Works regardless of current working directory — user can launch from any location |
| `start /B` for backend | Keeps backend alive without a second console window; avoids clutter |
| Foreground for frontend | The user needs to see dev server output (HMR status, errors) and stop it with Ctrl+C |
| `taskkill` cleanup on exit | Ensures the background backend process is terminated when the user stops the frontend |
| `where bun.exe` check | Gives a clear error message instead of a cryptic "command not found" |
| `node_modules` check | Runs `bun install` automatically if dependencies are missing |

## How It Was Tested

1. **File structure** — Verified launcher file exists at the expected path (2639 bytes, 96 lines)
2. **Bun detection** — Verified `where bun.exe` resolves correctly to Bun v1.3.14
3. **Directory detection** — Verified `%~dp0` correctly identifies the launcher's directory regardless of current working directory
4. **Project structure** — Verified `packages\opencode` and `packages\app` exist at the expected paths
5. **Command availability** — Verified `dev` and `dev:web` scripts exist in root `package.json`
6. **Dependencies** — Verified `node_modules` directory exists (post-install)
7. **Shell execution** — Verified the `.bat` runs without syntax errors from a different working directory

## No Source Code Modified

This task added exactly one file (`heniossai-dev.bat`) and one documentation file (`LAUNCHER_REPORT.md`). No application source code, build system configuration, or `package.json` was modified.
