import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { eslintConfig, prettierConfig } from '@brybrant/configs';

const prettierRules = Object.assign({}, eslintPluginPrettier.rules, {
  'prettier/prettier': ['error', prettierConfig],
});

export default eslintConfig(
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier.plugins.prettier,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: Object.assign(
      {},
      tseslint.configs.strictTypeChecked.reduce(
        (rules, config) => Object.assign(rules, config.rules ?? {}),
        {},
      ),
      {
        '@typescript-eslint/restrict-template-expressions': [
          1,
          {
            allowNumber: true,
          },
        ],
      },
      prettierRules,
    ),
  },
  {
    files: ['**/*.js'],
    plugins: {
      prettier: eslintPluginPrettier.plugins.prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: prettierRules,
  },
);
