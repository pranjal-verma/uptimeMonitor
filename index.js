const http = require("http");
const https = require("https")
const fs = require("fs");
// const url = require('url') Deprecated

const lib = require('./lib/data');
const handlers = require('./lib/handlers');

// lib.create('gold','temp', {me:'lorem ipsum'}, console.log)
lib.create('gold', 'temp',{bajreDaSitta:"mene punjabi nahi aati"})
// lib.read('gold', 'temp')
// console.log(process.env.NODE_ENV)
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

// console.log(decoder.write(rsaOptions.key))

const config = require('./config.js')

const httpPORT = config.httpPORT || 8080;
const httpsPORT = config.httpsPORT || 8081;

const BASE_URL = `http://localhost:${httpPORT}`;
const rsaOptions = {
  cert: decoder.write(fs.readFileSync('./https/33710873_localhost3000.cert')),
  key: decoder.write(fs.readFileSync('./https/33710873_localhost3000.key'))
};

const httpServer = http.createServer((req, res) =>{
  unifiedServer(req, res)
});

const httpsServer = https.createServer(rsaOptions, (req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPORT, () => {
  console.log(`HTTP server hosted on port ${httpPORT}`);
});

httpsServer.listen(config.httpsPORT, () => {
  console.log(`HTTPS server hosted on ${httpsPORT}`);
});

// define request handlers
// define request router
const router = {
  'sample': handlers.sample,
  'users': handlers.users
}

const unifiedServer = (req, res) => {
    const receivedUrl = new URL(req.url, BASE_URL);
    
    let buffer = ""
    console.log(receivedUrl);
    
    const path = receivedUrl.pathname
    const trimmedPath = path.split('/');
    req.on('data', (data) => {
      buffer += decoder.write(data)
    })
    console.log("processing normally");
    req.on('end', () => {
      // console.log(buffer);
      // Choose the handler this request should go to, if not found return 404 handler
      const requiredHandler = handlers.hasOwnProperty(trimmedPath[1]) ? handlers[trimmedPath[1]] : handlers.notFound; // THIS IS A BAD WAY ON DOING IT
      let data = {
        buffer,
        path,
        port: receivedUrl.port,
        hostname:receivedUrl.hostname
      }
      console.log(data);
      requiredHandler(data, (statusCode, payload = {}) => {
        statusCode = (typeof(statusCode) == 'number'? statusCode : 500 )
        // stringify payload
        let payloadString = JSON.stringify(payload);
        res.setHeader('Content-Type','application/json')
        // return the response
        res.writeHead(statusCode)
        res.end(payloadString)
      })
    })
}
