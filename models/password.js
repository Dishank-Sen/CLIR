const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  clubEmail: { type: String, required: true},
  password: { type: String, required: true }
});

module.exports = mongoose.model('Password', passwordSchema);
