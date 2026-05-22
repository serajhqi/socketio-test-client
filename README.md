# Socket.IO Test Client For Developers

`socketio-test-client` is a developer tool to test Socket.IO APIs. Send events, listen for responses, manage profiles, and inspect real-time WebSocket communication—available as a web app and browser extensions (Chrome, Firefox).

<img src="https://user-images.githubusercontent.com/7148972/177484177-0c824dc1-6d41-4c12-942e-ecc08ffba9fe.png" align="center" width="600">

## Features

- **Request Builder** — Compose events with JSON payloads, execute with Ctrl+Enter
- **Response Viewer** — Inspect responses in a collapsible JSON tree; copy with one click
- **Server Profiles** — Save multiple Socket.IO server addresses and connection options; switch between profiles instantly
- **Listeners** — Register event listeners, capture broadcasted messages in real time, export/clear history
- **Request History** — Auto-saves past requests with titles; search and reopen instantly; export/import sessions
- **Live Logs** — Monitor all Socket.IO events, errors, and connection state changes
- **Connection Details** — Track socket ID, transport type, reconnection count, and connection duration

## Browser Extensions

- [Chrome](https://chrome.google.com/webstore/detail/socketio-test-client/ophmdkgfcjapomjdpfobjfbihojchbko?hl=en)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/socketio-client/)

## Installation & Usage

### Global Install

To globally install the app:

```bash
pnpm add -g socketio-test-client
```

Then run to start the server on `http://localhost:8888`:

```bash
socketio-test-client
```

### Local Development

Clone the repository and set up:

```bash
pnpm install
pnpm dev
```

The dev server runs on `http://localhost:5173` with hot-reload enabled.

### Building

```bash
# Build all (web + extensions)
pnpm build

# Build only Firefox extension
pnpm firefox

# Build only Chrome extension
pnpm chrome
```

Outputs:
- `dist/` — Web app bundle (served by `bin/socketio-test-client.js`)
- `firefox-extension/` — Firefox extension ready to submit
- `chrome-extension/` — Chrome extension ready to submit

## Configuration

### Server Address & Options

1. Click **Set URL** to enter your Socket.IO server address
2. Set a custom Socket.IO path if needed (e.g., `/custom-io`)
3. Add advanced options as JSON (e.g., `extraHeaders`, `auth`, `transports`)

> **CORS Note**: Ensure your server allows CORS or uses the same origin as the test client

### Profiles

Save frequently-used server configurations:

1. Configure a server address and options
2. Click **↪ Save as Profile**
3. Name the profile (e.g., "Dev", "Staging", "Production")
4. Switch between profiles from the **Profile** dropdown

### Export & Import Sessions

Export your request history, listeners, and profiles as a timestamped JSON file:

1. Click **↓ Export** to download the session
2. Share files with teammates or archive sessions

Import a previously exported session:

1. Click **↑ Import** and select a JSON file
2. Your history, listeners, and profiles are restored

## Testing

The project includes comprehensive tests at three levels:

### Unit & Integration Tests

```bash
pnpm test           # Run all tests once
pnpm test:watch     # Run tests in watch mode
```

Tests use **Vitest** with **jsdom** and **@testing-library/react**. The test Socket.IO server on port 3099 is automatically started for integration tests.

### E2E Tests

```bash
pnpm test:e2e       # Run all Playwright E2E tests
```

E2E tests cover:
- Connection lifecycle (connect/disconnect, server settings)
- Request/response flows (emit → await response, JSON viewer, copy)
- History management (persistence, search, removal)
- Listener lifecycle (registration, message capture, export)
- Profile management (create, edit, delete, switch)
- Session export/import

### Run All Tests

```bash
pnpm test:all
```

## Tech Stack

- **UI Framework**: React 18 + TypeScript
- **State Management**: Zustand with localStorage persistence
- **Styling**: SASS/SCSS
- **Build Tool**: Vite
- **Socket.IO**: `socket.io-client`
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **Notifications**: sonner
- **Code Editor**: @uiw/react-codemirror

