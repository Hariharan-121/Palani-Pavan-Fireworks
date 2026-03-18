const axios = require('axios');

const sendSMS = async (phone, message) => {
  try {
    await axios.post(
      process.env.SMS_API_URL,
      {
        route: 'otp',
        numbers: phone,
        message: message,
      },
      {
        headers: {
          authorization: process.env.SMS_API_KEY,
        },
      }
    );

    console.log('✅ SMS Sent Successfully');
  } catch (error) {
    console.error('❌ SMS Error:', error.message);
  }
};

module.exports = sendSMS;
