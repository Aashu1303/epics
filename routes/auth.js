// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// Local signup route
router.post('/signup', authController.signup);
router.post('/admin-signup', authController.adminSignup);

// Local login route
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
