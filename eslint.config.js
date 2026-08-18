import globals from 'globals';

import eslintConfig from '@brybrant/eslint-config';

export default eslintConfig({
  files: ['./src/**/*.ts'],
  languageOptions: {
    globals: globals.browser,
  },
});
