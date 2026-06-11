const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@store.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new User({
      name: 'Admin',
      email: 'admin@store.com',
      password: 'Admin@123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created: admin@store.com / Admin@123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
