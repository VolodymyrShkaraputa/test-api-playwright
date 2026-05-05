import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  retries: 2,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  use: {
    viewport: { width: 1280, height: 720 },
    baseURL: process.env.BASE_URL,
    headless: process.env.CI ? true : false,
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ['--disable-dev-shm-usage'],
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
