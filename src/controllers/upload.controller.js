'use strict';

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalS3 } = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: 'Code created',
      metadata: await uploadImageFromUrl(req.body)
    }).send(res);
  }

  uploadFileThumb = async (req, res, next) => {
    if(!req.file) {
      throw new BadRequestError('File missing')
    }

    new SuccessResponse({
      message: 'Code created',
      metadata: await uploadImageFromLocal({
        path: req.file.path
      })
    }).send(res);
  }

  uploadFileFromLocalS3 = async (req, res, next) => {
    if(!req.file) {
      throw new BadRequestError('File missing')
    }

    new SuccessResponse({
      message: 'Code created',
      metadata: await uploadImageFromLocalS3({
        file: req.file
      })
    }).send(res);
  }
}

module.exports = new UploadController();