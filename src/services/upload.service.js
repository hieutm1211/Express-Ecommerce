'use strict';

const cloudinary = require("../configs/cloudinary.config");
const { s3, PutObjectCommand, GetObjectCommand } = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto');

const uploadImageFromUrl = async () => {
  try {
    const url = 'https://imgix.bustle.com/uploads/image/2023/12/19/f7be9c1f-bc2c-4c0a-b705-c24468fd8314-navia.jpg?w=564&h=564&fit=crop&crop=focalpoint&auto=format%2Ccompress&fp-x=0.487&fp-y=0.545';
    const folder = 'product/shopId';
    const newFileName = 'demo';

    return await cloudinary.uploader.upload(url, {
      folder: folder,
    })
  } catch (error) {
    console.error('Error uploading image::', error);
  }
}

const uploadImageFromLocalS3 = async ({
  file
}) => {
  try {
    const randomName = () => crypto.randomBytes(16).toString('hex');
    const imageName = randomName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: 'image/jpeg'
    })

    const result = await s3.send(command);
    const signedUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });
    const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });

    return url;
  } catch (error) {
    console.error('Error uploading image::', error);
  }
}


const uploadImageFromLocal = async ({
  path,
  folderName = 'genshin/navia'
}) => {
  try {

    const result = await cloudinary.uploader.upload(path, {
      public_id: 'my_fav',
      folder: folderName,
    });

    return {
      image_url: result.secure_url,
      character: folderName,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.error('Error uploading image::', error);
  }
}

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3
}