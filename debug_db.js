const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: 'e:/smart-cracker-shop/backend/.env' });
const User = require('e:/smart-cracker-shop/backend/models/User');

async function checkUser() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');
        
        const emailToFind = 'syedirfaan518@gmail.com';
        const user = await User.findOne({ email: emailToFind });
        console.log(`Searching for: ${emailToFind}`);
        console.log('User found:', user ? { _id: user._id, email: user.email, mobile: user.mobile, otp: user.otp, otpVerified: user.otpVerified } : 'NOT FOUND');
        
        const allUsers = await User.find({}, 'email mobile otp otpVerified').sort({ createdAt: -1 }).limit(10);
        console.log('Recent 10 Users:', JSON.stringify(allUsers, null, 2));

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error details:', err);
        process.exit(1);
    }
}

checkUser();
