// 零依赖静态服务器（原型预览用）：node serve.mjs [port]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.argv[2] ?? 3010);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".md": "text/plain; charset=utf-8" };

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const path = normalize(join(root, decodeURIComponent(url.pathname === "/" ? "index.html" : url.pathname)));
    if (!path.startsWith(root)) { res.writeHead(403); res.end(); return; }
    const body = await readFile(path);
    res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(port, () => console.log(`serving ${root} at http://localhost:${port}/`));
