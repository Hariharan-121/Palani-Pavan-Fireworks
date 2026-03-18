const { sendEmail } = require('./sendEmail');

exports.sendOTPEmail = async (email, otp) => {
  const subject = 'Your OTP for Smart Cracker Shop';
  const text = `Your OTP is ${otp}. It is valid for 10 minutes.`;
  await sendEmail({ to: email, subject, text });
};
