const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex(i => i.product.toString() === productId);
  if (idx >= 0) cart.items[idx].qty += qty;
  else cart.items.push({ product: productId, qty });

  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};
