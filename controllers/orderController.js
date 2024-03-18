const qrcode = require('qrcode');
const path = require('path');
const jsQR = require('jsqr');
const fs = require('fs');

const Order = require('../models/Order');
const User = require('../models/User');

const orderController = {};

orderController.submitOrder = async (req, res) => {
  try {
    const orderItems = req.body;
    const userId = req.user;
    // Process the order data and save it to the database
    const order = new Order({
      userId,
      items: orderItems,
    });
    const savedOrder = await order.save();
    // Generate the QR code data (assuming you have already encoded the order items)
    const qrCodeData = JSON.stringify(orderItems);

    // Generate the QR code image in memory
    const qrCodeBuffer = await qrcode.toBuffer(qrCodeData);

    // Encode the QR code buffer to base64 string
    const qrCodeBase64 = qrCodeBuffer.toString('base64');

    // Update the order document with the base64 encoded QR code data
    const updatedOrder = await Order.findByIdAndUpdate(
      savedOrder._id,
      { $set: { qrCodeData: qrCodeBase64 } }, // Update the 'qrCodeData' field
      { new: true } // Return the updated document
    );
    return res.json({
      message: 'Order submitted successfully',
      orderDetails: updatedOrder,
      qrCodeData: qrCodeBase64,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

orderController.markOrderComplete = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Validate order ID (optional)
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: true }, // Update status to true (assuming boolean)
      { new: true } // Return the updated order document
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update user data or perform other actions if needed (optional)

    res.json({ message: 'Order marked as completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

orderController.getAllPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: false }); // Assuming boolean status
    res.json(pendingOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

orderController.getAllCompletedOrders = async (req, res) => {
  try {
    const completedOrders = await Order.find({ status: true }); // Assuming boolean status
    res.json(completedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = orderController;
