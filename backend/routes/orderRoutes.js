const express = require('express');

const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

const {
    createOrder,
    myorders,
    getOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController.js');

const router = express.Router();

router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getOrders);

router.route('/myorders')
    .get(protect, myorders);

router.route('/allorders')
    .get(protect, admin, getOrders);

router.route('/:id/status')
    .get(protect, getOrderById)
    .put(protect, admin, updateOrderStatus);

module.exports = router;