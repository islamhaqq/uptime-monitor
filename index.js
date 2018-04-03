// Define entry point for API.

const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');

const config = require('./config');

const { ports, environmentName } = config;

// Implement server logic.
const unifiedServer = (req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  const { method, headers } = req;

  // Treat paths with leading or trailing slashes or none the same
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

  const decoder = new StringDecoder('utf-8');
  let payload = '';
  req.on('data', data => {
    payload += decoder.write(data);
  });
  req.on('end', () => {
    payload += decoder.end();

    // Route requests to their respective handlers.
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
    ping: (dataToHandle, callback) => callback(null, 200),
    // Let user know their specified route was not found.
    notFound: (dataToHandle, callback) => {
      const statusCode = 404;
      const payload = { message: "That route does not exist!" };
      callback(null, statusCode, payload);
    }
  };

  const router = {
    ping: handlers.ping,
  };
};

// Run both a HTTP and a HTTPS version of our API.
const httpServer = http.createServer((res, req) => {
  unifiedServer(res,req);
})
const httpsOptions = {
  cert: fs.readSync('./https/cert.pem'),
  pem: fs.readSync('./https/key.pem')
};
const httpsServer = https.createServer(httpsOptions, (res, req) => {
  unifiedServer(res, req);
});
function logListenServer(port, environmentName) {
  console.log(`Server listening on port ${port} in the ${environmentName} environment.`);
}
httpServer.listen(ports.http, () => {
  logListenServer(ports.http, environmentName);
});
httpsServer.listen(ports.https, () => {
  logListenServer(ports.https, environmentName);
});
