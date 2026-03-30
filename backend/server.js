const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// ✅ Load Environment Variables
dotenv.config();

// ✅ Connect MongoDB
connectDB();

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));   // LOGIN / REGISTER
app.use('/api/otp', require('./routes/otp'));     // 🔢 OTP ROUTES
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/address', require('./routes/address'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/admin', require('./routes/admin'));

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ Smart Cracker Shop API is running...');
});

// ✅ Global Error Middleware
app.use(require('./middleware/error'));

// ✅ Start Server (For Local and Render)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
}

// ✅ Export for Vercel
module.exports = app;