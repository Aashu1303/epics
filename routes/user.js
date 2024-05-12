const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middlewares/auth');

router.get('/user-profile', ensureAuthenticated, userController.getUserProfile);
router.get('/admin-profile', ensureAuthenticated, userController.getAdminProfile);

router.get('/update-user', ensureAuthenticated, userController.updateUserProfile);
router.get('/update-admin', ensureAuthenticated, userController.updateAdminProfile);

module.exports = router;
