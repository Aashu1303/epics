const mongoose = require('mongoose');

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
    required: true,
  },
  contact: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian phone number!`
    },
    required: true,
  },
  bucket: [],
  bucketAmount: {
    type: Number,
    default: 0
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
  }], 
  room: {
    type: Number,
    required: true,
  },
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
