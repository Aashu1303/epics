const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middlewares/auth'); // Assuming you have an authentication middleware

router.get('/me', ensureAuthenticated, userController.getUserProfile);

router.put('/me', ensureAuthenticated, userController.updateUserProfile);

module.exports = router;
