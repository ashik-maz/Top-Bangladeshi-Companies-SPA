require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const DB_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TopBangladeshiCompaniesDB';
mongoose.connect(DB_URL)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => console.error('❌ Connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});