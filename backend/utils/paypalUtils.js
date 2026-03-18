exports.createPayPalOrder = async (amount) => {
  return {
    id: `PAYPAL_${Date.now()}`,
    status: 'CREATED',
    amount
  };
};

exports.capturePayPalPayment = async (orderId) => {
  return {
    orderId,
    status: 'COMPLETED'
  };
};
