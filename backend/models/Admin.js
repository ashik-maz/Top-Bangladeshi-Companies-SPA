const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false // Don't return password by default
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [/^[\w\.-]+@[\w\.-]+\.\w+$/, 'Please provide valid email']
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
