// Publish the verified runtime only; never expose project docs or local configuration.
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('.', import.meta.url));
const out = join(root, 'dist-pages'); // fixed generated-output directory only
const files = ['index.html', 'styles.css', 'app.js', 'courses.js',
  'workbench.bundle.js', 'workbench.bundle.css', 'katex.bundle.js', 'katex.min.css'];
const html = await readFile(join(root, 'index.html'), 'utf8');
for (const [, asset] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  assert.ok(asset.startsWith('./') && files.includes(asset.slice(2)), `Unexpected entry asset: ${asset}`);
}
for (const file of files) await readFile(join(root, file));
const fonts = await readdir(join(root, 'fonts'));
assert.ok(fonts.length > 0, 'KaTeX fonts required');
for (const [, asset] of (await readFile(join(root, 'katex.min.css'), 'utf8')).matchAll(/url\(([^)]+)\)/g)) {
  assert.ok(asset.startsWith('fonts/') && fonts.includes(asset.slice(6)), `Missing font: ${asset}`);
}
await rm(out, { recursive: true, force: true });
await mkdir(out);
for (const file of files) await cp(join(root, file), join(out, file));
await cp(join(root, 'fonts'), join(out, 'fonts'), { recursive: true });
await writeFile(join(out, '.nojekyll'), '');
console.log(`Pages package validated: ${files.length} runtime files, ${fonts.length} fonts -> ${out}`);
