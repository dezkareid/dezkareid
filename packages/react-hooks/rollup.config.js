import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const commonPlugins = [
  cleaner({
    targets: ['./dist/']
  }),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }),
  commonjs(),
  json(),
  terser()
];

const esmConfig = {
  input: {
    index: 'src/index.ts',
    useLocalStorage: 'src/useLocalStorage/index.ts',
    useEventListener: 'src/useEventListener/index.ts',
  },
  output: [
    {
      dir: 'dist/es',
      format: 'es',
      sourcemap: true
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    ...commonPlugins,
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    })
  ]
};

const dtsRollupConfig = {
  input: {
    index: 'src/index.ts',
    useLocalStorage: 'src/useLocalStorage/index.ts',
    useEventListener: 'src/useEventListener/index.ts',
  },
  output: {
    dir: 'dist/types',
    format: 'es'
  },
  plugins: [dts()]
};

export default (commandLineArgs) => {
  if (commandLineArgs.BUILD_ES_CJS) {
    return esmConfig;
  }

  if (commandLineArgs.BUILD_TYPES) {
    return dtsRollupConfig;
  }

  return [esmConfig, dtsRollupConfig];
};