import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

import stylelint from 'stylelint';

import GitHubSVG from '@brybrant/svg-icons/GitHub.svg';
import stylelintConfig from '@brybrant/stylelint-config';

import { createFileLoader } from '../utils/file-loader.ts';
import { Rewriter } from '../utils/rewriter.ts';

const github = 'https://github.com/brybrant/fade-scroll' as const;

const cwd = process.cwd();

await stylelint
  .lint({
    files: `./demo/**/*.scss`,
    config: stylelintConfig,
  })
  .then(({ report }) => {
    console.log(report);
  });

const load = createFileLoader(resolve(cwd, 'demo'));

const rewriter = new Rewriter(load);

const githubLink = /href=["']@github(.*?)["']/g;

const html = await load('./demo.html').then(async ({ data }) => {
  data = await rewriter.transform(data);

  data = await rewriter.replace(data, /<!--\s*@github\s*-->/g, () => {
    return `
      <a
        class='github'
        href='${github}'
        target='_blank'
        title='GitHub'
      >
        ${GitHubSVG}
      </a>
    `;
  });

  data = await rewriter.replace(data, githubLink, (_, path) => {
    return `href='${github}/blob/master${path}' target='_blank'`;
  });

  return rewriter.minify(data);
});

await writeFile('./dist/index.html', html);
