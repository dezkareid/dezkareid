import type { Linter } from 'eslint';
import tsBase from '@dezkareid/eslint-config-ts-base';
import stylisticConfig from './stylistic.js';

const config: Linter.Config[] = [
  ...stylisticConfig,
  ...(tsBase as Linter.Config[]),
];

export default config;
