const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  displayName: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailPrimary: { type: String, required: true, unique: true },
  emailSecondary: { type: String },
  password: { type: String, required: true },
  address: { type: String, required: true },
  photo: { type: String },
  atLeastEighteen: { type: Boolean, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;