import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const rules = {
  complexity: ['error', 12]
}

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules,
  },
);
