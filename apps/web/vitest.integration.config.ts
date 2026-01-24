import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: ['**/*.int.test.{ts,tsx}'],
    environment: 'node',
    globalSetup: ['./test/global-setup.ts', './test/global-teardown.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
