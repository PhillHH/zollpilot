import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration
 *
 * Two modes:
 * - Local (default): Uses `next dev` for fast iteration
 * - CI/Stable: Uses `next build` + `next start` for reliable production-like tests
 *
 * To run in CI mode: E2E_MODE=ci pnpm test:e2e:ci
 */

const isCI = process.env.E2E_MODE === 'ci' || process.env.CI === 'true'
const port = 3100 // Use different port to avoid conflicts with dev server

export default defineConfig({
  testDir: './e2e',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: `http://localhost:${port}`,
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    // Screenshot only on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers (chromium only for Phase 0.6)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: isCI
      ? `pnpm build && pnpm start -p ${port}`
      : `pnpm dev -p ${port}`,
    port: port,
    timeout: 120 * 1000, // 2 minutes for build in CI mode
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
