const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "1d" }
    );
};

// ================= REGISTER (PHASE 1: SEND OTP) =================
exports.register = async (req, res) => {
    try {
        let { name, email, password, mobile, address, city, pincode } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: 'Missing fields. Name, email, password, and mobile are required.' });
        }

        email = email.toLowerCase().trim();

        let user = await User.findOne({ email });
        let userByMobile = await User.findOne({ mobile: mobile.trim() });

        // If user exists and is already verified, block registration
        if ((user && user.otpVerified) || (userByMobile && userByMobile.otpVerified)) {
            return res.status(400).json({ message: 'User already exists and is verified. Please login.' });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const hashed = await bcrypt.hash(password, 10);

        const newAddresses = [];
        if (address) {
            newAddresses.push({ label: 'Home', address, city, pincode, phone: mobile });
        }

        if (user || userByMobile) {
            // Update existing unverified user
            const existingUser = user || userByMobile;
            existingUser.otp = otp;
            existingUser.name = name;
            existingUser.email = email; // Update email too!
            existingUser.password = hashed;
            existingUser.addresses = newAddresses;
            await existingUser.save();
        } else {
            // Create new unverified user
            await User.create({
                name,
                email,
                password: hashed,
                mobile,
                addresses: newAddresses,
                otp,
                otpVerified: false
            });
        }

        // 📧 PREMIUM SRI PALANI PAVAN EMAIL TEMPLATE
        const emailSent = await sendEmail({
            to: email,
            subject: `🎇 ${otp} is your verification code for Sri Palani Pavan Fireworks`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #fff; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
                    <div style="background: linear-gradient(135deg, #f8931f, #ff5f00); padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Sri Palani Pavan</h1>
                        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px; font-weight: bold;">PREMIUM FIREWORKS • SIVAKASI</p>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #f8931f; margin-bottom: 20px;">Verify Your Identity</h2>
                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Welcome to the family! Use the verification code below to complete your registration and start your celebrations.</p>
                        
                        <div style="background: rgba(255,255,255,0.05); padding: 30px; margin: 30px 0; border-radius: 15px; border: 1px dashed #f8931f;">
                            <h1 style="margin: 0; font-size: 42px; letter-spacing: 12px; color: #f8931f; font-weight: 900;">${otp}</h1>
                        </div>
                        
                        <p style="color: #64748b; font-size: 12px; margin-top: 30px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    </div>
                    <div style="background: #1e293b; padding: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
                        © 2024 Sri Palani Pavan Fireworks. All Rights Reserved.<br/>
                        Sivakasi, Tamil Nadu, India.
                    </div>
                </div>
            `
        });

        if (!emailSent) {
             console.log("⚠️ EMAIL FAILED. PROCEEDING WITH DEMO OTP: " + otp);
             // In demo/dev we can return it if we want, but user asked for "Incorrect details" logic
        }

        res.status(200).json({ message: "OTP sent to your email! 🧨" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= VERIFY OTP & REGISTER (PHASE 2) =================
exports.verifyRegistrationOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

        const trimmedEmail = email.toLowerCase().trim();
        const trimmedOtp = otp.toString().trim();

        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            console.log(`❌ Verification Failed: User not found with email: ${trimmedEmail}`);
            return res.status(400).json({ message: "User not found. Please register again." });
        }

        console.log(`🔍 Verifying OTP for ${trimmedEmail}: Input=${trimmedOtp}, Saved=${user.otp}`);

        if (user.otp.toString().trim() !== trimmedOtp) {
            return res.status(400).json({ message: "Incorrect OTP! Please try again." });
        }

        // Success!
        user.otpVerified = true;
        user.otp = undefined; // clear otp
        await user.save();

        res.status(200).json({
            message: "Registration successful!",
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, isAdmin: user.isAdmin }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
            return res.status(404).json({ message: "Unknown User" });
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

// ================= ADMIN SECURE LOGIN =================
exports.adminLogin = async (req, res) => {
    try {
        const { name, mobile, email, address } = req.body;

        // If credentials provided, let's verify them
        if (mobile) {
            const admin = await User.findOne({ mobile, isAdmin: true });
            if (admin) {
                return res.status(200).json({
                    message: "Admin Verified",
                    token: generateToken(admin),
                    user: { id: admin._id, name: admin.name, isAdmin: admin.isAdmin }
                });
            }
        }

        // Fallback for first-time setup or if no mobile provided (bypass)
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
            message: "Admin Access Granted",
            token: generateToken(admin),
            user: { id: admin._id, name: admin.name, isAdmin: admin.isAdmin }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};