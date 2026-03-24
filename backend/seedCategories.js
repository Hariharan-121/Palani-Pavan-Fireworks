const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  { name: 'Nattu Vedi', description: 'Traditional local fireworks' },
  { name: 'Sivakasi Crackers', description: 'Quality crackers from Sivakasi' },
  { name: 'Giftbox', description: 'Special festive gift boxes' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories.");

    // Insert new categories
    await Category.insertMany(categories);
    console.log("Successfully seeded 3 categories!");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
