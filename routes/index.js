const express = require('express');
const router = express.Router();
const authRoutes = require('./auth'); // Assuming auth.js is in the same folder
const orderRoutes = require('./order'); // Import the order route
const userRoutes = require('./user'); // Import the user route
const ensureAuthenticated = require('../middlewares/auth');

// Dashboard route (requires authentication)
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  // Access user information from the session
  const user = req.user;

  // Assuming you have added firstName and lastName to your User schema
  const responseData = {
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  res.json(responseData);
});

// Home route
router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Include authentication routes
router.use('/auth', authRoutes);
router.use('/order',ensureAuthenticated, orderRoutes);
router.use('/users', ensureAuthenticated,userRoutes);

module.exports = router;
