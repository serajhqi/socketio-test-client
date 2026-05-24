# Manual Test Server

This is a standalone Socket.IO test server for manually testing the `socketio-test-client` application. It provides a real server you can interact with to verify that request/response and listener functionality work correctly in the application.

## Quick Start

1. Start the manual test server:
   ```bash
   pnpm run test:manual-server
   ```

2. In another terminal, start the application:
   ```bash
   pnpm dev
   ```

3. Open http://localhost:5173 in your browser

4. Enter the server address: `http://localhost:3000`

5. Click **Connect** and start testing!

## Server Details

- **Default URL**: `http://localhost:3000`
- **CORS**: Enabled for all origins (`*`)
- **Environment Variables**:
  - `PORT` — Server port (default: `3000`)
  - `HOST` — Bind address (default: `0.0.0.0`)

Example with custom port:
```bash
PORT=4000 pnpm run test:manual-server
```

## Available Test Events

### 1. `echo` — Request/Response Test
Sends data and receives an immediate ACK with the same payload.

**Test in app**:
1. Connect to the server
2. Emit name: `echo`
3. Body: `{ "message": "hello" }`
4. Click **Send**
5. Verify the response shows in the **Response** panel

### 2. `slow-echo` — Duration Measurement Test
Like `echo`, but responds after 200ms. Good for testing the duration display.

**Test in app**:
1. Emit name: `slow-echo`
2. Body: `{ "test": "data" }`
3. Click **Send**
4. Verify the **Duration** shows ~200ms in the Response panel

### 3. `broadcast` — Server Push (Listener Test)
Sends data to the server, which broadcasts a `server-push` event to all connected clients.

**Test in app**:
1. Add a listener for `server-push`
2. Emit name: `broadcast`
3. Body: `{ "action": "notify-all" }`
4. Click **Send**
5. Verify the `server-push` event appears in the **Listeners** panel with the broadcast data + timestamp

### 4. `error-event` — Error Handling Test
Triggers the server to emit an `error` event with test error details.

**Test in app**:
1. Add a listener for `error`
2. Emit name: `error-event`
3. Leave body empty or send `{}`
4. Click **Send**
5. Verify the `error` event appears in the **Listeners** panel with `{ message, code }`

### 5. `ping` — Latency Test
Simple ping/pong with server timestamp. Useful for measuring latency.

**Test in app**:
1. Emit name: `ping`
2. Leave body empty or send `{}`
3. Click **Send**
4. Verify the response shows the server's current timestamp

## Console Output

The server logs all events with timestamps:

```
[2026-05-24T10:30:45.123Z] ✅ Client connected: ABC123
[2026-05-24T10:30:50.456Z] 📤 Received 'echo': { message: 'hello' }
[2026-05-24T10:30:50.457Z] 📥 Sent 'echo' response
[2026-05-24T10:30:55.789Z] 📤 Received 'broadcast': { action: 'notify-all' }
[2026-05-24T10:30:55.790Z] 📡 Broadcasted 'server-push' to all clients
```

This helps you debug and understand what's happening on the server side.

## Testing Checklist

Use this checklist to verify all features of the `socketio-test-client` work correctly:

- [ ] **Connection**: Connect to the server, verify "connected" status
- [ ] **Request/Response**: Send `echo` event, receive response
- [ ] **Duration**: Send `slow-echo`, verify ~200ms duration display
- [ ] **Listeners**: Add listener, trigger `broadcast`, verify message appears
- [ ] **Error Handling**: Trigger `error-event`, verify error in listeners
- [ ] **Latency**: Send `ping`, verify response with timestamp
- [ ] **History**: Send multiple events, verify history appears in History panel
- [ ] **Multiple Listeners**: Add multiple listeners, send different events
- [ ] **Disconnect**: Disconnect and verify status changes
- [ ] **Reconnect**: Disconnect and reconnect, verify socket ID persists/changes appropriately

## Troubleshooting

**"Connection refused"**
- Check if the server is running: `pnpm run test:manual-server`
- Check the port (default is 3000, or use `PORT` env var)
- Check firewall settings

**"CORS error"**
- The server has CORS enabled for all origins. If you still see CORS errors, try accessing from `http://localhost:5173` (not `127.0.0.1:5173`)

**"No response from server"**
- Check server logs for any errors
- Verify the request payload is valid JSON
- Make sure a listener or ACK callback is registered for the event

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

---

For automated/CI testing, see `/test/fixtures/socket-server.ts` and `/test/e2e/` for Playwright E2E tests.
