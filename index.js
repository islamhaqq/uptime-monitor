const http = require('http');
const url = require('url');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const {pathname} = url.parse(req.url, true)
  const {method} = req;

  // remove trailing and leading slashes
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '')
  res.end('Hello World!\n');

  console.log(`request received on path: ${trimmedPath} with method: ${method}`)
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
