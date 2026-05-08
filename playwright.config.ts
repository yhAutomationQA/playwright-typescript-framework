import { defineConfig, devices } from '@playwright/test';
import { config } from './config/env-manager';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: config.isCI,
  retries: config.isCI ? 2 : 0,
  workers: config.isCI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['allure-playwright'], ['list']],
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
