const { createPayment } = require('../utils/paymentGateway');

// create payment session/order depending on provider
exports.create = async (req, res) => {
  const { method, amount, orderId } = req.body;
  // call common util; replace util implementation with SDK calls in production
  const result = await createPayment({ method, amount, orderId });
  res.json(result);
};
