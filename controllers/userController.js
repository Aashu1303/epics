const User = require('../models/User');

const userController = {};

userController.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is accessible from the middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      username: user.username,
      email: user.email,
    };

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

userController.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is accessible from the middleware
    const updates = req.body;

    // Validate user input (implement validation logic based on allowed updates)

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }); // Returns the updated document
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Select specific user information to expose (e.g., exclude password)
    const updatedProfile = {
      username: updatedUser.username,
      email: updatedUser.email,
      // Add other relevant user profile details
    };

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = userController;
