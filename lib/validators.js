export const emailValidator = (email) => {
  if (typeof email !== "string" || email.length < 0) return false;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const nameValidator = (name) => {
  if (typeof name !== "string" || name.length <= 0) return false;
  const re = /^[a-z ,.'-]+$/i;
  return re.test(String(name).toLowerCase());
};

export const phoneValidator = (phone) => {
  if (typeof phone !== "string" || phone.length <= 0) return false;
  const re = /[]/;
  return re.test(phone);
};

// export const passwordValidator = (password) => {
//   if(typeof password !== "string" || phone.length <= 0) return false;
//   return re.test(passoj)
// }
