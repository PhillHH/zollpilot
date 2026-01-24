import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: ['**/*.int.test.{ts,tsx}'],
    environment: 'node',
    globals: true,
    globalSetup: './test/global-setup.ts',
    setupFiles: ['./test/setup.ts'],
    // Vitest 4: use fileParallelism instead of poolOptions.threads.singleThread
    fileParallelism: false, // Ensures deterministic schema usage across tests
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
