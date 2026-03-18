const Wishlist = require('../models/Wishlist');

// ✅ GET Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id }).populate('product');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

// ✅ ADD to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.create({
      user: req.user._id,
      product: req.body.productId
    });

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

// ✅ DELETE from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete from wishlist' });
  }
};
