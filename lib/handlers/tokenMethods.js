const validators = require("../validators");
const helpers = require("../helpers");
const dataHandler = require("../data");

const tokenMethods = {};

tokenMethods.get = async (data) => {
  const { token } = data.queryParams;

  let response;
  if (!token) return reject("invalid credentials");
  try {
    response = await dataHandler.read("tokens", token);
    // hash incoming password and match it against passsword in DB
    const { phone, expiry } = response;
    console.log("response token", response);
    return { phone };
    // let userReqPasswordHash = helpers.hash(password);
    // if (userReqPasswordHash && response.hashedPassword) {
    //   if (userReqPasswordHash === response.hashedPassword) {
    //   }
    // }
  } catch (error) {
    console.log(error);
    throw error;
    // throw new Error({ status: "404", msg: "" });
  }
};

// create a token
// required: phone, password
tokenMethods.post = async (data) => {
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
    throw new Error("Error: missing required fields");
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

        let tokenObject;
        if (tokenId) {
          tokenObject = {
            phone,
            id: tokenId,
            expiry: Date.now() + 1000 * 60,
          };
          // const webToken = helpers.parseObjectToJson(tokenObject);
          await dataHandler.create("tokens", tokenId, tokenObject);
          return { tokenId };
        }
      } else throw new Error(" Error: Incorrect password");
    } catch (error) {
      console.log(error);
      if (error.status === "ENOENT") {
        throw new Error(JSON.stringify({ Error: "User not found" }));
      } else
        throw new Error(JSON.stringify({ Error: "Internal Server Error" }));
    }
  }
};

// tokens put
// extend a token

tokenMethods.put = async (data) => {
  console.log("tokenMethods put", data);
  let { phone = "", password = "", token = "" } = data && data.payload;
  if (
    !typeof phone == "string" ||
    !phone.trim().length > 0 ||
    !typeof password == "string" ||
    !password.trim().length > 0
  ) {
    throw new Error(JSON.stringify({ Error: "Invalid credentials" }));
  }
  if (!phone || !password) {
    throw new Error(JSON.stringify({ Error: "missing required fields" }));
  } else {
    // Hash received password and match with db password
    let hashedPassword = helpers.hash(password);
    try {
      // check if phone exists
      // if so, grab password
      const dbReadResult = await dataHandler.read("users", phone);
      console.log("tokenMEthods dbReadResult", dbReadResult);
      // check if password valid
      if (hashedPassword === dbReadResult.hashedPassword) {
        // Grab token from .data and update its
        console.log("got here");
        let tokenObject;
        if (token) {
          console.log("got here aswell");
          tokenObject = {
            phone,
            id: token,
            // bogus: "bogus",
            expiry: Date.now() + 1000 * 60,
          };
          // const webToken = helpers.parseObjectToJson(tokenObject);
          const updateResult = await dataHandler.update(
            "tokens",
            token + ".json",
            JSON.stringify(tokenObject)
          );
          console.log("updateResult", updateResult);
          return { token };
        }
      } else throw new Error(JSON.stringify({ Error: "Incorrect password" }));
    } catch (error) {
      console.log(error);
      if (error.status === "ENOENT") {
        throw new Error(JSON.stringify({ Error: "User not found" }));
      } else
        throw new Error(JSON.stringify({ Error: "Internal Server Error" }));
    }
  }
};

tokenMethods.delete = (data) => {
  // requires phone password and token
};

module.exports = tokenMethods;
