import { babel } from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const config = {
  input: ['src/index.js', 'src/GoogleMaps'],
  output: [
    {
      dir: 'dist/es',
      format: 'es'
    },
    {
      dir: 'dist/cjs',
      format: 'cjs'
    }
  ],
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    cleaner({
      targets: ['./dist/']
    }),
    resolve(),
    babel({
      babelrc: false,
      configFile: false,
      exclude: ['**/node_modules/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false
          }
        ],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-runtime'
      ],
      babelHelpers: 'runtime'
    }),
    commonjs(),
    terser()
  ]
};

export default config;
