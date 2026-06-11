const User = require('../models/User');

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isWishlisted = user.wishlist.includes(productId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.status(200).json({ success: true, data: user.wishlist, message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { toggleWishlist, getWishlist };
