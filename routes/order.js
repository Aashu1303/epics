const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const ensureAuthenticated = require('../middlewares/auth');

// Route to submit a new order
router.put('/add-to-bucket', ensureAuthenticated, orderController.addToBucket);
router.delete('/remove-from-bucket/:index', ensureAuthenticated, orderController.removeFromBucket);

router.post('/submit', ensureAuthenticated, orderController.submitOrder);

// Route to mark an order as completed (add authentication)
router.put('/complete/:orderId', ensureAuthenticated, orderController.markOrderComplete);

// Route to get all pending orders (authentication needed)
router.get('/pending', ensureAuthenticated, orderController.getAllPendingOrders);

// Route to get all completed orders (authentication needed)
router.get('/completed', ensureAuthenticated, orderController.getAllCompletedOrders);

module.exports = router;
