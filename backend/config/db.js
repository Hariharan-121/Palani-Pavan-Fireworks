const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('⚡️ using existing database connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = !!conn.connections[0].readyState;
    console.log('✅ MongoDB Connected:', conn.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Removed process.exit(1) to prevent Vercel 500 FUNCTION_INVOCATION_FAILED Error
  }
};

module.exports = connectDB;
