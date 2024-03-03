// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// Google OAuth login
router.get('/google', authController.googleLogin);

// Google OAuth callback
router.get('/google/callback', authController.googleCallback, authController.signupWithGoogle);

// Local signup route
router.post('/signup', authController.signup);

// Local login route
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
