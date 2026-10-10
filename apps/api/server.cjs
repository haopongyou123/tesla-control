// Minimal mock API server (no external deps)
const http = require('http');

let tenants = [
  { id: 't-001', name: 'Tesla 中国', role: 'owner' },
  { id: 't-002', name: 'Tesla US', role: 'admin' },
  { id: 't-003', name: 'Tesla EU', role: 'viewer' },
];

const server = http.createServer((req, res) => {
  const url = req.url || '';

  if (req.method === 'GET' && url === '/api/tenants') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tenants));
    return;
  }

  if (req.method === 'POST' && url === '/api/tenants') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      try {
        const t = JSON.parse(body);
        const nt = { id: 't-' + Math.random().toString(36).slice(2, 8), name: t.name || 'New Tenant', role: t.role || 'viewer' };
        tenants.push(nt);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(nt));
      } catch {
        res.writeHead(400);
        res.end();
      }
    });
    return;
  }

  if (req.method === 'GET' && url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(4000, () => {
  console.log('Mock tenant API listening on http://localhost:4000');
});
