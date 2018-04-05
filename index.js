// Define entry point for API.

const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');

const config = require('./lib/config');
const handlers = require('./lib/handlers');

const { ports, environmentName } = config;

// Implement server logic.
const unifiedServer = (req, res) => {
  // Store valuable information provided by the request URL.
  const { pathname, query } = url.parse(req.url, true)
  const { method, headers } = req;

  // Treat paths with leading or trailing slashes or none the same.
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

  // Decode buffer into a UTF-8 character encoded string.
  const decoder = new StringDecoder('utf-8');
  let payloadString = '';
  req.on('data', data => {
    payloadString += decoder.write(data);
  });
  req.on('end', () => {
    payloadString += decoder.end();
    try {
      // Make sure there's a payload before converting it into an Object.
      var payload = payloadString ? JSON.parse(payloadString) : '';
    } catch (err) {
      return res.end(JSON.stringify({ error: err.toString() }));
    }
    const dataToHandle = {
      trimmedPath,
      query,
      method,
      headers,
      payload,
    };
    // Call handlers to handle request via router.
    const requestHandler = router[trimmedPath] ? router[trimmedPath] : handlers.notFound;
    requestHandler(dataToHandle, (err, statusCode = 200, payload = {}) => {
      // Send status code and any other additional headers.
      res.writeHead(statusCode, {
        'Content-Type': 'application/json'
      });
      // Handle errors and successes.
      if (err) {
        const errorMessage = JSON.stringify({ error: err.message });
        console.log(`Responding to request with status code ${statusCode} and error message: ${errorMessage}`);
        return res.end(errorMessage);
      }
      res.end(JSON.stringify(payload));
    });
  });

  // Map routes to handlers.
  const router = {
    ping: handlers.ping,
    user: handlers.user,
  };
};

// Run both a HTTP and a HTTPS version of our API.
const httpServer = http.createServer((res, req) => {
  unifiedServer(res,req);
})
const httpsOptions = {
  cert: fs.readFileSync('./https/cert.pem'),
  pem: fs.readFileSync('./https/key.pem')
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
