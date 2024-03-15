'use strict';

const multer = require('multer');

const uploadMemory = multer({
  storage: multer.memoryStorage()
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/ekoio/Documents/Projects/TipJS/ecommerce-backend-nodejs/src/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
})


module.exports = {
  uploadMemory,
  uploadDisk
}