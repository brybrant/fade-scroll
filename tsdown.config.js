import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: false,
  dts: true,
  entry: ['./src/index.ts'],
  format: {
    esm: {
      outExtensions: () => ({
        js: '.mjs',
        dts: '.d.ts',
      }),
      target: ['es2015'],
    },
    iife: {
      outputOptions: (options) => {
        options.entryFileNames = '[name].js';
        options.chunkFileNames = '[name]-[hash].js';
      },
      target: ['es2015'],
    },
  },
  globalName: 'FadeScroll',
  minify: true,
  platform: 'browser',
  skipNodeModulesBundle: true,
  sourcemap: 'hidden',
});
