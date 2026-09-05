/* 工作台 bundle 构建脚本（开发期工具，不属于运行时）。
   把原站点 React 工作台 + React 运行时打成自包含 IIFE。
   用法：node build-workbench.mjs */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const esbuild = require("C:/Users/Lenovo/Documents/codex_projects/personal-workbench-sites/node_modules/esbuild/lib/main.js");

const here = path.dirname(fileURLToPath(import.meta.url));

const result = await esbuild.build({
  entryPoints: [path.join(here, "workbench-entry.tsx")],
  bundle: true,
  format: "iife",
  globalName: "PrototypeWorkbench",
  platform: "browser",
  target: "es2018",
  charset: "utf8",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: path.join(here, "workbench.bundle.js"),
  logLevel: "info",
});

console.log("workbench bundle built.");
