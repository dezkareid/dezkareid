import { babel } from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const external = Object.keys(pkg.peerDependencies || {});

const commonPlugins = [
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }),
  commonjs(),
  babel({
    babelrc: false,
    configFile: false,
    exclude: ['**/node_modules/**'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false
        }
      ],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-transform-runtime'
    ],
    babelHelpers: 'runtime'
  }),
  terser()
];

export default [
  {
    input: ['src/index.ts', 'src/GoogleMaps/index.tsx'],
    output: {
      dir: 'dist/es',
      format: 'es'
    },
    external,
    plugins: [
      cleaner({
        targets: ['./dist/']
      }),
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/es',
        declaration: true,
        declarationDir: 'dist/es'
      }),
      ...commonPlugins
    ]
  },
  {
    input: ['src/index.ts', 'src/GoogleMaps/index.tsx'],
    output: {
      dir: 'dist/cjs',
      format: 'cjs'
    },
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/cjs',
        declaration: false
      }),
      ...commonPlugins
    ]
  }
];
