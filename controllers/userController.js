const User = require('../models/User');
const Admin = require('../models/Admin');

const userController = {};

userController.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.password = undefined;
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

userController.getAdminProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }
    admin.password = undefined;
    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

userController.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }); 
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    updatedUser.password = undefined;
    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

userController.updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const updates = req.body;

    const updatedUser = await Admin.findByIdAndUpdate(userId, updates, { new: true }); 
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    updatedUser.password = undefined;
    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = userController;
