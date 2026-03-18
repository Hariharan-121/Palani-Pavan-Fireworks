// This file centralizes payment gateway calls. Replace stubs with real SDK usage.
exports.createPayment = async ({ method, amount, orderId }) => {
  // method: 'razorpay','stripe','paypal','gpay','phonepe','cod'
  // For each method, call respective SDK and return gateway response object.
  return { provider: method, amount, orderId, status: method === 'cod' ? 'pending' : 'created' };
};
