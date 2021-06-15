const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const util = require("util");
// const url = require('url') Deprecated
const lib = require("./lib/data");
const handlers = require("./lib/handlers/handlers.js");

const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf-8");

const config = require("./config.js");
const helpers = require("./lib/helpers");
console.log(process.env.NODE_ENV);
const httpPORT = config.httpPORT || 8080;
const httpsPORT = config.httpsPORT || 8081;

const BASE_URL = `http://localhost:${httpPORT}`;
process.on("uncaughtException", (error, origin) => {
  let error_path = path.join(__dirname, ".logs", Date.now() + ".log");
  // return {};
  fs.writeFileSync(error_path, util.format(error));
});
const rsaOptions = {
  cert: decoder.write(fs.readFileSync("./https/6410811_localhost3000.cert")),
  key: decoder.write(fs.readFileSync("./https/6410811_localhost3000.key")),
};

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
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
  sample: handlers.sample,
  users: handlers.users,
};

const unifiedServer = async (req, res) => {
  const receivedUrl = new URL(req.url, BASE_URL);
  let queryParams = {};
  receivedUrl.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  // console.log("queryParams are &&********", queryParams);
  let pathCount = 1;
  let buffer = "";
  // console.log(receivedUrl);
  const method = req.method;
  const path = receivedUrl.pathname;
  const trimmedPath = path.split("/");
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  // console.log("processing normally");
  req.on("end", async () => {
    // console.log(buffer);
    // Choose the handler this request should go to, if not found return 404 handler
    const requiredHandler = handlers.hasOwnProperty(trimmedPath[1])
      ? handlers[trimmedPath[1]]
      : handlers.notFound; // THIS IS A BAD WAY ON DOING IT
    let data = {
      receivedUrl,
      queryParams,
      payload: helpers.parseJSON(buffer),
      path,
      method,
      port: receivedUrl.port,
      hostname: receivedUrl.hostname,
    };
    // console.log(data);
    try {
      const response = await requiredHandler(data);
      console.log(response);
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(response));
    } catch (error) {
      console.log("Error unified server", error);
      res.end(String(error));
    }
    // requiredHandler(data, (statusCode, payload = {}) => {
    //   statusCode = (typeof(statusCode) == 'number'? statusCode : 500 )
    //   // stringify payload
    //   let payloadString = JSON.stringify(payload);
    //   res.setHeader('Content-Type','application/json')
    //   // return the response
    //   res.writeHead(statusCode)
    //   res.end(payloadString)
    // })
  });
};
