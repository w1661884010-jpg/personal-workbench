import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

test('workbench and math rebuild without any sibling repository', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  for (const entry of ['workbench-entry.tsx', 'katex-entry.js']) {
    const result = await build({ absWorkingDir: root, entryPoints: [entry], bundle: true,
      outdir: 'dist-isolation-check', write: false, metafile: true, platform: 'browser', logLevel: 'silent' });
    for (const input of Object.keys(result.metafile.inputs)) {
      const relative = path.relative(root, path.resolve(root, input));
      assert.ok(!relative.startsWith('..') && !path.isAbsolute(relative), `external build input: ${input}`);
    }
  }
});
