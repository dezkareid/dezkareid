import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { react: 'src/react/index.ts' },
  format: ['esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ['react'],
});
