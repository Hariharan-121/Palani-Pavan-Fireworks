const Address = require('../models/Address');

exports.addAddress = async (req, res) => {
  const a = await Address.create({ ...req.body, user: req.user._id });
  res.status(201).json(a);
};

exports.getAddresses = async (req, res) => {
  const list = await Address.find({ user: req.user._id });
  res.json(list);
};

// ✅ Update Address
exports.updateAddress = async (req, res) => {
  try {
    const addr = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    addr.label = req.body.label || addr.label;
    addr.address = req.body.address || addr.address;
    addr.city = req.body.city || addr.city;
    addr.state = req.body.state || addr.state;
    addr.pincode = req.body.pincode || addr.pincode;
    addr.phone = req.body.phone || addr.phone;

    const updated = await addr.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// ✅ Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const addr = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address' });
  }
};
