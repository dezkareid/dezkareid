import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

const testingLibraryBase = path.resolve(
  import.meta.dirname,
  '../../node_modules/.pnpm/node_modules/@testing-library',
);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    conditions: ['import', 'module', 'browser', 'default'],
    alias: {
      '@testing-library/jest-dom': `${testingLibraryBase}/jest-dom`,
      '@testing-library/react': `${testingLibraryBase}/react`,
      '@testing-library/user-event': `${testingLibraryBase}/user-event`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
