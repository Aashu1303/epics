const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const ensureAuthenticated = require('../middlewares/auth');

router.put('/add-to-bucket', ensureAuthenticated, orderController.addToBucket);
router.put('/remove-bucket-item/:index', ensureAuthenticated, orderController.removeFromBucket);
router.get('/fetch-bucket', ensureAuthenticated, orderController.fetchBucket);
router.put('/edit-bucket-item/:index', ensureAuthenticated, orderController.editItemFromBucket);

router.post('/submit', ensureAuthenticated, orderController.submitOrder);
router.post('/cancel', ensureAuthenticated, orderController.cancelOrder);

router.put('/complete/:orderId', ensureAuthenticated, orderController.markOrderComplete);

router.get('/pending', ensureAuthenticated, orderController.getAllPendingOrders);

router.get('/completed', ensureAuthenticated, orderController.getAllCompletedOrders);

module.exports = router;
