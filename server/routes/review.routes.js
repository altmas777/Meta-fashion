const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, deleteReview } = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, createReview);
router.get('/product/:id', getProductReviews);
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;
