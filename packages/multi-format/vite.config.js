import { defineConfig } from 'vite';
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react';
import * as packageJson from './package.json'

console.log('packageJson', [...Object.keys(packageJson.peerDependencies)])

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    lib: {
      entry: resolve('src', 'index.js'),
      name: 'Modongo',
      formats: ['es', 'cjs', 'iife', 'umd'],
      fileName: (format) => `multi-format.${format}.js`,
      
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
