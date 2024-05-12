const qrcode = require('qrcode');
const path = require('path');
const jsQR = require('jsqr');
const fs = require('fs');
const Order = require('../models/Order');
const User = require('../models/User');
const Admin = require('../models/Admin');

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

    user.orders.push(order._id);
    user.bucket = [];
    user.save();

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

orderController.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).json({message:"User doesn't exist"});

    const orderId = req.params.orderId;
    if (!orderId) return res.status(400).json({message:"Order doesn't exist"});

    const order = await Order.findOne({
      orderId,
      userId,
      status: "on-hold",
    });

    if (!order) {
      return res.status(404).json({ message: "Order can't be cancelled" });
    }

    await Order.findByIdAndDelete(order.id);

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

orderController.markOrderComplete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const admin = await User.findById(userId);
    const orderId = req.params.orderId;

    if (!admin) return res.status(404).json({message:"No admin found"});

    if(admin.role !== "admin") return res.status(404).json({message: "No admin access for this operation"});

    const order = await Order.findByIdAndUpdate(
      orderId,
      { service: "completed" },
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order served' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// look for improvements
orderController.acceptRejectOrder = async (req, res) => {
  async function rejectOrder(orderId, res) {
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      const user = await User.findById(deletedOrder.userId);
      if (user) {
        user.orders = user.orders.filter(id => id.toString() !== orderId);
        await user.save();
        console.log('User updated and associated order removed:', user);
      } else {
        console.log('User not found');
      }
  
      return res.status(200).json({ message: "Order rejected" });
    } catch (error) {
      console.error('Error deleting order or finding user:', error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  async function acceptOrder(orderId) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: { status: "accepted" } },
        { new: true }
      );
  
      if (updatedOrder) {
        return res.status(200).json({ message: "Order status updated successfully" });
      } else {
        return res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  try {
    const adminId = req.user.userId;
    const admin = await Admin.findById(adminId);
    
    const orderId = req.params.orderId;
    const orderStatus = req.params.orderStatus;

    if (orderStatus === "accept" || orderStatus === "reject"){
      if (admin) {
        if (orderStatus === "reject") {
          await rejectOrder(orderId, res);
        } else {
          await acceptOrder(orderId, res);
        }
      }else{
        return res.status(404).json({ error: "Admin not found" });
      }
    }else{
      return res.status(400).json({ error: "Invalid Status" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

//pending
orderController.getAllPendingOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const admin = await Admin.findById(userId);
    const user = await User.findById(userId);

    if (!admin || !user) {
      return res.status(404).json({message:"No user found"});
    }
    if (admin) {
      const pendingOrders = await Order.find({ service: "pending" }); 
      return res.json(pendingOrders);
    }
    const pendingOrders = await Order.find({ userId , service: "pending" });
    return res.json(pendingOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// pending
orderController.getAllCompletedOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const admin = await Admin.findById(userId);
    const user = await User.findById(userId);

    if (!admin || !user) {
      return res.status(404).json({message:"No user found"});
    }
    if (admin) {
      const pendingOrders = await Order.find({ service: "completed" }); 
      return res.json(pendingOrders);
    }
    const pendingOrders = await Order.find({ userId , service: "completed" });
    return res.json(pendingOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = orderController;
