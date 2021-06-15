const validators = require("../validators");
const helpers = require("../helpers");
const dataHandler = require("../data");

const tokenMethods = {};

tokenMethods.get = (data) => {
  const { token } = data.queryParams;

  return new Promise(async (resolve, reject) => {
    let response;
    if (!token) return reject("invalid credentials");
    try {
      response = await dataHandler.read("tokens", token);
      // hash incoming password and match it against passsword in DB
      const { phone, expiry } = response;
      resolve({ phone });
      // let userReqPasswordHash = helpers.hash(password);
      // if (userReqPasswordHash && response.hashedPassword) {
      //   if (userReqPasswordHash === response.hashedPassword) {
      //   }
      // }
    } catch (error) {
      console.log(error);
      reject({ status: "404", msg: "" });
    }
  });
};

// create a token
// required: phone, password
tokenMethods.post = (data) => {
  return new Promise(async (resolve, reject) => {
    // const phone = validators.phoneValidator();
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
    if (!phone || !password) {
      reject({ Error: "missing required fields" });
    } else {
      // Hash received password and match with db password
      let hashedPassword = helpers.hash(password);
      try {
        // check if phone exists
        // if so, grab password
        const dbReadResult = await dataHandler.read("users", phone);
        // check if password valid
        if (hashedPassword === dbReadResult.hashedPassword) {
          // create new token that expires in an hour
          const tokenId = helpers.createRandomString(20);
          // console.log("_____________=======", tokenId);

          let tokenObject;
          if (tokenId) {
            tokenObject = {
              phone,
              id: tokenId,
              expiry: Date.now() + 1000 * 60,
            };
            // const webToken = helpers.parseObjectToJson(tokenObject);
            await dataHandler.create("tokens", tokenId, tokenObject);
            return resolve(tokenId);
          }
        } else return reject({ Error: "Incorrect password" });
      } catch (error) {
        console.log(error);
        if (error.status === "ENOENT") {
          return reject({ Error: "User not found" });
        } else return reject({ Error: "Internal Server Error" });
      }
    }
  });
};
tokenMethods.put = () => {};
tokenMethods.delete = () => {};

module.exports = tokenMethods;
