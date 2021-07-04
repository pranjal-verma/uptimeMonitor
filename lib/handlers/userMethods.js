const _data = require("../data");
const helpers = require("../helpers");
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
userMethods.delete = (data) => {
  const { phone } = data.queryParams;
};
userMethods.put = (data) => {
  const { phone, password } = data;
  return;
};

module.exports = userMethods;
