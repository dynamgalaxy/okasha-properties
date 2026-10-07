import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const build = () => new Promise((resolveBuild, reject) => {
  const child = spawn(process.execPath, [join(root, 'scripts/build.mjs')], { stdio: 'inherit' });
  child.on('exit', (code) => code === 0 ? resolveBuild() : reject(new Error(`Build exited ${code}`)));
});
await build();
const dist = resolve(root, 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(dist, `.${pathname}`, pathname.endsWith('/') ? 'index.html' : '');
    if (!target.startsWith(`${dist}\\`) && target !== dist) throw new Error('Invalid path');
    const file = (await stat(target)).isDirectory() ? join(target, 'index.html') : target;
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Page not found');
  }
});
const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`Preview: http://localhost:${port}`));
