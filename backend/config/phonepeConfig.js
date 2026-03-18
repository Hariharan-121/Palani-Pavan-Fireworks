const crypto = require('crypto');

const phonepeConfig = {
  merchantId: process.env.PHONEPE_MERCHANT_ID,
  saltKey: process.env.PHONEPE_SALT_KEY,
  saltIndex: process.env.PHONEPE_SALT_INDEX,
  baseUrl: "https://api.phonepe.com/apis/hermes",
};

module.exports = phonepeConfig;
