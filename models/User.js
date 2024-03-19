const mongoose = require('mongoose');
const Order = require('./Order');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  google: {
    id: String,
    name: String,
    email: String,
  },
  bucket: [],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
  }], 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
