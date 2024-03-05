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
//pending middleware use
router.post('/submit', orderController.submitOrder);

// Route to mark an order as completed (add authentication)
//pending middleware use
router.put('/complete/:orderId', orderController.markOrderComplete);

// Route to get all pending orders (authentication needed)
router.get('/pending', orderController.getAllPendingOrders);

// Route to get all completed orders (authentication needed)
router.get('/completed', orderController.getAllCompletedOrders);

module.exports = router;
