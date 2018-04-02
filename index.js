const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  const { method, headers } = req;

  // remove trailing and leading slashes
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

  const decoder = new StringDecoder('utf-8');
  let payload = '';
  req.on('data', data => {
    payload += decoder.write(data);
  });
  req.on('end', () => {
    payload += decoder.end();

    const dataToHandle = {
      trimmedPath,
      query,
      method,
      headers,
      payload,
    };
    const requestHandler = router[trimmedPath] ? router[trimmedPath] : handlers.notFound;
    requestHandler(dataToHandle, (err, statusCode = 200, payload = {}) => {
      console.log(`Request made with`, dataToHandle);
      if (err) res.end(err);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
      console.log(`Responding to request with status code ${statusCode} and ${JSON.stringify(payload)}`);
    });
  })

  const handlers = {
    sample: (dataToHandle, callback) => {
      const statusCode = 406;
      const payload = { message: "Sample route exists!" };
      callback(null, statusCode, payload);
    },
    // let user know their route was not found
    notFound: (dataToHandle, callback) => {
      const statusCode = 404;
      const payload = { message: "That route does not exist!" };
      callback(null, statusCode, payload);
    }
  };

  const router = {
    sample: handlers.sample,
  };
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
