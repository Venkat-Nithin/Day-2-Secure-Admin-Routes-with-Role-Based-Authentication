const mongoose = require('mongoose');

// User schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});
module.exports = mongoose.model('User', UserSchema);