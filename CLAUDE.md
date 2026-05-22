# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`socketio-test-client` is a browser-based testing tool for Socket.IO APIs. It allows developers to connect to Socket.IO servers, emit events, listen to responses, and view request history—available as both a web app and browser extensions (Chrome, Firefox).

## Build & Development Commands

- `pnpm dev` — Start Vite dev server (runs on `http://localhost:5173`)
- `pnpm build` — Build production bundle and generate both Firefox and Chrome extension distributions
- `pnpm firefox` — Build Firefox extension only (output: `./firefox-extension/`)
- `pnpm chrome` — Build Chrome extension only (output: `./chrome-extension/`)

## Architecture

### Tech Stack
- **UI Framework**: Svelte 3 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Svelte stores (writable + derived)
- **Socket.IO**: `socket.io-client` library for WebSocket connections
- **Components**: `svelte-notifications` (notifications), `svelte-json-tree` (JSON display)

### Directory Structure

```
src/
├── main.ts              — Entry point; mounts App.svelte to #app
├── App.svelte           — Root component; layout and page state
├── lib/
│   ├── store.ts         — Centralized state: ConnectionStatus, RequestType, ListenerType, LogType
│   ├── tailwind.css     — Tailwind imports
│   ├── handlers/
│   │   ├── socketio.ts  — Socket.IO connection lifecycle and event emission/listening
│   │   └── storage.ts   — localStorage persistence for server address and options
│   └── components/      — Reusable UI components (TopMenu, Request, Response, History, Logger, Listeners, etc.)
├── index.html           — HTML entry point
└── vite-env.d.ts        — Vite type definitions

extension-helper/       — Browser extension metadata and scripts
├── *-manifest.json     — Firefox/Chrome-specific manifests
├── *-background.js     — Firefox/Chrome-specific service workers
└── images/             — Extension assets

dist/                   — Production build (web app)
firefox-extension/      — Firefox extension distribution (created by pnpm firefox)
chrome-extension/       — Chrome extension distribution (created by pnpm chrome)
```

### State Management (Svelte Stores)

All reactive state is centralized in `src/lib/store.ts`:

- **`serverSettings`** — Connection address, status (`connecting|connected|disconnecting|disconnected`), client options (headers, auth, transports), and socket ID
- **`request`** — Currently active request: event name, title, request body, response, duration
- **`requestHistory`** — Array of past requests
- **`listeners`** — Array of event listeners with received messages
- **`logs`** — Timestamped log messages (connection events, errors)
- **`repoStars`** — GitHub star count (fetched on mount)

Subscribe to these stores in components using Svelte's `$` auto-subscription syntax.

### Key Handlers

**`socketio.ts`** — Socket.IO lifecycle and communication:
- `toggleConnection()` — Establish or close Socket.IO connection; handles connection status, error recovery, event listener registration
- `emitRequest()` — Send an event to the server; logs duration and response
- Event listeners dynamically registered from UI; receive messages appended to listener state
- Utility: `isJson()` — Check if a string is valid JSON

**`storage.ts`** — localStorage persistence:
- Save/load server address, Socket.IO client options, and request history to survive page reloads

### Extension Distribution

The build process generates both Firefox and Chrome extensions from a single codebase:

- **Manifest differences**: `extension-helper/*-manifest.json` contain browser-specific fields (e.g., Chrome's `manifest_version: 3`, Firefox's `manifest_version: 2`)
- **Background scripts**: `extension-helper/*-background.js` differ slightly per browser API (Service Workers vs. Background Pages)
- **Image assets**: Shared `extension-helper/images/` copied to both distributions
- **Build scripts** in `package.json` handle file copying and manifest versioning via `jq`

Version number is read from `package.json` and injected into manifests during build.

### Vite Configuration

`vite.config.ts` configures:
- Dev server on `0.0.0.0:5173` (accessible from any network interface)
- Svelte plugin for `.svelte` file compilation

TypeScript and PostCSS are pre-configured via `svelte-preprocess` and `tsconfig.json`.

## Common Patterns

- **Reactive declarations**: Use `$` prefix in components to subscribe to stores (e.g., `$serverSettings`)
- **Derived stores**: Use `derived()` for computed state (e.g., `requestInFocus` is derived from `request`)
- **Component state**: Prefer Svelte stores over local component state when data must be shared across components
- **Type safety**: Leverage `RequestType`, `ListenerType`, `LogType`, `ConnectionStatus` enums defined in `store.ts`
- **Error handling**: Log errors to `logs` store via `logger()` in `socketio.ts` for user visibility

## Build Process for Extensions

Running `pnpm build` performs these steps in sequence:
1. Vite build produces `dist/` (web app bundle)
2. Copy `dist/` to `firefox-extension/` and `chrome-extension/`
3. Copy `extension-helper/images/` to both extension directories
4. Copy browser-specific background scripts and manifests
5. Inject version from `package.json` into manifest files

The extension distributions are ready to submit to the respective app stores.
