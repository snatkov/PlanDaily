const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : decodeURIComponent(req.url));
  const ext = path.extname(filePath);
  const ct = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — файл не найден');
    } else {
      res.writeHead(200, {
        'Content-Type': ct,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ifaces = os.networkInterfaces();
  let ip = '127.0.0.1';
  Object.keys(ifaces).forEach(k => {
    (ifaces[k] || []).forEach(v => {
      if (v.family === 'IPv4' && !v.internal) ip = v.address;
    });
  });

  console.log('');
  console.log('  PlanDaily запущен!');
  console.log('');
  console.log('  На компьютере:  http://localhost:' + PORT);
  console.log('');
  console.log('  На iPhone:      http://' + ip + ':' + PORT);
  console.log('');
  console.log('  Нажми Ctrl+C для остановки');
  console.log('');
  console.log('  На iPhone открой Safari → введи адрес выше');
  console.log('  → Share → Add to Home Screen (как приложение)');
  console.log('');
});
