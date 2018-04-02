const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  const { method, headers } = req;

  const decoder = new StringDecoder('utf-8');
  let payload = '';
  req.on('data', data => {
    payload += decoder.write(data);
  });
  req.on('end', () => {
    payload += decoder.end();
  })

  // remove trailing and leading slashes
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '')
  res.end(`request received on path: ${trimmedPath} with method: ${method} and
    params: ${JSON.stringify(query)} and headers: ${JSON.stringify(headers)}\n`);
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
