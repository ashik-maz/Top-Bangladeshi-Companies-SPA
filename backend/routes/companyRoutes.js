const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/auth');

// Public routes
// GET /api/companies - Get all companies with pagination and search
router.get('/', companyController.getCompanies);

// GET /api/companies/sectors - Get all sectors
router.get('/sectors', companyController.getSectors);

// GET /api/companies/:id - Get single company
router.get('/:id', companyController.getCompanyById);

// Protected routes (Admin only)
// POST /api/companies - Create new company
router.post('/', authMiddleware, companyController.createCompany);

// PUT /api/companies/:id - Update company
router.put('/:id', authMiddleware, companyController.updateCompany);

// DELETE /api/companies/:id - Delete company
router.delete('/:id', authMiddleware, companyController.deleteCompany);

module.exports = router;
