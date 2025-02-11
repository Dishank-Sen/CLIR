const cloudinary = require('cloudinary');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    // Check if the file exists at the provided path
    if (fs.existsSync(filePath)) {
      cloudinary.uploader.upload(filePath, (result, error) => {
        if (error) {
          console.error('Error uploading file:', error);
          reject(error); // Reject the promise in case of an error
        } else {
          resolve(result); // Resolve the promise with the upload result
        }
      });
    } else {
      console.log('File not found at:', filePath);
      reject('File not found'); // Reject the promise if the file doesn't exist
    }
  });
};

module.exports = uploadFile;
