import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.argv[2] ?? 4173);
const root = resolve(process.cwd(), 'dist');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const resolvePath = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split('?')[0] ?? '/');
  const normalized = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const candidate = join(root, normalized);
  if (!candidate.startsWith(root)) return join(root, 'index.html');
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (existsSync(join(candidate, 'index.html'))) return join(candidate, 'index.html');
  return join(root, 'index.html');
};

const server = createServer((request, response) => {
  const filePath = resolvePath(request.url ?? '/');
  const type = mimeTypes[extname(filePath)] ?? 'application/octet-stream';

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': type,
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});
