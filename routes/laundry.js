const express = require('express');
const router = express.Router();
const laundryController = require('../controllers/laundryController');
const ensureAuthenticated = require('../middlewares/auth');
const categories = require('../utils/categories')

// for admin access
router.put('/update-rate', ensureAuthenticated, laundryController.updateRate);
router.get('/get-rate', ensureAuthenticated, (req, res) => {
    return res.status(200).json(categories);
});

module.exports = router;
