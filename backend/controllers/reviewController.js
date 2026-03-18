const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const r = await Review.create({ ...req.body, user: req.user._id });
  res.status(201).json(r);
};

exports.getProductReviews = async (req, res) => {
  const list = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(list);
};
