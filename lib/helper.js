'use strict'

const fs = require('fs')

const directoryExists = (filePath) => {
  try {
    return fs.statSync(filePath).isDirectory()
  } catch (err) {
    return false
  }
}

module.exports = { directoryExists }
