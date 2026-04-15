import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
      exclude: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        'coverage/**',
        '*.config.{ts,js,mjs}',
        '**/*.d.ts',
        'app/layout.tsx',
        'app/globals.css',
        'working-on/**',
      ],
    },
  },
});
