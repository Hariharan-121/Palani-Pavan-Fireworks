exports.createPhonePePayment = async (amount) => {
  return {
    transactionId: `PHONEPE_${Date.now()}`,
    status: 'PENDING',
    amount
  };
};

exports.verifyPhonePePayment = async (transactionId) => {
  return {
    transactionId,
    status: 'SUCCESS'
  };
};
