/*
 * Request handlers
 */
// Dependencies
const _data = require("./data");
const helpers = require("./helpers");

// const temp = () => {
//   console.log("++++++++Thank You for requesting+++++++");
// };
const handlers = {};
handlers.sample = (data, callback) => {
  // callback an http status code and a payload object
  let payload = { OK: "received" };
  callback(200, payload);
};

handlers.ping = (data, callback) => {
  callback(200, { status: "I am alive." });
};

handlers.users = (data, callback) => {
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

handlers._users = {};
handlers._users.post = (data) => {
  // firstname lastname phone password tosAgrement
  return new Promise((resolve, reject) => {
    // @todo create refex function for validation
    let firstname =
      typeof data.payload.firstname === "string" &&
      data.payload.firstname.trim().length > 0
        ? data.payload.firstname
        : null;
    let lastname =
      typeof data.payload.lastname === "string" &&
      data.payload.lastname.trim().length > 0
        ? data.payload.lastname
        : null;
    let phone =
      typeof data.payload.phone === "string" &&
      data.payload.phone.trim().length > 0
        ? data.payload.phone
        : null;
    let password =
      typeof data.payload.password === "string" &&
      data.payload.password.trim().length > 0
        ? data.payload.password
        : null;
    if (!(firstname && lastname && phone && password)) {
      return reject("All fields are neccesary");
    } else {
      _data
        .read("users", phone)
        .then(() => {
          console.log("then block");
        })
        .catch((error) => {
          if (error.code === "ENOENT") {
            let hashedPassword = helpers.hash(password);
            if (hashedPassword) {
              let userObject = { firstname, lastname, phone, hashedPassword };
              _data
                .create("users", phone, userObject)
                .then(() =>
                  resolve({
                    ...userObject,
                    status: 401,
                    msg: "user created successfully",
                  })
                )
                .catch((error) => reject(error));
            }
          } else {
            return reject("User already exists");
          }
          console.log("catch block");
        });
    }
  });
};
handlers._delete = {};
handlers._user = {};
handlers._ = {};
// Not found handler
handlers.notFound = (data, callback) => {
  callback(404, { status: "not Found" });
};

module.exports = handlers;
