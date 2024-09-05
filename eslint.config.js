import globals from 'globals';
import tseslint from 'typescript-eslint';

import { eslintConfig } from '@brybrant/configs';

export default eslintConfig(
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['**/dist/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': [
        1,
        {
          allowNumber: true,
        },
      ],
    },
  },
);
