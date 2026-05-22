import { Server } from 'socket.io';
import http from 'http';

const PORT = 3099;

let server: http.Server | null = null;
let io: Server | null = null;

export async function startTestServer(): Promise<void> {
  return new Promise((resolve) => {
    server = http.createServer();
    io = new Server(server, {
      cors: { origin: '*' },
    });

    io.on('connection', (socket) => {
      // Echo event: ACK with the same payload
      socket.on('echo', (data, callback) => {
        if (callback) {
          callback(data);
        }
      });

      // Slow echo: ACK after 200ms to test duration display
      socket.on('slow-echo', (data, callback) => {
        setTimeout(() => {
          if (callback) {
            callback(data);
          }
        }, 200);
      });

      // Broadcast: server emits to all clients
      socket.on('broadcast', (data) => {
        io!.emit('server-push', {
          timestamp: new Date().toISOString(),
          ...data,
        });
      });

      // Error event: emit malformed payload
      socket.on('error-event', () => {
        socket.emit('error', {
          message: 'Test error event',
          code: 'TEST_ERROR',
        });
      });

      // Ping for latency measurement
      socket.on('ping', (callback) => {
        if (callback) {
          callback({ timestamp: Date.now() });
        }
      });

      socket.on('disconnect', () => {
        // cleanup
      });
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Test Socket.IO server running on port ${PORT}`);
      resolve();
    });
  });
}

export async function stopTestServer(): Promise<void> {
  return new Promise((resolve) => {
    if (io) {
      io.close();
    }
    if (server) {
      server.close(() => {
        console.log('Test Socket.IO server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
}
