const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  clubName: {type: String, required:true},
  secureUrl: [{ type: String, default: null }], // Stores file URL
  downloadUrl: [{ type: String, default: null }], // Stores file URL
  fileDescription: [{ type: String, default: null }], // Description for file
  resourceLink: [{ type: String, default: null }], // Stores external link
  linkDescription: [{ type: String, default: null }], // Description for link
},{timestamps:true});

module.exports = mongoose.model('Resource', resourceSchema);
