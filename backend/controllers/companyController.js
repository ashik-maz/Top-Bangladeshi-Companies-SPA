const Company = require('../models/Company');

// Get all companies with search and filter
exports.getCompanies = async (req, res) => {
  try {
    const { search, sector, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sector: { $regex: search, $options: 'i' } },
        { headquarter: { $regex: search, $options: 'i' } }
      ];
    }

    if (sector) {
      filter.sector = { $regex: sector, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const companies = await Company.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(filter);

    res.json({
      success: true,
      data: companies,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new company (Admin only)
exports.createCompany = async (req, res) => {
  try {
    const { name, sector, logo, headquarter, founded, description, website, employees, revenue, ceo, foundedDate } = req.body;

    // Validation
    if (!name || !sector || !headquarter || !founded) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields: name, sector, headquarter, founded' });
    }

    // Convert employees to number if it's a string
    let employeesNum = employees;
    if (typeof employees === 'string') {
      employeesNum = parseInt(employees, 10);
      if (isNaN(employeesNum)) {
        return res.status(400).json({ success: false, message: 'Employees must be a valid number' });
      }
    }

    const company = new Company({
      name,
      sector,
      logo,
      headquarter,
      founded: parseInt(founded, 10),
      description,
      website,
      employees: employeesNum,
      revenue,
      ceo,
      foundedDate
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    console.error('Create company error:', error);
    // Handle duplicate name error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Company name already exists' });
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message || 'Error creating company' });
  }
};

// Update company (Admin only)
exports.updateCompany = async (req, res) => {
  try {
    const { name, sector, logo, headquarter, founded, description, website, employees, revenue, ceo, foundedDate } = req.body;

    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Update fields
    if (name) company.name = name;
    if (sector) company.sector = sector;
    if (logo) company.logo = logo;
    if (headquarter) company.headquarter = headquarter;
    if (founded) company.founded = founded;
    if (description) company.description = description;
    if (website) company.website = website;
    if (employees) company.employees = employees;
    if (revenue) company.revenue = revenue;
    if (ceo) company.ceo = ceo;
    if (foundedDate) company.foundedDate = foundedDate;

    company.updatedAt = new Date();
    await company.save();

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Company name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete company (Admin only)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully',
      data: company
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all sectors (for filtering)
exports.getSectors = async (req, res) => {
  try {
    const sectors = await Company.distinct('sector');
    res.json({ success: true, data: sectors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
