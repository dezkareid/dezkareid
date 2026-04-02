import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

const external = ['react', 'react/jsx-runtime'];

const plugins = cssExtract => [
  resolve({ extensions: ['.ts', '.tsx'] }),
  commonjs(),
  postcss({
    autoModules: true,
    modules: {
      generateScopedName: '[local]',
    },
    extract: cssExtract,
    minimize: true,
  }),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: 'dist',
    exclude: ['**/*.test.tsx', '**/*.test.ts', 'setup-tests.ts'],
  }),
];

const output = banner => ({
  dir: 'dist',
  format: 'es',
  preserveModules: true,
  preserveModulesRoot: 'src',
  entryFileNames: '[name].js',
  sourcemap: true,
  ...(banner ? { banner } : {}),
});

export default [
  // React entry — pre-existing, extracts CSS
  {
    input: 'src/react/index.ts',
    external,
    plugins: plugins('components.min.css'),
    output: output(),
  },
  // React Server Components — server-safe components only, no CSS extraction
  {
    input: 'src/react-server/index.ts',
    external,
    plugins: plugins(false),
    output: output(),
  },
  // React Client Components — client-only components, "use client" injected via banner
  {
    input: 'src/react-client/index.ts',
    external,
    plugins: plugins(false),
    output: output(`'use client';`),
  },
];
