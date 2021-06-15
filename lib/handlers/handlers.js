/*
 * Request handlers
 */
// Dependencies
const _data = require("../data");
const helpers = require("../helpers");
const tokenMethods = require("./tokenMethods");
const userMethods = require("./userMethods");
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

handlers.users = (data) => {
  let acceptableMethods = ["post", "get", "put", "delete"];

  return new Promise((resolve, reject) => {
    if (acceptableMethods.indexOf(data?.method.toLowerCase()) < 0) {
      reject(`Invalid method, Cannot ${data.method} /users`);
    } else {
      try {
        let response = handlers._users[data.method.toLowerCase()](data);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    }
  });
};
handlers.error = () => {
  throw new Error("Hi this is a dummy Error");
};
handlers._users = userMethods;
handlers.tokens = (data) => {
  const allowedMethods = ["post", "get", "put", "delete"];
  return new Promise(async (resolve, reject) => {
    if (allowedMethods.indexOf(data?.method.toLowerCase()) < 0) {
      return reject({ Error: "Invalid method for tokens" });
    }
    try {
      let response = await handlers._tokens[data.method.toLowerCase()](data);
      resolve(response);
    } catch (error) {
      console.log(error);
      reject({ Error: "Unable to generate token" });
    }
  });
};

handlers._tokens = tokenMethods;

// Not found handler
handlers.notFound = (data) => {
  return { status: 404 };
  //(404, { status: "not Found" });
};

module.exports = handlers;
