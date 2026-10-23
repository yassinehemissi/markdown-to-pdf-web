import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import preact from '@preact/preset-vite'
import { fileURLToPath, URL } from 'node:url'

// Browser mode exercises Preact, Radix and TanStack through the same Vite
// compatibility aliases used by the application, with React Testing Library.
export default defineConfig({
  plugins: [preact({ prefreshEnabled: false })],
  optimizeDeps: {
    include: [
      'preact',
      'preact/hooks',
      'preact/compat',
      'preact/compat/client',
      'preact/jsx-runtime',
      'preact/test-utils',
      '@testing-library/react',
      '@testing-library/user-event',
      '@radix-ui/react-dialog',
      '@tanstack/react-router',
      'lucide-react',
    ],
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: /^@testing-library\/react$/,
        replacement: fileURLToPath(
          new URL(
            './node_modules/@testing-library/react/dist/@testing-library/react.esm.js',
            import.meta.url,
          ),
        ),
      },
    ],
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['**/*.e2e.test.ts', '**/node_modules/**'],
    globals: false,
    clearMocks: true,
    restoreMocks: true,
    browser: {
      enabled: true,
      headless: true,
      ui: false,
      viewport: { width: 1280, height: 720 },
      provider: playwright({
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
})
