const fs = require('fs');
const path = require('path');

const lib = {
  createFile(directory, fileName, dataToAdd, callback) {
    const dataStoragePath = `${__dirname}/../.data/${directory}/${fileName}.json`;
    const writableData = JSON.stringify(dataToAdd);
    const writeFileOptions = {
      encoding: 'utf8',
      flag: 'wx'
    };
    fs.writeFile(dataStoragePath, writableData, writeFileOptions, err => {
      if (err) return callback(new Error(`Failed to create a new file! More information:\n ${err}`));
    });
  }
}

module.exports = lib;
