import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  testMatch: '*.spec.ts',
  use: { baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command: 'node scripts/server.mjs',
    port: 4173,
    reuseExistingServer: true,
  },
});
