const http = require('http'),
  url = require('url'),
  fs = require('fs');

http
  .createServer((req, res) => {
    let q = new URL(req.url, `http://${req.headers.host}`);
    let filePath = '';

    fs.appendFile(
      'log.txt',
      `URL: ${q.href}\nTimestamp: ${new Date()}\n\n`,
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Added to log');
        }
      }
    );

    if (q.pathname.includes('documentation')) {
      filePath = __dirname + '/documentation.html';
    } else {
      filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
      res.writeHead(200, { 'content-Type': 'text/html' });
      res.write(data);
      res.end(`Href: ${q.href}\n`);
    });
  })
  .listen(8080);

console.log('My first Node test server is running on port 8080.');
