const express = require('express');
const router = express.Router();
const authRoutes = require('./auth'); 
const orderRoutes = require('./order');
const userRoutes = require('./user');
const laundryRoutes = require('./laundry');
const ensureAuthenticated = require('../middlewares/auth');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const user = req.user;

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
router.use('/order', orderRoutes);
router.use('/users', userRoutes);
router.use('/laundry', laundryRoutes);

module.exports = router;
