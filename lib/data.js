/*
 * Library for storing and editing data
 */

// Dependencies

const fs = require("fs");
const path = require("path");
// const os = require('os')
const fsPromises = require("fs").promises;
const helpers = require("./helpers");
const lib = {};
//Define basedir for lib i.e .data in root folder
lib.baseDir = path.join(__dirname, "..", ".data");

// write data to file
lib.create = async (dir, file, data) => {
  // Open file for writing
  let filehandle;
  let workingPath;
  // for windows
  // if(os.platform() === 'win32') workingPath = path.join(__dirname, '\\..\\', '.\\', '.data', dir, file + '.json')
  workingPath = path.join(__dirname, "..", ".data", dir);
  try {
    // filehandle = await fsPromises.open(workingPath, 'wx');
    const stringifiedData = JSON.stringify(data);
    if (!fs.existsSync(workingPath)) {
      fs.mkdirSync(workingPath);
    }

    await fsPromises.writeFile(
      path.join(workingPath, file + ".json"),
      stringifiedData,
      {
        encoding: "utf-8",
        flag: "w+",
      }
    );
  } catch (error) {
    console.log("Error in writing to file", error);
  } finally {
    filehandle ? await filehandle.close() : null;
  }

  // fsPromises.open()
  // fs.open(workingPath, 'wx', (err, fileDesc) => {
  //   if(err) console.log(err)
  //   if(!err && fileDesc){
  //     console.log("file description is", fileDesc)

  //     // continue with our logic
  //     const stringifiedData = JSON.stringify(data)

  //     fs.writeFile(fileDesc, stringifiedData,  (error)=>{
  //       if(!err){
  //         fs.close(fileDesc, err => {
  //           if(!err) callback(false)
  //           else callback("Error closing file")
  //         })
  //       }else{
  //         callback('Error writing to file')
  //       }
  //     } )
  //   }else{
  //     callback("Could not create file, it may already exist")
  //     console.error(err)
  //   }
  // })
};

// function to read contents of a file
lib.read = async (dir, file) => {
  return new Promise(async (resolve, reject) => {
    let readPath = path.join(__dirname, "..", ".data", dir, file + ".json");
    // if(os.platform() === 'win32') readPath = path.join(__dirname, '\\..\\', '.\\', '.data', dir, file + '.json')
    let readResult = null;
    try {
      readResult = await fsPromises.readFile(readPath, { encoding: "utf-8" });
      // console.log(readResult);
      let readResultObject = helpers.parseJSON(readResult);
      console.log("datajs, readResultObject", readResultObject);
      if (typeof readResultObject === "object") {
        resolve(readResultObject);
      } else {
        reject("data might be corrupted");
      }
      return;
    } catch (error) {
      console.error("Error data read", error);
      reject(error);
      return;
    }
  });
};

// function to update contents of file
// all keys will be rewritten

lib.update = (dir, file, data) => {
  return new Promise(async (resolve, reject) => {
    const readPath = path.join(__dirname, "..", ".data", dir, file);

    try {
      console.log("updating...");
      let filehandle = await fsPromises.writeFile(readPath, data, {
        encoding: "utf-8",
        flag: "w+",
      });
      resolve(undefined);
      console.log("filehandle", filehandle);
    } catch (error) {
      console.log("Error data update", error);
      reject({ Error: "Error updating file" });
    }
  });
};

lib.delete = (dir, file, data) => {
  return new Promise(async (resolve, reject) => {
    const pathToFile = path.join(__dirname, "..", ".data", dir, file);
    try {
      await fsPromises.unlink(pathToFile);
      resolve();
    } catch (error) {
      console.log("Error data delete", error);
      reject({ Error: "Error deleting file" });
    }
  });
};
module.exports = lib;
