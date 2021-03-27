/* 
* Request handlers 
*/

const handlers = {}
handlers.sample = (data, callback) => {
  // callback an http status code and a payload object
  let payload = {"OK": "received"}
  callback(200, payload)
}

handlers.ping = (data, callback) => {
  callback(200,{status:"I am alive."})
}

handlers.users = (data, callback) => {
  let acceptableMethods = ['post', 'get', 'put', 'delete']
  if(data.method)
}
// Not found handler
handlers.notFound = (data, callback) => {
  callback(404, {status:"not Found"})
}


module.exports = handlers;
