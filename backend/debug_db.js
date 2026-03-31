const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const User = require('./models/User');

async function checkUser() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const admins = await User.find({ isAdmin: true });
        console.log('Admins found:', admins.map(a => ({ email: a.email, mobile: a.mobile, isAdmin: a.isAdmin })));

        const allUsers = await User.find({}, 'email mobile otp otpVerified isAdmin').sort({ createdAt: -1 }).limit(10);
        console.log('Recent 10 Users:', JSON.stringify(allUsers, null, 2));

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error details:', err);
        if (err.message && err.message.includes('module')) {
            console.log('Current Cwd node_modules check:', require('fs').existsSync('./node_modules') ? 'exists' : 'missing');
        }
        process.exit(1);
    }
}

checkUser();
