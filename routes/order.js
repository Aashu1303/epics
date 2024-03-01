const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const ensureAuthenticated = (req, res, next) => {
    console.log(req.headers.Authorization);
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, continue to the next middleware
    }
    // Redirect to login page if not authenticated
    res.redirect('/auth/login');
};

// Route to submit a new order
//have to allow authenticates user only to make an order
//pending
router.post('/submit', orderController.submitOrder);

module.exports = router;
