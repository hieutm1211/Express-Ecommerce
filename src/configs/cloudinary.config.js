// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: 'dxoi4fny2',
  api_key: '446586836788672',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log the configuration
module.exports = cloudinary;