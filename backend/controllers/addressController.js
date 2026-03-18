const Address = require('../models/Address');

exports.addAddress = async (req, res) => {
  const a = await Address.create({ ...req.body, user: req.user._id });
  res.status(201).json(a);
};

exports.getAddresses = async (req, res) => {
  const list = await Address.find({ user: req.user._id });
  res.json(list);
};
