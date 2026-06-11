const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserRole, deleteUser } = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.get('/', verifyToken, requireAdmin, getAllUsers);
router.put('/:id/role', verifyToken, requireAdmin, toggleUserRole);
router.delete('/:id', verifyToken, requireAdmin, deleteUser);

module.exports = router;
