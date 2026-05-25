import { stopTestServer } from './socket-server';

async function globalTeardown() {
  console.log('Starting global test teardown...');
  await stopTestServer();
  console.log('Test server stopped');
}

export default globalTeardown;
