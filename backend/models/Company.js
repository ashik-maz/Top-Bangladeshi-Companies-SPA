const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a company name'],
    unique: true,
    trim: true,
    maxlength: 100
  },
  sector: {
    type: String,
    required: [true, 'Please provide a sector'],
    trim: true
  },
  logo: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  headquarter: {
    type: String,
    required: [true, 'Please provide headquarter location'],
    trim: true
  },
  founded: {
    type: Number,
    required: [true, 'Please provide founding year']
  },
  foundedDate: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  employees: {
    type: Number,
    default: 0
  },
  revenue: {
    type: String,
    default: ''
  },
  ceo: {
    type: String,
    default: ''
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

module.exports = mongoose.model('Company', CompanySchema);
