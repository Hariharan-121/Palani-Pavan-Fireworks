const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sale = require('./models/Sale');
const FlashDeal = require('./models/FlashDeal');
const Product = require('./models/Product');

dotenv.config();

const seedSale = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-cracker-shop');
    
    // Clear old sales/deals
    await Sale.deleteMany({});
    await FlashDeal.deleteMany({});

    // 1. Create a Festival Sale (Ends in 10 days)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    const sale = await Sale.create({
      title: "🪔 DIWALI MEGA SALE 🪔",
      subtitle: "Biggest Celebration of the Year! Up to 60% OFF!",
      discountPercent: 60,
      startDate: new Date(),
      endDate: endDate,
      bannerColor: '#f8931f',
      isActive: true
    });

    console.log("✅ Diwali Sale Added!");

    // 2. Add Flash Deals to first 2 products
    const products = await Product.find().limit(2);
    if (products.length > 0) {
      for (const p of products) {
        await FlashDeal.create({
          product: p._id,
          originalPrice: p.price,
          salePrice: Math.round(p.price * 0.4), // 60% off
          totalStock: 50,
          soldCount: 38, // 76% sold
          startTime: new Date(),
          endTime: endDate,
          isActive: true
        });
      }
      console.log("✅ Flash Deals Added to Products!");
    } else {
      console.log("⚠️ No products found to add deals to.");
    }

    process.exit();
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedSale();
