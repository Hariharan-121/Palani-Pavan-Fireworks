const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "1d" }
    );
};

// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const { name, email, password, mobile, address, city, pincode } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: 'Missing fields. Name, email, password, and mobile are required.' });
        }

        let user = await User.findOne({ email });
        let userByMobile = await User.findOne({ mobile });
        if (user || userByMobile) {
            return res.status(400).json({ message: 'User already exists with this email or mobile' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newAddresses = [];
        if (address) {
            newAddresses.push({ label: 'Home', address, city, pincode, phone: mobile });
        }

        user = await User.create({
            name,
            email,
            password: hashed,
            mobile,
            addresses: newAddresses,
            otpVerified: false   // for OTP flow
        });

        res.status(201).json({
            message: "User registered",
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Optional: check OTP verification
        if (!user.otpVerified) {
            return res.status(400).json({ message: "Please verify OTP first" });
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= PHONE LOGIN =================
exports.phoneLogin = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ message: "Mobile number required" });

        let user = await User.findOne({ mobile });
        if (!user) {
            // Auto register the user
            user = await User.create({
                name: "User " + mobile.slice(-4),
                email: mobile + "@example.com",
                password: "passwordless",
                mobile,
                otpVerified: true
            });
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user),
            user: { id: user._id, name: user.name, mobile: user.mobile, isAdmin: user.isAdmin }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= ADMIN BYPASS =================
exports.adminLogin = async (req, res) => {
    try {
        let admin = await User.findOne({ isAdmin: true });
        if (!admin) {
            admin = await User.create({
                name: "Admin",
                email: "admin@smartcracker.com",
                password: "admin",
                mobile: "0000000000",
                isAdmin: true,
                otpVerified: true
            });
        }
        res.status(200).json({
            message: "Admin Login successful",
            token: generateToken(admin),
            user: { id: admin._id, name: admin.name, isAdmin: admin.isAdmin }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};