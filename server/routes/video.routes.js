const express = require('express');
const router = express.Router();
const { getVideos, getAllVideosAdmin, createVideo, updateVideo, deleteVideo } = require('../controllers/video.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.get('/', getVideos); // public route to fetch active videos
router.get('/admin', verifyToken, requireAdmin, getAllVideosAdmin);
router.post('/', verifyToken, requireAdmin, createVideo);
router.put('/:id', verifyToken, requireAdmin, updateVideo);
router.delete('/:id', verifyToken, requireAdmin, deleteVideo);

module.exports = router;
