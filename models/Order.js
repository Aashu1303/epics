const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [
      {
        type: {
          type: String,
          required: true,
        },
        washType: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  service: {
    type: String,
    enum:["pending", "completed"], 
    default: "pending"
  },
  status: {
    type: String,
    enum:["accepted", "on-hold", "rejected"],
    default: "on-hold"
  },
  amount: {
    type: Number,
    default: 0,
  },
  qrCodeData: {
    type: String,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
