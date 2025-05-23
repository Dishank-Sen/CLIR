const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
    trim: true,
  },
  admin: {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    profileImage: { type: String },
  },
  icon: { type: String, required: true },
  clubPassword: { type: String, required: true, select: true },
  institutePermissionDocument: { type: String, required: true },
  institutePermissionPassword: { type: String, required: true, select: false },
  category: {
    type: String,
    enum: ["Technical", "Cultural", "Social", "Branch Specific", "Magazines", "Miscellaneous"],
    required: true
  },
  email: { type: String, required: true, lowercase: true },
}, { timestamps: true });

module.exports = mongoose.model("Club", clubSchema);
