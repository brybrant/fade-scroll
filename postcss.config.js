import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import reporter from 'postcss-reporter';

import { cssnanoConfig } from '@brybrant/configs';

/**
 * https://github.com/postcss/postcss-load-config
 * @param {object} [ctx] - Context
 * @param {string} ctx.env - Environment (process.env.NODE_ENV)
 * @param {string} ctx.cwd - Current working directory (process.cwd())
 */
export default (/*ctx*/) => {
  // const development = ctx.env === 'development';

  /** @type {import('postcss-load-config').Config} */
  return {
    plugins: [
      purgeCSSPlugin({
        content: ['./dist/index.html', './src/**/*.ts'],
        safelist: ['&', ':hover', ':active', ':first-child', ':last-child'],
      }),
      cssnano(cssnanoConfig),
      autoprefixer(),
      reporter({
        clearReportedMessages: true,
      }),
    ],
  };
};
