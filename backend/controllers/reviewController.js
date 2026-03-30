const Review = require('../models/Review');
const Product = require('../models/Product');

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if(existing) return res.status(400).json({ message: "Already reviewed" });

    const review = await Review.create({ 
      user: req.user._id, 
      product: productId, 
      rating, 
      comment 
    });

    // Update Product Rating
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: numReviews
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  const list = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(list);
};

