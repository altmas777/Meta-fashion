const FeaturedVideo = require('../models/FeaturedVideo');

// Get all active videos (public)
exports.getVideos = async (req, res) => {
  try {
    const videos = await FeaturedVideo.find({ isActive: true }).populate('product');
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all videos (admin)
exports.getAllVideosAdmin = async (req, res) => {
  try {
    const videos = await FeaturedVideo.find().populate('product');
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new video (admin)
exports.createVideo = async (req, res) => {
  try {
    const { title, videoUrl, product, isActive } = req.body;
    
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and Video URL are required' });
    }

    const video = await FeaturedVideo.create({ title, videoUrl, product: product || null, isActive });
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update video status (admin)
exports.updateVideo = async (req, res) => {
  try {
    const video = await FeaturedVideo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete video (admin)
exports.deleteVideo = async (req, res) => {
  try {
    const video = await FeaturedVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
