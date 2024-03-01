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
  
module.exports = orderController;
