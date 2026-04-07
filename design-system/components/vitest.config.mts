import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    angular({
      tsconfig: './tsconfig.spec.json',
    }),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup-tests.ts'],
    include: ['src/angular/**/*.spec.ts', 'src/react/**/*.test.tsx'],
  },
});
