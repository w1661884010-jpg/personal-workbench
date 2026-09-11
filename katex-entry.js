/* KaTeX 打包入口：把原站 node_modules 的 katex 打成自包含 IIFE（window.KaTeX）。
   骨架页零依赖，公式渲染由 app.js 调用 KaTeX.renderToString 完成。 */
import katex from "katex";

window.KaTeX = katex;
