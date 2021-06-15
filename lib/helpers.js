const crypto = require("crypto");
const helpers = {};
const config = require("../config.js");

helpers.hash = (message) => {
  if (typeof message === "string") {
    const hmac = crypto.createHmac("sha256", config.hashingSecret);
    let messageDigest = hmac.update(message).digest("hex");
    console.log("message digest", messageDigest);
    return messageDigest;
  }
};

helpers.parseJSON = (json) => {
  try {
    let result = JSON.parse(json);
    return result;
  } catch (error) {
    return null;
  }
};

helpers.parseObjectToJson = (obj) => {
  try {
    const result = JSON.stringify(obj);
  } catch (error) {
    return null;
  }
};

helpers.createRandomString = (size) => {
  try {
    const randomString = crypto.randomBytes(size).toString("hex");
    if (randomString) {
      return randomString;
    }
    return null;
  } catch (error) {
    return null;
  }
};
module.exports = helpers;
