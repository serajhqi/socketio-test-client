import { startTestServer } from './socket-server';

async function globalSetup() {
  console.log('Starting global test setup...');
  await startTestServer();
  console.log('Test server started for E2E tests');
}

export default globalSetup;
