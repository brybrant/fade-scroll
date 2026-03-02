import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, constants } from 'node:zlib';

import browserSync from 'browser-sync';
import { build as tsdownBuild } from 'tsdown';
import { dest, parallel, series, src, watch } from 'gulp';
import ejs from 'ejs';
import { ESLint } from 'eslint';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import stylelint from 'stylelint';
import * as dartSass from 'sass';

import { stylelintConfig } from '@brybrant/configs';

import formatEslintResults from './utils/format-eslint-results.js';
import logger from './utils/gulp-logger.js';
import tsdownConfig from './tsdown.config.js';

const bs = browserSync.create();
const eslint = new ESLint({ cache: true });
const sass = gulpSass(dartSass);

console.log('Starting Gulp task...');

const scssFiles = './src/**/*.scss';
const tsFiles = './src/**/*.ts';

/**
 * Callback to execute when gulp task completes
 * @callback GulpCallback
 * @returns {Promise<void>|void}
 */

/**
 * Gulp task
 * @callback GulpTask
 * @param {GulpCallback} cb
 * @returns {Promise<void>|void}
 */

/** @type {GulpTask} Compile SCSS */
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
      .pipe(dest('./dist')),
  ]).finally(() => {
    cb();
  });
}

/** @type {GulpTask} Compile TS */
function compileTS(cb) {
  return Promise.all([
    eslint.lintFiles([tsFiles]).then(formatEslintResults),
    tsdownBuild(tsdownConfig),
  ]).finally(() => cb);
}

/** @type {GulpTask} Compress JS */
function compress(cb) {
  const index = readFileSync('./dist/index.mjs', 'utf8');

  const gzip = deflateSync(index, { level: constants.Z_BEST_COMPRESSION });

  writeFileSync('./dist/index.mjs.gz', gzip);

  cb();
}

/** @type {GulpTask} Compile EJS */
function compileEJS(cb) {
  const githubSVG = readFileSync(
    './node_modules/@brybrant/svg-icons/GitHub.svg',
    'utf8',
  );

  ejs.renderFile(
    './src/index.ejs',
    {
      github: 'https://github.com/brybrant/fade-scroll',
      githubSVG,
    },
    {
      views: ['./src/ejs'],
      strict: true,
      rmWhitespace: true,
    },
    (err, html) => {
      if (err) {
        console.error('Error:', err.message);
        return cb();
      }

      writeFileSync('./dist/index.html', html);

      cb();
    },
  );
}

/** @type {GulpTask} Browser Sync task */
function browserSyncTask(cb) {
  bs.init({
    files: ['./dist'],
    ghostMode: false,
    host: '127.0.0.1',
    online: false,
    open: false,
    port: 3000,
    reloadDebounce: 2000,
    server: {
      baseDir: ['dist'],
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
