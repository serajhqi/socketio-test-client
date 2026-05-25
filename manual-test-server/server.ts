import { Server } from 'socket.io';
import http from 'http';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

let server: http.Server | null = null;
let io: Server | null = null;

function startServer(): void {
  server = http.createServer();
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log(`[${new Date().toISOString()}] ✅ Client connected: ${socket.id}`);

    // Echo event: ACK with the same payload
    socket.on('echo', (data, callback) => {
      console.log(`[${new Date().toISOString()}] 📤 Received 'echo':`, data);
      if (callback) {
        callback(data);
        console.log(`[${new Date().toISOString()}] 📥 Sent 'echo' response`);
      }
    });

    // Slow echo: ACK after 200ms to test duration display
    socket.on('slow-echo', (data, callback) => {
      console.log(`[${new Date().toISOString()}] 📤 Received 'slow-echo':`, data);
      setTimeout(() => {
        if (callback) {
          callback(data);
          console.log(`[${new Date().toISOString()}] 📥 Sent 'slow-echo' response (after 200ms)`);
        }
      }, 200);
    });

    // Broadcast: server emits to all clients using the same event name
    socket.on('broadcast', (data) => {
      console.log(`[${new Date().toISOString()}] 📤 Received 'broadcast':`, data);
      io!.emit('broadcast', {
        timestamp: new Date().toISOString(),
        ...data,
      });
      console.log(`[${new Date().toISOString()}] 📡 Broadcasted 'broadcast' to all clients`);
    });

    // Error event: emit malformed payload
    socket.on('error-event', () => {
      console.log(`[${new Date().toISOString()}] 📤 Received 'error-event'`);
      socket.emit('error', {
        message: 'Test error event',
        code: 'TEST_ERROR',
      });
      console.log(`[${new Date().toISOString()}] 📥 Sent 'error' event`);
    });

    // Ping for latency measurement
    socket.on('ping', (data, callback) => {
      console.log(`[${new Date().toISOString()}] 📤 Received 'ping'`);
      if (typeof callback === 'function') {
        callback({ timestamp: Date.now() });
        console.log(`[${new Date().toISOString()}] 📥 Sent 'ping' response`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[${new Date().toISOString()}] ❌ Client disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
      console.error(`[${new Date().toISOString()}] ⚠️  Socket error:`, error);
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Manual Test Socket.IO Server`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Server running on: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`\nSupported events:`);
    console.log(`  • echo — ACK with same payload`);
    console.log(`  • slow-echo — ACK after 200ms`);
    console.log(`  • broadcast — Server broadcasts 'broadcast' to all clients`);
    console.log(`  • error-event — Server emits an 'error' event`);
    console.log(`  • ping — Server responds with timestamp`);
    console.log(`\nPress Ctrl+C to stop the server`);
    console.log(`${'='.repeat(60)}\n`);
  });

  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Shutting down server...');
    if (io) {
      io.close();
    }
    if (server) {
      server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
      });
    }
  });
}

startServer();
