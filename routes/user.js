const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth'); // Assuming you have an authentication middleware

// Get user profile (requires authentication)
router.get('/me', authMiddleware, userController.getUserProfile);

// Update user profile (requires authentication)
router.put('/me', authMiddleware, userController.updateUserProfile);

module.exports = router;