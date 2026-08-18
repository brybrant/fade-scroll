import { build } from 'tsdown';

await build({
  clean: false,
  deps: {
    onlyBundle: ['@juggle/resize-observer'],
  },
  entry: '@juggle/resize-observer',
  format: 'iife',
  globalName: 'ResizeObserverPonyfill',
  platform: 'browser',
  sourcemap: false,
  target: 'es2015',
});

await build({
  clean: false,
  deps: {
    neverBundle: true,
  },
  dts: true,
  entry: ['./src/index.ts'],
  format: {
    cjs: {
      dts: false,
      minify: false,
      target: ['esnext'],
    },
    esm: {
      minify: false,
      target: ['esnext'],
    },
    iife: {
      banner: '"use strict";',
      minify: true,
      target: ['es2015'],
    },
  },
  globalName: 'FadeScroll',
  platform: 'browser',
  sourcemap: false,
});
