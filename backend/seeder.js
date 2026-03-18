const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: adminPassword, isAdmin: true });

  const cats = await Category.insertMany([
    { name: 'Sparklers' },
    { name: 'Rockets' },
    { name: 'Fountains' }
  ]);

  await Product.insertMany([
    { name: 'Color Sparklers (Pack of 20)', price: 120, stock: 100, category: cats[0]._id },
    { name: 'Sky Rocket Set (5 pcs)', price: 450, stock: 50, category: cats[1]._id },
    { name: 'Golden Fountain (Single)', price: 220, stock: 80, category: cats[2]._id }
  ]);

  console.log('✅ Seeded DB');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
