/*
 * Request handlers
 */
// Dependencies
const _data = require("../data");
const helpers = require("../helpers");
const tokenMethods = require("./tokenMethods");
const userMethods = require("./userMethods");
const checkMethods = require("./checks");
// const temp = () => {
//   console.log("++++++++Thank You for requesting+++++++");
// };
const handlers = {};
handlers.sample = (data, callback) => {
  // callback an http status code and a payload object
  let payload = { OK: "received" };
  callback(200, payload);
};

handlers.ping = (data) => {
  return { status: "I am alive." };
};

// user methods
handlers.users = async (data) => {
  let acceptableMethods = ["post", "get", "put", "delete"];

  // console.log("DATA users", data);
  if (acceptableMethods.indexOf(data?.method.toLowerCase()) < 0) {
    throw new Error(`Invalid method, Cannot ${data.method} /users`);
  } else {
    try {
      // console.log("data method", data.method.toLowerCase());
      let handler = handlers._users[data?.method.toLowerCase()];
      let response = await handler(data);
      // console.log("response from read", response);
      return response;
    } catch (error) {
      console.log("ERRROR", error);
      throw error;
    }
  }
};
handlers._users = userMethods;

handlers.tokens = async (data) => {
  const allowedMethods = ["post", "get", "put", "delete"];
  if (allowedMethods.indexOf(data?.method.toLowerCase()) < 0) {
    throw new Error(JSON.stringify({ Error: "Invalid method for tokens" }));
  }
  try {
    let response = await handlers._tokens[data.method.toLowerCase()](data);
    return { response };
  } catch (error) {
    console.log(error);
    throw error;
    // reject({ Error: "Unable to generate token" });
  }
};

handlers._tokens = tokenMethods;

handlers.checks = async (data) => {
  const allowedMethods = ["post", "get", "put", "delete"];
  if (allowedMethods.indexOf(data?.method.toLowerCase()) < 0) {
    throw new Error(JSON.stringify({ Error: "Invalid method for tokens" }));
  }
  try {
    let response = await handlers._checks[data.method.toLowerCase()](data);
    return { response };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

handlers._checks = checkMethods;
handlers.error = () => {
  throw new Error("Hi this is a dummy Error");
};

handlers._verifyToken = async ({ token, phone }) => {
  try {
    const tokenReadResult = await _data.read("tokens", token);

    // match incoming phone numbers to phone associated with token
    if (tokenReadResult?.phone == phone) {
      // check if token has expired
      if (tokenReadResult?.expiry > Date.now()) {
        resolve(true);
      }
    } else resolve(false);
  } catch (error) {
    console.log("_verifyToken");
    throw error;
  }
};
// Not found handler
handlers.notFound = (data) => {
  return { status: 404 };
  //(404, { status: "not Found" });
};

module.exports = handlers;
