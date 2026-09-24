import { cp, mkdir, readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
await mkdir(resolve(root, 'dist'), { recursive: true });
await cp(resolve(root, 'public'), resolve(root, 'dist'), { recursive: true });
const files = await readdir(resolve(root, 'dist'), { recursive: true });
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
for (const url of html.matchAll(/(?:href|src)="\/(.*?)"/g)) {
  if (!files.includes(url[1])) throw new Error(`Missing asset: ${url[1]}`);
}
console.log(`SayDo built: ${files.length} entries in dist/`);
