const _data = require("../data");
const helpers = require("../helpers");
const userMethods = {};
userMethods.post = (data) => {
  // firstname lastname phone password tosAgrement
  return new Promise((resolve, reject) => {
    // @todo create refex function for validation
    // console.log("++++____++++", data);
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
          reject("User already exists");
        })
        .catch((error) => {
          if (error.code === "ENOENT") {
            let hashedPassword = helpers.hash(password);
            if (hashedPassword) {
              let userObject = { firstname, lastname, phone, hashedPassword };
              _data
                .create("users", phone, userObject)
                .then((resp) => {
                  console.log(resp);
                  resolve({
                    ...userObject,
                    msg: "user created successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } else {
            return reject("User already exists");
          }
          console.log("catch block");
        });
    }
  });
};
userMethods.get = (data) => {
  const { phone } = data.queryParams;

  return new Promise(async (resolve, reject) => {
    let response;
    if (!phone) return reject("invalid credentials");
    try {
      response = await _data.read("users", phone);
      // hash incoming password and match it against passsword in DB
      const { firstname, lastname } = response;
      resolve({ firstname, lastname, phone });
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
userMethods.delete = {};
userMethods.put = () => {};

module.exports = userMethods;
