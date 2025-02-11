const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config(); // Ensure environment variables are loaded

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found at: ' + filePath);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: 'uploads',
      use_filename: true,
      unique_filename: false,
      flags: 'attachment', // Forces download
      format: 'pdf', // Ensures it's a PDF file
    });

    console.log('File uploaded successfully:', result.secure_url);
    return result; // Return the Cloudinary upload response

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Throw error to be caught by calling function
  }
};

module.exports = uploadFile;
