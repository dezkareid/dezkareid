import { babel } from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const config = {
  input: ['src/index.js', 'src/useLocalStorage', 'src/useEventListener'],
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
    commonjs(),
    babel({
      babelrc: false,
      exclude: ['**/node_modules/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false
          }
        ]
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-runtime'
      ],
      babelHelpers: 'runtime'
    }),
    terser()
  ]
};

export default config;
