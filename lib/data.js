const fs = require('fs');
const path = require('path');

const lib = {
  create(directory, fileName, dataToAdd, callback) {
    const dataStoragePath = `${__dirname}/../.data/${directory}/${fileName}.json`;
    const writableData = JSON.stringify(dataToAdd);
    const writeFileOptions = {
      encoding: 'utf8',
      flag: 'wx'
    };
    fs.writeFile(dataStoragePath, writableData, writeFileOptions, err => {
      if (err) return callback(new Error(`Failed to create a new file! More information:\n ${err}`));
      callback(null);
    });
  },
  read(directory, fileName, callback) {
    const dataStoragePath = `${__dirname}/../.data/${directory}/${fileName}.json`;
    fs.readFile(dataStoragePath, 'utf8', (err, fileData) => {
      if (err) return callback(new Error(`Failed to read from ${dataStoragePath}! More information:\n ${err}`));
      callback(null, fileData);
    })
  }
}

module.exports = lib;
