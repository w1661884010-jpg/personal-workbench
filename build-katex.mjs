/* KaTeX bundle 构建脚本（开发期工具，不属于运行时）。
   用法：node build-katex.mjs */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const esbuild = require("C:/Users/Lenovo/Documents/codex_projects/personal-workbench-sites/node_modules/esbuild/lib/main.js");

const here = path.dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: [path.join(here, "katex-entry.js")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2018",
  charset: "utf8",
  minify: true,
  outfile: path.join(here, "katex.bundle.js"),
  logLevel: "info",
});

console.log("katex bundle built.");
