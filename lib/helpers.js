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
module.exports = helpers;
