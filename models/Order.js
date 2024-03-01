const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      category: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean, // Changed to boolean type
    default: false, // Pending represented by false
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
