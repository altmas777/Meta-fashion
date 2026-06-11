const express = require('express');
const router = express.Router();
const { register, login, logout, refresh, getMe } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', verifyToken, getMe);

module.exports = router;
