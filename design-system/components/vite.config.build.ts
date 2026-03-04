import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

function stripCssImports(): Plugin {
  return {
    name: 'strip-css-imports',
    transform(code, id) {
      if (!id.endsWith('.ts') && !id.endsWith('.tsx')) return;
      return code.replace(/^import\s+\w+\s+from\s+['"].*?\.module\.css['"];?\s*$/gm, '');
    },
  };
}

export default defineConfig({
  plugins: [react(), stripCssImports()],
  build: {
    lib: {
      entry: { react: resolve(__dirname, 'src/react/index.ts') },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', /\.css$/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
