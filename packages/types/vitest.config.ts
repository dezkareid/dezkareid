import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    typecheck: {
      include: ['src/**/*.test-d.ts', 'src/**/*.test.ts'],
    },
  },
});
