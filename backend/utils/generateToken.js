const jwt = require('jsonwebtoken');
module.exports = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
