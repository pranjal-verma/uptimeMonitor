// service to check a url every x units of time and inform user if site is down
// upto 5 checks per user
const config = require("../../config");
const helpers = require("../helpers");
const validProtocols = ["http", "https"];

const MAX_CHECKS = config.maxChecks || 5;
const _data = require("../data");
const { verifyToken } = require("./tokenMethods");
const checkMethods = {};

// get lists of checks, requires token
checkMethods.get = async (data) => {
  const { queryParams = {}, headers = {} } = data || {};

  console.log("🚀 ~ file: checks.js ~ line 15 ~ queryParams", queryParams);
  const { id } = queryParams;
  const { token } = headers;
  // grab check from db
  try {
    const checkReadResult = await _data.read("checks", id);
    const tokenReadResult = await _data.read("tokens", token);

    // match phone from check data to token data
    const { userPhone = "" } = checkReadResult || {};
    const { phone: tokenPhone } = tokenReadResult || {};

    if (userPhone.length && tokenPhone.length) {
      if (userPhone == tokenPhone) {
        return checkReadResult;
      }
    }
  } catch (error) {
    console.error(error);
  }
  //   const isTokenValid = await;
};

// creates new check
// required Data- protocol, url, method, success  codes, timeOut
checkMethods.post = async (data) => {
  const { payload = {}, headers = {} } = data || {};
  const {
    protocol = "",
    url = "",
    method = "",
    successCodes = [],
    timeOut = 0,
  } = payload;
  const { token = "" } = headers;
  if (
    !protocol ||
    !url ||
    !method ||
    !Array.isArray(successCodes) ||
    !successCodes.length ||
    timeOut <= 0
  ) {
    // throw new Error("Invalid data, please refer API documentation");
  }
  if (validProtocols.indexOf(protocol) < 0)
    throw new Error("Invalid protocol, available protocols are: http, https");
  //   const {token} =
  // check if user has made any previous checks
  try {
    let tokenData = await _data.read("tokens", token);
    console.log(
      "🚀 ~ file: checks.js ~ line 44 ~ checkMethods.post= ~ tokenData",
      tokenData
    );
    if (!tokenData || !Object.keys(tokenData).length) {
      throw new Error("invalid token");
    }
    const { phone = "" } = tokenData;
    const userData = await _data.read("users", phone);
    const { checks = [] } = userData || {};
    if (Array.isArray(checks) && checks.length > MAX_CHECKS) {
      throw new Error(`Cannot have more than ${MAX_CHECKS} per user`);
    }
    // generate random string for uneeq checkid
    let checkId = helpers.createRandomString(10);
    checks.push(checkId);
    let newCheck = {
      _id: checkId,
      url,
      protocol,
      timeOut,
      method,
      userPhone: phone,
    };
    await _data.update("users", phone + ".json", { ...userData, checks });
    await _data.create("checks", checkId, newCheck);
    return { checkId };
  } catch (error) {
    console.error(error);
  }
};

// update existing fields in check data
checkMethods.put = async (data) => {
  const { payload = {}, headers = {} } = data || {};
  const {
    id = "",
    url = "",
    method = "",
    protocol = "",
    successCodes = [],
    timeOut = 0,
  } = payload;
  const { token = "" } = headers;

  if (!id) {
    throw new Error("id is required");
  }
  try {
    const checkReadResult = await _data.read("checks", id);
    const tokenReadResult = await _data.read("tokens", token);

    // match phone from check data to token data
    const { userPhone = "" } = checkReadResult || {};
    const { phone: tokenPhone } = tokenReadResult || {};

    if (userPhone.length && tokenPhone.length) {
      console.log("phone valid");
      if (userPhone == tokenPhone) {
        let newValues = {};
        console.log("phones match");
        // filter out new values from incoming data by matching against saved values
        for (const key in payload) {
          if (key != "_id" && key != "userPhone") {
            newValues[key] = payload[key];
          }
        }
        console.log(
          "🚀 ~ file: checks.js ~ line 126 ~ checkMethods.put= ~ newValues",
          newValues
        );
        await _data.update("checks", id + ".json", {
          ...newValues,
          id,
          userPhone,
        });
        return;
      }
    }
  } catch (error) {
    console.error(error);
    if (error.status == "ENOENT") throw new Error("check id is invalid");
    throw new Error("");
  }
};

checkMethods.delete = async (data) => {
  const { payload = {}, headers = {} } = data || {};
  const { id = "" } = payload;
  const { token = "" } = headers;

  try {
    const checkReadResult = await _data.read("checks", id);
    const tokenReadResult = await _data.read("tokens", token);

    // match phone from check data to token data
    const { userPhone = "" } = checkReadResult || {};
    const { phone: tokenPhone } = tokenReadResult || {};

    if (userPhone.length && tokenPhone.length) {
      if (userPhone == tokenPhone) {
        await _data.delete("checks", id + ".json");
      }
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports = checkMethods;
