// NusaData — server statis kecil untuk pengembangan lokal.
// Menyajikan app/ di http://localhost:8080 (atau --port lain).
// Bukan bagian dari entry yang dinilai; grader hanya menjalankan main.ts.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, 'app');
const port = Number(process.argv.find((a) => a.startsWith('--port='))?.split('=')[1] ?? 8080);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const file = join(root, path === '/' ? 'index.html' : path);
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  const ext = file.slice(file.lastIndexOf('.'));
  res.writeHead(200, { 'content-type': types[ext] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log('NusaData di http://localhost:' + port);
});
