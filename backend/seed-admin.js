const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TopBangladeshiCompaniesDB');
    console.log('Connected to MongoDB - TopBangladeshiCompaniesDB');

    // Check if PUST admin already exists
    const existingAdmin = await Admin.findOne({ username: 'PUST' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user PUST already exists!');
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log('If you want to reset the password, delete this admin from database and run this script again.');
      await mongoose.connection.close();
      return;
    }

    // Create default admin user
    const adminUser = new Admin({
      username: 'PUST',
      password: '123456',
      email: 'admin@bangladeshi-companies.com',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('LOGIN CREDENTIALS:');
    console.log('─────────────────────────────────');
    console.log('Username: PUST');
    console.log('Password: 123456');
    console.log('Email: admin@bangladeshi-companies.com');
    console.log('─────────────────────────────────');
    console.log('');
    console.log('⚠️  IMPORTANT: Change password after first login!');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
