const _data = require("../data");
const helpers = require("../helpers");
const { verifyToken } = require("./tokenMethods");
const userMethods = {};
userMethods.post = async (data) => {
  // firstname lastname phone password tosAgrement

  // @todo create regex function for validation
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
    throw new Error("All fields are neccesary");
  } else {
    try {
      console.log("try post user");
      await _data.read("users", phone);
    } catch (error) {
      if (error.code == "ENOENT") {
        console.log("catch if user post");
        // USER does not exists, create USER
        let hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          let userData = { firstname, lastname, phone, hashedPassword };
          const userCreateResult = await _data.create("users", phone, userData);
          console.log("users post create ", userCreateResult);
          return { msg: "User created successfully" };
        }

        return { msg: "User already exists" };
      }
    }
  }
};
userMethods.get = async (data) => {
  const { phone } = data.queryParams;
  console.log("userMethods get data", data);
  console.log("|\n\n\n");
  let response;
  if (!phone) {
    throw new Error();
  }
  try {
    response = await _data.read("users", phone);
    // hash incoming password and match it against passsword in DB
    const { firstname, lastname } = response;
    return { firstname, lastname, phone };
    // let userReqPasswordHash = helpers.hash(password);
    // if (userReqPasswordHash && response.hashedPassword) {
    //   if (userReqPasswordHash === response.hashedPassword) {
    //   }
    // }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
userMethods.delete = async (data) => {
  const { phone = "" } = (data && data.payload) || {};
  const { token = "" } = (data && data.headers) || {};
  // authenticate first
  const _isAuthenticated = await verifyToken({ phone, token });

  if (_isAuthenticated) {
    await _data.delete("users", phone + ".json");
  }
  throw new Error("Authentication required");
};
userMethods.put = async (data) => {
  const { payload = {} } = data;
  const { phone = "", password = "", firstname } = (data && data.payload) || {};
  // authenticate route
  try {
    const readResult = await _data.read("users", phone);
    console.log("readResult", readResult);
    let { phone: dbphone = "", hashedPassword = "" } = readResult;
    let newValues = {};
    // filter out new values from incoming data by matching against saved values
    for (const key in payload) {
      if (key != "phone" && key != "password") {
        newValues[key] = payload[key];
      } else if (key == "password") {
        newValues[hashedPassword] = helpers.hash(payload[key]);
      }
    }
    await _data.update(
      "users",
      phone + ".json",
      JSON.stringify({ ...newValues, phone: dbphone, hashedPassword })
    );
    return { msg: "user updated." };
  } catch (error) {
    if (error.code == "ENOENT") throw new Error("User already exists");
    console.log("user put read", error);
    throw error;
  }
};

module.exports = userMethods;
