import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/react/index.ts',
  external: ['react', 'react/jsx-runtime'],
  plugins: [
    resolve({ extensions: ['.ts', '.tsx'] }),
    commonjs(),
    postcss({
      autoModules: true,
      extract: 'components.min.css',
      minimize: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      exclude: ['**/*.test.tsx', '**/*.test.ts', 'setupTests.ts'],
    }),
  ],
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].js',
    sourcemap: true,
  },
};
