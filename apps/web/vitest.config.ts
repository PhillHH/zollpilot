import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // Exclude integration and E2E tests from unit test runs
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/*.int.test.{ts,tsx}',
      '**/*.e2e.spec.{ts,tsx}',
      '**/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      exclude: [
        'node_modules/',
        'vitest.config.ts',
        'vitest.integration.config.ts',
        'vitest.setup.ts',
        'playwright.config.ts',
        'next.config.js',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.int.test.{ts,tsx}',
        '**/*.e2e.spec.{ts,tsx}',
        'prisma/',
        'scripts/',
        'test/',
        'e2e/',
        '.next/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
