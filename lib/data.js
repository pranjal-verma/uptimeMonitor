/*
* Library for storing and editing data
*/

// Dependencies

const fs = require('fs');
const path = require('path')
const os = require('os')
const fsPromises = require('fs/promises')

const lib = {}
//Define basedir for lib i.e .data in root folder
lib.baseDir = path.join(__dirname, '/../.data')

// write data to file
lib.create = async (dir, file, data) => {
  
  // Open file for writing
  let filehandle;
  let workingPath;
  // for windows
  // if(os.platform() === 'win32') workingPath = path.join(__dirname, '\\..\\', '.\\', '.data', dir, file + '.json')
   workingPath = path.join(__dirname,'..', '.data', dir, file +  '.json')
  try {
    
    filehandle = await fsPromises.open(workingPath, 'wx');
    const stringifiedData = JSON.stringify(data);
    filehandle.write(stringifiedData)

  } catch (error) {
    
  } finally {
    await filehandle?.close()
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
}

// function to read contents of a file
lib.read = async (dir, file) => {
  
  let readPath = path.join(__dirname, '..', '.data', dir, file + '.json');
  // if(os.platform() === 'win32') readPath = path.join(__dirname, '\\..\\', '.\\', '.data', dir, file + '.json')

  try {
    const readResult = await fsPromises.readFile(readPath)
    console.log(readResult)
  } catch (error) {
    console.error(error)
  }finally{
    readResult.close()
  }
}

// function to update contents of file
lib.update = (dir, file, data) => {
  const readPath = path.join(__dirname, '..', '.data', dir, file)
  try {
    const filehandle = fsPromises.appendFile(readPath, data)
  } catch (error) {
    
  }
}

module.exports = lib