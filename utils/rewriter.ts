import { pathToFileURL } from 'node:url';

import { minify } from 'html-minifier-next';
import { compileString } from 'sass';
import { optimize } from 'svgo';

import lightningcssConfig from '@brybrant/lightningcss-config';
import svgoConfig from '@brybrant/svgo-config';
import terserConfig from '@brybrant/terser-config';

import type { createFileLoader } from './file-loader.ts';

const htmlImport = /<!--\s*@include:(.*?)\s*-->/g;
const linkImport = /href=["']@data:(?:([a-zA-Z]+\/[\w.+-]+),)?(.*?)["']/g;
const styleImport = /<!--\s*@style:(.*?)\s*-->/g;
const scriptImport = /<!--\s*@script:(.*?)\s*-->/g;

/** Rudimentary template engine */
export class Rewriter {
  constructor(private readonly load: ReturnType<typeof createFileLoader>) {}

  async transform(html: string) {
    /**
     * Load resource files (such as favicon)
     * @example
     * ```html
     * <link href='@data:image/vnd.microsoft.icon,./favicon.ico'/>
     * ```
     */
    html = await this.replace(html, linkImport, async (_, mimeType, url) => {
      const file = await this.load(url.trim());

      if (mimeType === 'image/svg+xml') {
        const { data } = optimize(
          file.data,
          Object.assign({}, svgoConfig, { path: file.path }),
        );

        file.data = data;
      }

      const type = mimeType ? mimeType : 'text/plain';

      const encoded = encodeURIComponent(file.data);

      return `href='data:${type},${encoded}' type='${type}'`;
    });

    /**
     * Load stylesheet files (CSS or SCSS)
     * @example
     * ```html
     * <!-- @style:./path/to/stylesheet.scss -->
     * ```
     */
    html = await this.replace(html, styleImport, async (_, url) => {
      const file = await this.load(url.trim());

      let data = file.data;

      if (/\.s[ac]ss$/.test(url)) {
        data = compileString(data, { url: pathToFileURL(file.path) }).css;
      }

      return `<style>${data}</style>`;
    });

    /**
     * Load JavaScript files
     * @example
     * ```html
     * <!-- @script:./path/to/script.js -->
     * ```
     */
    html = await this.replace(html, scriptImport, async (_, url) => {
      const { data } = await this.load(url.trim());
      return `<script>${data}</script>`;
    });

    /**
     * Load HTML files
     * @example
     * ```html
     * <!-- @include:./path/to/file.html -->
     * ```
     */
    html = await this.replace(html, htmlImport, async (_, url) => {
      const { data } = await this.load(url.trim());
      return this.transform(data);
    });

    return html;
  }

  async replace(
    html: string,
    pattern: RegExp,
    callback: (...args: string[]) => Promise<string>,
  ) {
    const matches = [...html.matchAll(pattern)];

    let result = '';
    let offset = 0;

    for (const match of matches) {
      result += html.slice(offset, match.index);
      result += await callback(...match);
      offset = match.index + match[0].length;
    }

    return result + html.slice(offset);
  }

  async minify(html: string) {
    return minify(html, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyCSS: lightningcssConfig,
      minifyJS: terserConfig,
      minifySVG: svgoConfig,
      noNewlinesBeforeTagClose: true,
      removeComments: true,
      removeDefaultTypeAttributes: true,
      removeRedundantAttributes: true,
    });
  }
}
