const express = require('express');
const router = express.Router();
const {
  getAllBeneficialOwners,
  getBeneficialOwnerById,
  createBeneficialOwner,
  updateBeneficialOwner,
  deleteBeneficialOwner,
  getBeneficialOwnersByCompany,
  permanentDeleteBeneficialOwner
} = require('../controllers/beneficialOwnerController');

const {
  validateCreateBeneficialOwner,
  validateUpdateBeneficialOwner,
  handleValidationErrors,
  validateObjectId
} = require('../middleware/beneficialOwnerValidation');

router.get('/', getAllBeneficialOwners);

router.get('/:id', 
  validateObjectId('id'),
  getBeneficialOwnerById
);
router.post('/', 
  validateCreateBeneficialOwner,
  handleValidationErrors,
  createBeneficialOwner
);
router.put('/:id', 
  validateObjectId('id'),
  validateUpdateBeneficialOwner,
  handleValidationErrors,
  updateBeneficialOwner
);

router.delete('/:id', 
  validateObjectId('id'),
  deleteBeneficialOwner
);

router.get('/company/:companyId', 
  validateObjectId('companyId'),
  getBeneficialOwnersByCompany
);

router.delete('/:id/permanent', 
  validateObjectId('id'),
  permanentDeleteBeneficialOwner
);

module.exports = router;