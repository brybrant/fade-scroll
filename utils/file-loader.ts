import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

/**
 * Calls of the returned function shall resolve relative to {@link root}
 * @param root Absolute path to root directory
 * @returns File system load function
 */
export function createFileLoader(root: string) {
  return async function (path: string) {
    const absolute = resolve(root, path);

    const data = await readFile(absolute, 'utf8');

    return { data, path: absolute };
  };
}
