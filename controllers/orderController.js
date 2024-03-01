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
    // Assuming the authenticated user's ID is available in req.user
    // const userId = req.user._id;
    const userId = "65e1dbd294439f55c0db900b";
    // Process the order data and save it to the database
    const order = new Order({
      userId,
      items: orderItems,
    });
    
    await order.save();
    await User.findByIdAndUpdate(userId, { $push: { orders: order } });
    // Process the order data as needed (you can save it to the database, etc.)

    const timestamp = Date.now();

    // Generate a QR code with the order payload
    const qrCodeData = JSON.stringify(orderItems);
    const qrCodePath = path.join(__dirname, `../public/qrcodes/order_${timestamp}.png`);

    await qrcode.toFile(qrCodePath, qrCodeData);

    // Send a response indicating that the order was successfully submitted
    res.json({ message: 'Order submitted successfully', qrCodePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
  
orderController.markOrderComplete = async (req, res) => {
  try {
    const orderId = req.params.orderId; // Assuming order ID is in URL parameter

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
