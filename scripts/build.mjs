import { cp, mkdir, readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'public'), resolve(root, 'dist'), { recursive: true });
await build({ entryPoints: [resolve(root, 'public/src/app.js')], bundle: true, format: 'esm', target: 'es2022', minify: true, outfile: resolve(dist, 'app.js') });
const files = await readdir(dist, { recursive: true });
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
for (const url of html.matchAll(/(?:href|src)="\/(.*?)"/g)) {
  if (!files.includes(url[1])) throw new Error(`Missing asset: ${url[1]}`);
}
console.log(`SayDo built: ${files.length} entries in dist/`);
