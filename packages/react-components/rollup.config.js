import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import package_ from './package.json' with { type: 'json' };

const external = Object.keys(package_.peerDependencies ?? {});

const inputs = ['src/index.ts', 'src/GoogleMaps/index.tsx'];

const commonPlugins = [
  resolve({ extensions: ['.ts', '.tsx'] }),
  commonjs(),
  terser(),
];

export default [
  {
    input: inputs,
    output: {
      dir: 'dist/es',
      format: 'es',
    },
    external,
    plugins: [
      cleaner({ targets: ['./dist/'] }),
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/es',
        declaration: true,
        declarationDir: 'dist/es',
      }),
      ...commonPlugins,
    ],
  },
  {
    input: inputs,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
    },
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/cjs',
        declaration: false,
      }),
      ...commonPlugins,
    ],
  },
];
