const qrcode = require('qrcode');
const path = require('path');
const jsQR = require('jsqr');
const fs = require('fs');

const Order = require('../models/Order');
const User = require('../models/User');

const orderController = {};
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

orderController.editItemFromBucket = async(req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (user){
      const index = parseInt(req.params.index);

      const updatedObject = req.body;

      if (isNaN(index) || index < 0 || index >= user.bucket.length) {
        return res.status(400).json({ message: 'Invalid index provided' });
      }

      if (!updatedObject || typeof updatedObject !== 'object' || Object.keys(updatedObject).length === 0) {
        return res.status(400).json({ message: 'Invalid update data provided' });
      }
      user.bucket[index] = req.body;
      await user.save();

      res.json({ message: 'Object updated successfully', bucket: user.bucket });
    }else{
      return res.status(400).json({ message: 'Invalid User' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

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
    const qrCodeData = JSON.stringify(order._id); // qr generation
    const qrCodeBuffer = await qrcode.toBuffer(qrCodeData);
    const qrCodeBase64 = qrCodeBuffer.toString('base64'); // Encode the QR code buffer to base64 

    savedOrder.qrCodeData = qrCodeBase64;
    savedOrder.save();
    return res.status(200).json({
      message: 'Order submitted successfully',
      order: savedOrder,
      qrCodeData: qrCodeBase64
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// pending
orderController.cancelOrder = async (req, res) => {

} 

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
