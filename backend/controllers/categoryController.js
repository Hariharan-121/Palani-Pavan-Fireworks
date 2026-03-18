const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(cat);
};

exports.getCategories = async (req, res) => {
  const list = await Category.find();
  res.json(list);
};

exports.updateCategory = async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
