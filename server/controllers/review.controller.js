const Review = require('../models/Review');
const Product = require('../models/Product');

const createReview = async (req, res) => {
  try {
    const { product: productId, rating, comment } = req.body;
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating: Number(rating),
      comment
    });

    // Update product ratings
    const reviews = await Review.find({ product: productId });
    const count = reviews.length;
    const average = reviews.reduce((acc, item) => item.rating + acc, 0) / count;

    await Product.findByIdAndUpdate(productId, {
      ratings: { average, count }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Only admin or the user who created it can delete
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product ratings
    const reviews = await Review.find({ product: productId });
    const count = reviews.length;
    const average = count > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / count : 0;

    await Product.findByIdAndUpdate(productId, {
      ratings: { average, count }
    });

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getProductReviews, deleteReview };
