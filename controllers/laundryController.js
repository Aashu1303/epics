const qrcode = require('qrcode');
const path = require('path');
const jsQR = require('jsqr');
const fs = require('fs');
const Order = require('../models/Order');
const User = require('../models/User');
const Admin = require('../models/Admin');

const laundryController = {};

laundryController.updateRate = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({message:"No user found"});
    }
    admin.categories = req.body;
    await admin.save();
    return res.status(200).json({ category: admin.categories, message: "new category added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = laundryController;
