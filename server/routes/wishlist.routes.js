const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist } = require('../controllers/wishlist.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/toggle/:productId', verifyToken, toggleWishlist);
router.get('/', verifyToken, getWishlist);

module.exports = router;
