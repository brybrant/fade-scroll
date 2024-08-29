import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import purgeCSSPlugin from '@fullhuman/postcss-purgecss';
import reporter from 'postcss-reporter';

import { cssnanoConfig } from '@brybrant/configs';

/**
 * https://github.com/postcss/postcss-load-config
 * @param {Object} [ctx] - Context
 * @param {String} ctx.env - Environment (process.env.NODE_ENV)
 * @param {String} ctx.cwd - Current working directory (process.cwd())
 * @returns {import('postcss-load-config').Config}
 */
export default (/*ctx*/) => {
  // const development = ctx.env === 'development';

  /** @type {import('postcss-load-config').Config} */
  return {
    plugins: [
      purgeCSSPlugin({
        content: ['./demo/index.html', './src/**/*.js'],
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
