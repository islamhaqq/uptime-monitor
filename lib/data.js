const fs = require('fs');
const path = require('path');

const getDataStoragePath= (directory, fileName) => `${__dirname}/../.data/${directory}/${fileName}.json`;

const dataCRUDOps = {
  // Create data files.
  create(directory, fileName, dataToAdd, callback) {
    const dataStoragePath = getDataStoragePath(directory, fileName);
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
  // Read data files.
  read(directory, fileName, callback) {
    const theFilePath = getDataStoragePath(directory, fileName);
    fs.readFile(theFilePath, 'utf8', (err, fileData) => {
      if (err) return callback(new Error(`Failed to read from ${theFilePath}! More information:\n ${err}`));
      callback(null, fileData);
    })
  },
  // Update data files.
  update(directory, fileName, dataToAdd, callback) {
    const theFilePath = getDataStoragePath(directory, fileName);
    const writeFileOptions = {
      encoding: 'utf8',
      flag: 'r+'
    };
    fs.open(theFilePath, 'r+', (err, fileDescriptor) => {
      if (err || !fileDescriptor) return callback(new Error(`Failed to open the file for updating! More information:\n ${err}`));
      // Get rid of previous data already in the file.
      fs.ftruncate(fileDescriptor, err => {
        if (err) return callback(new Error(`Failed to truncate file while updating! More information:\n ${err}`));
        // Add the new data.
        const writableData = JSON.stringify(dataToAdd);
        fs.writeFile(fileDescriptor, writableData, err => {
          if (err) return callback(new Error(`Failed to update file! More information:\n ${err}`));
          callback(null);
        });
      })
    });
  },
  // Delete a data file.
  delete(directory, fileName, callback) {
    const theFilePath = getDataStoragePath(directory, fileName);
    fs.unlink(theFilePath, err => {
      if (err) return callback(new Error(`Failed to delete file! More information:\n ${err}`));
      callback(null);
    });
  }
}

module.exports = dataCRUDOps;
