// Define entry point for API.

const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');

const config = require('./config');
const handlers = require('./lib/handlers');

const { ports, environmentName } = config;

// Implement server logic.
const unifiedServer = (req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  const { method, headers } = req;

  // Treat paths with leading or trailing slashes or none the same
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

  const decoder = new StringDecoder('utf-8');
  let payloadString = '';
  req.on('data', data => {
    payloadString += decoder.write(data);
  });
  req.on('end', () => {
    payloadString += decoder.end();
    try {
      const payload = JSON.parse(payloadString);
    } catch (err) {
      return res.end(JSON.stringify({ error: err.toString() }));
    }
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
      res.writeHead(statusCode, {
        'Content-Type': 'application/json'
      });
      if (err) {
        console.log(`Responding to request with status code ${statusCode} and error message: ${JSON.stringify(err)}`);
        return res.end(JSON.stringify(err));
      }
      res.end(JSON.stringify(payload));
      console.log(`Responding to request with status code ${statusCode} and ${JSON.stringify(payload)}`);
    });
  })

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
