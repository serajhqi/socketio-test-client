# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`socketio-test-client` is a React 18 browser-based testing tool for Socket.IO APIs. Developers connect to Socket.IO servers, emit events, listen for responses, manage server profiles, and inspect request/response history—available as a web app and browser extensions (Chrome, Firefox).

## Build & Development Commands

- `pnpm dev` — Start Vite dev server with hot reload (runs on `http://localhost:5173`)
- `pnpm build` — Build production bundle and generate Firefox + Chrome extension distributions
- `pnpm firefox` — Build Firefox extension only (output: `./firefox-extension/`)
- `pnpm chrome` — Build Chrome extension only (output: `./chrome-extension/`)
- `pnpm test` — Run Vitest unit + integration tests once
- `pnpm test:watch` — Run tests in watch mode
- `pnpm test:manual-server` — Start manual Socket.IO test server on port 3000 for interactive testing
- `pnpm test:e2e` — Run Playwright E2E tests
- `pnpm test:all` — Run all tests (unit, integration, E2E)

## Architecture

### Tech Stack
- **UI Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite with React plugin
- **Styling**: SASS/SCSS with design variables ($burnt #2b2b2b, $semiburnt #958686, $burning #343434)
- **State Management**: Zustand with 5 slices + localStorage persistence (schema_version: 1)
- **Socket.IO**: `socket.io-client` for WebSocket connections
- **Testing**: Vitest (jsdom) for unit/integration, Playwright for E2E
- **Notifications**: sonner
- **Code Editor**: @uiw/react-codemirror with @codemirror/lang-json

### Directory Structure

```
src/
├── main.tsx                     — React entry point
├── App.tsx                      — Root component with layout, modal management, GitHub API fetch
├── index.scss                   — SASS variables, resets, utilities
├── types/
│   └── index.ts                 — Shared types: ConnectionStatus, RequestType, ListenerType, LogType,
│                                   ServerProfile (id, name, address, options, socketioVersion?),
│                                   ConnectionDetails (socketId, transport, connectedAt, reconnectionCount)
├── store/
│   └── index.ts                 — Zustand store combining 5 slices:
│                                   - ConnectionSlice (address, status, options, connectionDetails, profiles[], activeProfileId)
│                                   - RequestSlice (request, requestHistory[] with upsertHistory, removeFromHistory)
│                                   - ListenerSlice (listeners[] with appendMessage, clearMessages)
│                                   - LogSlice (logs[] with auto-cleanup at 2000 entries)
│                                   - UiSlice (repoStars, appVersion, historyCollapsed)
│                                   Persisted to localStorage via persist middleware
├── services/
│   ├── socketio.ts              — Socket.IO lifecycle and handlers:
│                                   - toggleConnection(): connect/disconnect, status management, connectionDetails capture
│                                   - sendRequest(): emit event, measure duration, capture response
│                                   - logger(): append timestamped logs
│                                   - Tracks transport upgrades, reconnections, socket ID
│   └── storage.ts               — localStorage persistence:
│                                   - readItems(), saveRequest(), saveListeners(), removeRequest(), removeListener()
│
└── components/                  — 10 React components with .tsx + .scss
    ├── TopMenu.tsx/scss         — Header: logo, version, GitHub stars badge, profile & export/import slots
    ├── HelpModal.tsx/scss       — Dialog: contributors, resources
    ├── ConnectionController.tsx/scss — 4-state button (connecting|connected|disconnecting|disconnected)
    ├── ServerAddressModal.tsx/scss — Dialog: server URL input, JSON options editor
    ├── Request.tsx/scss         — Event name/title inputs, JSON body textarea, send button, Ctrl+Enter
    ├── Response.tsx/scss        — JSON viewer, copy button, connection details (ID/transport/duration)
    ├── Logger.tsx/scss          — Auto-scrolling log list, clear button, entry count footer
    ├── Listeners.tsx/scss       — 3-column layout: listeners | messages | JSON viewer; add/remove/clear
    ├── History.tsx/scss         — Collapsible panel: search, list with count badge, open/remove
    ├── ProfileSwitcher.tsx/scss — Dropdown: list/create/edit/delete profiles, save current, switch
    └── ExportImport.tsx/scss    — Export session JSON, import with schema validation

test/
├── setup.ts                     — Vitest setup: jest-dom imports, matchMedia/URL/clipboard mocks
├── fixtures/
│   ├── socket-server.ts         — Test Socket.IO server on port 3099 (echo, slow-echo, broadcast, error-event)
│   ├── global-setup.ts          — Playwright: start socket server before E2E tests
│   └── global-teardown.ts       — Playwright: stop socket server after E2E tests
└── e2e/
    ├── connection.spec.ts       — Connect/disconnect, server settings, status display
    ├── request-response.spec.ts — Emit event, response viewer, duration, copy
    ├── history.spec.ts          — History persistence, search, removal, page reload
    ├── listeners.spec.ts        — Add listener, message capture, JSON viewer
    ├── profiles.spec.ts         — Profile create/edit/delete/switch
    └── export-import.spec.ts    — Session export/import with validation

extension-helper/               — Browser extension metadata (shared across Chrome + Firefox)
├── *-manifest.json             — Browser-specific manifests (manifest_version: 3 for Chrome, 2 for Firefox)
├── *-background.js             — Service Workers (Chrome) / Background Pages (Firefox)
└── images/                      — Extension icons and assets

dist/                           — Production web app bundle (served by bin/socketio-test-client.js)
firefox-extension/              — Firefox extension distribution
chrome-extension/               — Chrome extension distribution

vite.config.ts                  — Vite config: React plugin, dev server 0.0.0.0:5173, Vitest jsdom setup
tsconfig.json                   — React/Vite standard config: jsx "react-jsx", strict mode, vitest types
playwright.config.ts            — E2E config: webServer for Vite dev server, globalSetup/teardown for test socket server
```

### State Management (Zustand Store)

Centralized in `src/store/index.ts`. All state slices combined into a single `useStore` hook with Zustand's `persist` middleware:

**ConnectionSlice**:
- `address` — Server URL (e.g., "http://localhost:3000")
- `status` — "disconnected" | "connecting" | "connected" | "disconnecting"
- `options` — Socket.IO client options as JSON object (extraHeaders, auth, transports, etc.)
- `connectionDetails` — { socketId?: string, transport?: string, connectedAt?: number, reconnectionCount?: number }
- `profiles` — Array of ServerProfile objects (id, name, address, options, socketioVersion?: "3" | "4")
- `activeProfileId` — Currently selected profile ID

**RequestSlice**:
- `request` — Current request: { emitName, title?, body?, response?, duration? }
- `requestHistory` — Array of past requests, deduplicated by title via `upsertHistory()`

**ListenerSlice**:
- `listeners` — Array of { title, messages: { id, time, data }[] }
- `appendMessage()` — Add message to listener's messages array

**LogSlice**:
- `logs` — Array of { id, time, message }, auto-cleared when > 2000 entries

**UiSlice**:
- `repoStars` — GitHub star count (fetched from GitHub API on App mount)
- `appVersion` — Package version
- `historyCollapsed` — Boolean for History panel expand/collapse state

**Persistence**: Uses `persist` middleware with key `'connection'`, saves profiles, address, and options to localStorage on every change. On init, reads schema_version to support future data migrations.

### Key Services

**`src/services/socketio.ts`** — Socket.IO lifecycle:
- `toggleConnection()` — Connect to server at `address` with `options`; capture socket ID, transport, initial reconnection count; register auto-listeners from UI
- `sendRequest()` — Emit event from `request.emitName` with parsed body; measure round-trip duration; capture response
- `logger(message)` — Append timestamped log entry
- Handles transport upgrades, reconnection events, connection errors
- **Future**: `io()` call isolated behind factory for easy injection of socket.io-client-v3 or other versions later

**`src/services/storage.ts`** — localStorage persistence:
- `readItems(key)` — Read from localStorage (returns [] if key absent)
- `saveRequest()`, `saveListeners()` — Persist to localStorage
- `removeRequest(title)`, `removeListener(title)` — Delete entries
- Uses localStorage keys `'history'` and `'listeners'` for backward compat with Svelte version

### Testing Strategy

Three layers, all runnable before every release:

**Unit Tests** (`src/**/*.test.tsx`):
- Component rendering (props, state, user interactions)
- Store slices (state updates, edge cases)
- Utilities (JSON validation, date formatting)
- Run: `pnpm test`

**Integration Tests** (same files with `beforeAll` socket server):
- `socketio.ts` handler with test server on port 3099
- Connection lifecycle: connect → ACK echo event → disconnect
- Request/response round-trip with duration measurement
- Run: `pnpm test` (Vitest starts socket server via `beforeAll`)

**E2E Tests** (`test/e2e/*.spec.ts`):
- Full user flows in Playwright browser (Chrome)
- Test server started by `globalSetup`, torn down by `globalTeardown`
- Coverage: connection → request → response, history, listeners, profiles, export/import
- Run: `pnpm test:e2e`

**Test Socket.IO Server** (`test/fixtures/socket-server.ts`):
- Runs on port 3099 (unlikely to conflict)
- Implements: `echo` (ACK with same payload), `slow-echo` (200ms delay), `broadcast` (server-push event to all), `error-event` (malformed)
- Exports `start()` and `stop()` functions for both Vitest and Playwright lifecycle hooks

### Design System (SCSS)

Variables in `src/index.scss`:
- `$burnt`: #2b2b2b — Dark backgrounds
- `$semiburnt`: #958686 — Muted text, borders
- `$burning`: #343434 — Slightly lighter than burnt
- `$white`: #ffffff — Light text

All component styles in `src/components/*.scss` use these variables. No Tailwind; utilities defined inline or in index.scss.

### Extension Distribution

Build process (pnpm build):
1. Vite builds `dist/` (web app)
2. Copies `dist/` to `firefox-extension/` and `chrome-extension/`
3. Copies browser-specific manifests and background scripts
4. Injects version from `package.json` into manifest files
5. Both distributions ready for app store submission

## Component List

- `TopMenu` — Header with branding, version, stars, slots for ProfileSwitcher and ExportImport
- `ConnectionController` — Status-aware button (Connect/Disconnect, Connecting, Disconnecting)
- `ServerAddressModal` — Dialog to configure server URL and client options
- `Request` — Form to compose and send Socket.IO events with JSON bodies
- `Response` — Viewer for event responses with connection metadata
- `Logger` — Real-time log display with auto-scroll and clear
- `Listeners` — Register event listeners, view messages, inspect with JSON tree
- `History` — Browse, search, and reopen past requests
- `HelpModal` — Project info, contributors, documentation links
- `ProfileSwitcher` — Manage server profiles, switch between saved configurations
- `ExportImport` — Export session (history + listeners + profiles), import from file

## Architecture Decisions

1. **Zustand over React Context** — Handlers like `socketio.ts` run outside React tree; need synchronous `getState()`/`setState()` from any module
2. **One store, five slices** — Avoids prop-drilling in deeply nested panel layout; all components import `useStore`
3. **SASS/SCSS exclusively** — No Tailwind; design system variables drive theming; simpler customization for future themes
4. **Test server on port 3099** — Dedicated, low-conflict port; started once per test suite via Playwright `globalSetup` and Vitest `beforeAll`
5. **`ServerProfile.socketioVersion?`** — Optional now, reserved for future multi-version support (socket.io v3 vs v4); no schema migration cost later
6. **`schema_version: 1` in localStorage** — Enables future data migrations without guessing old data format
7. **`io()` factory pattern** — Socket.IO client call isolated, so future versions can be injected (e.g., dynamic import of socket.io-client-v3) without restructuring handlers

## Common Patterns

- **State updates**: `useStore.setState()` or use hook `const { field, setField } = useStore()`
- **Component-specific state**: Use React's `useState()` for transient UI state (form inputs, modals); Zustand for shared, persistent state
- **Side effects**: `useEffect()` for subscriptions to store or socket events; clean up event listeners in return
- **Error handling**: Log via `useStore.getState().appendLog()` for user visibility in Logger panel
- **Type safety**: All types in `src/types/index.ts`; import and extend as needed

## Backward Compatibility

- localStorage keys `'history'` and `'listeners'` preserved from Svelte version
- Import flow validates schema_version for future-proof migrations
- Socket.IO options and profiles fully compatible between versions (socketioVersion field optional)

## Git & Commit Practices

**Confirmation required**: Always ask for explicit confirmation before creating any commit. Do not commit autonomously even when asked to "save" or "apply" changes.

**Atomic Commits**: Each commit should represent a single logical change and be independently meaningful. This makes:
- History easier to bisect (finding bugs)
- Reverts safe (won't break unrelated features)
- Code review clearer (one idea per commit)
- Debugging easier (`git blame`, `git log -p`)

**Commit Message Format**:
```
<type>: <short summary (50 chars)>

<detailed explanation (72 char wrap)>
- Bullet points for clarity
- Explain WHY, not just WHAT

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

**Examples**:
- ✅ "feat: add manual Socket.IO test server for development" (one feature)
- ✅ "fix: prevent duplicate listener entries on reconnect" (one bug)
- ❌ "update all things" (vague, multiple changes)
- ❌ "add tests, refactor store, fix typo" (three separate concerns)
