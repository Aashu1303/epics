const qrcode = require('qrcode');
const path = require('path');
const jsQR = require('jsqr');
const fs = require('fs');

const Order = require('../models/Order');
const User = require('../models/User');

const orderController = {};
// green light
orderController.addToBucket = async(req, res) => {
  try {
    const userId = req.user.userId;
    const newItems = req.body;
    const user = await User.findById(userId);
    
    for (const newItem of newItems) {
      user.bucket.push(newItem);
    }
    await user.save()
    res.status(200).json(user.bucket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// green light
orderController.removeFromBucket = async(req, res) => {
  try {
    const userId = req.user.userId;

    const index = parseInt(req.params.index);
    if (isNaN(index)) {
      return res.status(400).json({ message: 'Invalid index provided' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (index < 0 || index >= user.bucket.length) {
      return res.status(400).json({ message: 'Invalid index. Out of bounds.' });
    }

    user.bucket.splice(index, 1);

    await user.save()

    res.status(200).json(user.bucket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// green light
orderController.fetchBucket = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    res.status(200).json(user.bucket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


orderController.submitOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const orderItems = user.bucket;

    const order = new Order({
      userId,
      items: orderItems,
    });
    const savedOrder = await order.save();

    const qrCodeData = JSON.stringify(orderItems); // qr generation
    const qrCodeBuffer = await qrcode.toBuffer(qrCodeData);
    const qrCodeBase64 = qrCodeBuffer.toString('base64'); // Encode the QR code buffer to base64 

    const updatedOrder = await Order.findByIdAndUpdate(
      savedOrder._id,
      { $set: { qrCodeData: qrCodeBase64 } }, // Update the 'qrCodeData' field
      { new: true } // Return the updated document
    );
    
    return res.status(200).json({
      message: 'Order submitted successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

orderController.markOrderComplete = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: true },
      { new: true } 
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }


    res.status(200).json({ message: 'Order marked as completed successfully' });
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
