import { defineConfig, devices } from '@playwright/test'

// Use 3000 for local dev and CI default
const PORT = process.env.PORT || 3000
const BASE_URL = `http://localhost:${PORT}`

// CI=true env var is used to switch to production mode
const isCI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: isCI ? `pnpm start --port ${PORT}` : `pnpm dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
})
