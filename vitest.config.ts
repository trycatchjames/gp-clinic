import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./apps/web/src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['apps/**/*.test.{ts,tsx}', 'packages/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: { reporter: ['text', 'json-summary'] },
  },
});
