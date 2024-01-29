const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handling different routes
  if (req.url === '/') {
    // If the request is for the root path, serve an HTML file
    const filePath = path.join(__dirname, 'index.html');

    // Read the HTML file
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/script.js') {
    // If the request is for a JavaScript file
    const filePath = path.join(__dirname, 'script.js');

    // Read the JavaScript file
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(content);
      }
    });
  } else if (req.url === '/styles.css') {
    // If the request is for a CSS file
    const filePath = path.join(__dirname, 'styles.css');

    // Read the CSS file
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(content);
      }
    });
  } else {
    // Handle other routes or resources
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});