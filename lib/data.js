/*
 * Library for storing and editing data
 */

// Dependencies

const fs = require("fs");
const path = require("path");
// const os = require('os')
const fsPromises = require("fs").promises;

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

  console.log("path +++++++++++++", workingPath);
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
    console.log("___++$$%%$", error);
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
      resolve(readResult);
      return;
    } catch (error) {
      console.error(error);
      reject(error);
      return;
    }
  });
};

// function to update contents of file
lib.update = (dir, file, data) => {
  const readPath = path.join(__dirname, "..", ".data", dir, file);
  try {
    const filehandle = fsPromises.appendFile(readPath, data);
  } catch (error) {}
};

module.exports = lib;
