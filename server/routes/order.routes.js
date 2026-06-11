const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/', verifyToken, requireAdmin, getAllOrders);
router.put('/:id/status', verifyToken, requireAdmin, updateOrderStatus);

module.exports = router;
