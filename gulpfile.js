import { writeFileSync } from 'node:fs';
import { createGzip, constants } from 'node:zlib';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';

import browserSync from 'browser-sync';
import { dest, parallel, series, src, watch } from 'gulp';
import ejs from 'ejs';
import { ESLint } from 'eslint';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import { rollup } from 'rollup';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import stylelint from 'stylelint';
import * as dartSass from 'sass';

import { stylelintConfig } from '@brybrant/configs';

import formatEslintResults from './utils/format-eslint-results.js';
import logger from './utils/gulp-logger.js';

const babelPlugin = getBabelOutputPlugin({
  moduleId: 'FadeScroll',
  presets: [['@babel/preset-env', { modules: 'umd' }]],
});
const bs = browserSync.create();
const eslint = new ESLint({ cache: true });
const sass = gulpSass(dartSass);

console.log('Starting Gulp task...');

const development = process.env.NODE_ENV === 'development';
const production = process.env.NODE_ENV === 'production';

const scssFiles = './src/**/*.scss';
const tsFiles = './src/**/*.ts';

/**
 * Callback to execute when gulp task completes
 * @typedef {Function} Callback
 * @returns {void}
 */

/**
 * Gulp task
 * @typedef {Function} Task
 * @returns {Promise|void}
 */

/**
 * @type {Task} Compile SCSS
 * @param {Callback} cb
 */
async function compileSCSS(cb) {
  return Promise.all([
    stylelint
      .lint({
        config: stylelintConfig,
        files: scssFiles,
        formatter: 'string',
      })
      .then(({ report }) => {
        if (report.length > 0) console.log(report);
      }),
    src(scssFiles)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(postcss())
      .pipe(dest('./demo')),
  ]).finally(() => {
    cb();
  });
}

async function generateBundles(bundle, ...configs) {
  return Promise.all(configs.map((config) => bundle.write(config)))
    .catch((error) => console.error(error))
    .finally(() => bundle.close());
}

/**
 * @type {Task} Compile TS
 * @param {Callback} cb
 */
async function compileTS(cb) {
  const rollupUMD = rollup({
    input: './src/index.ts',
    plugins: [
      typescript({
        compilerOptions: {
          module: 'esnext',
          moduleResolution: 'bundler',
          strict: true,
          target: 'es5',
        },
        tsconfig: false,
      }),
    ],
  })
    .then(async (bundle) => {
      return generateBundles(bundle, {
        file: './dist/index.js',
        plugins: [
          babelPlugin,
          terser({
            compress: {
              arrows: false,
              passes: 3,
            },
          }),
        ],
        sourcemap: development,
      });
    })
    .catch((error) => console.error(error));

  const rollupMJS = rollup({
    input: './src/index.ts',
    plugins: [
      typescript({
        compilerOptions: {
          module: 'esnext',
          moduleResolution: 'bundler',
          strict: true,
          target: 'es6',
        },
        tsconfig: false,
      }),
    ],
  })
    .then(async (bundle) => {
      return generateBundles(bundle, {
        file: './dist/index.mjs',
        plugins: [
          terser({
            compress: {
              passes: 3,
            },
            module: true,
          }),
        ],
      });
    })
    .catch((error) => console.error(error));

  return Promise.all([
    eslint.lintFiles([tsFiles]).then(formatEslintResults),
    rollupUMD,
    ...(production ? [rollupMJS] : []),
  ]).finally(() => {
    cb();
  });
}

/**
 * @type {Task} Compress JS
 * @param {Callback} cb
 */
function compress(cb) {
  pipeline(
    createReadStream('./dist/index.mjs'),
    createGzip({
      level: constants.Z_BEST_COMPRESSION,
    }),
    createWriteStream('./dist/index.mjs.gz'),
    (err) => {
      if (err) console.error(err);

      cb();
    },
  );
}

/**
 * @type {Task} Compile EJS
 * @param {Callback} cb
 */
function compileEJS(cb) {
  ejs.renderFile(
    './src/index.ejs',
    {},
    {
      views: ['./src/ejs'],
      strict: true,
      rmWhitespace: true,
    },
    (err, html) => {
      if (err) {
        console.error(err);
        return cb();
      }

      writeFileSync('./demo/index.html', html);

      cb();
    },
  );
}

/**
 * @type {Task} Browser Sync task
 * @param {Callback} cb
 */
function browserSyncTask(cb) {
  bs.init({
    files: ['./demo', './dist'],
    ghostMode: false,
    host: '127.0.0.1',
    online: false,
    open: false,
    port: 3000,
    reloadDebounce: 2000,
    server: {
      baseDir: ['demo', 'dist'],
    },
    ui: false,
  });

  cb();
}

/** Watch source files and compile when changed */
function watchFiles() {
  watch(tsFiles).on('change', (file) => {
    logger.processing(file);
    compileTS(() => {
      logger.finish(file);
      bs.reload('index.js');
    });
  });

  watch(scssFiles).on('change', (file) => {
    logger.processing(file);
    compileSCSS(() => {
      logger.finish(file);
    });
  });

  watch('./src/**/*.ejs').on('change', (file) => {
    logger.processing(file);
    compileEJS(() => {
      logger.finish(file);
    });
  });
}

const compile = parallel(compileTS, compileSCSS, compileEJS);

export const build = series(compile, compress);

export const dev = series(compile, parallel(watchFiles, browserSyncTask));
