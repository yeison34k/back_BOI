const express = require('express');
const router = express.Router();
const {
  createReportingCompany,
  getAllReportingCompanies,
  getReportingCompanyById,
  updateReportingCompany,
  deleteReportingCompany
} = require('../controllers/reportingCompanyController');
const { validateReportingCompany } = require('../middleware/validation');

router.post('/', validateReportingCompany, createReportingCompany);
router.get('/', getAllReportingCompanies);
router.get('/:id', getReportingCompanyById);
router.put('/:id', validateReportingCompany, updateReportingCompany);
router.delete('/:id', deleteReportingCompany);

module.exports = router;