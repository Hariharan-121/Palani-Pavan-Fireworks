exports.createGPayPayment = async (amount) => {
  return {
    transactionId: `GPAY_${Date.now()}`,
    status: 'PENDING',
    amount
  };
};

exports.verifyGPayPayment = async (transactionId) => {
  return {
    transactionId,
    status: 'SUCCESS'
  };
};
