import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("GitHub Pages builds the real learning workbench for the repository subpath", async () => {
  const [packageJson, config, entry, html] = await Promise.all([
    source("package.json"),
    source("vite.pages.config.ts"),
    source("github-pages/main.tsx"),
    source("github-pages/index.html"),
  ]);

  const scripts = JSON.parse(packageJson).scripts;
  assert.equal(scripts["build:pages"], "vite build --config vite.pages.config.ts");
  assert.match(config, /base:\s*"\/personal-workbench\/"/);
  assert.match(config, /outDir:\s*"\.\.\/dist-pages"/);
  assert.match(entry, /import\s+\{\s*LearningWorkbench\s*\}/);
  assert.match(entry, /import\s+"\.\.\/app\/globals\.css"/);
  assert.match(entry, /createRoot\(root\)\.render\(<LearningWorkbench\s*\/>\)/);
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /%BASE_URL%favicon\.svg/);
  assert.match(html, /电路自习室｜本学期电子类课程个人学习站点/);
});

test("the main branch workflow validates and deploys only the Pages artifact", async () => {
  const workflow = await source(".github/workflows/pages.yml");

  assert.match(workflow, /branches:\s*\[main\]/);
  for (const command of ["npm ci", "npm test", "npm run lint", "npm run build:pages"]) {
    assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /path:\s*dist-pages/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
});
