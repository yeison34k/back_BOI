const { body, validationResult } = require('express-validator');

// Validation rules for creating a beneficial owner
const validateCreateBeneficialOwner = [
  // Personal Information
  body('firstName')
    .notEmpty()
    .withMessage('First Name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First Name must be between 1 and 50 characters')
    .trim()
    .escape(),

  body('middleName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Middle Name cannot exceed 50 characters')
    .trim()
    .escape(),

  body('lastName')
    .notEmpty()
    .withMessage('Last Name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last Name must be between 1 and 50 characters')
    .trim()
    .escape(),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of Birth is required')
    .isISO8601()
    .withMessage('Date of Birth must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        throw new Error('Beneficial owner must be at least 18 years old');
      }
      if (birthDate > today) {
        throw new Error('Date of Birth cannot be in the future');
      }
      return true;
    }),

  // Residence Information
  body('residenceLocation')
    .notEmpty()
    .withMessage('Residence location is required')
    .isIn(['inside', 'outside'])
    .withMessage('Residence location must be either "inside" or "outside"'),

  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('countryOutsideUS')
    .if(body('residenceLocation').equals('outside'))
    .notEmpty()
    .withMessage('Country Outside US is required when residence is outside USA')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country Outside US must be between 2 and 100 characters')
    .trim()
    .escape(),

  // Address Information
  body('street')
    .notEmpty()
    .withMessage('Street address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters')
    .trim()
    .escape(),

  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('stateProvidence')
    .notEmpty()
    .withMessage('State/Providence is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('State/Providence must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('zipPostalCode')
    .notEmpty()
    .withMessage('Zip/Postal Code is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Zip/Postal Code must be between 3 and 20 characters')
    .trim()
    .escape(),

  // Identification Information
  body('identifyingDocumentType')
    .notEmpty()
    .withMessage('Identifying document type is required')
    .isIn(['license', 'id', 'passport', 'other'])
    .withMessage('Document type must be license, id, passport, or other'),

  body('identifyingDocumentNumber')
    .notEmpty()
    .withMessage('Identifying document number is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Document number must be between 3 and 50 characters')
    .trim()
    .escape(),

  body('issuingJurisdiction')
    .notEmpty()
    .withMessage('Country/Jurisdiction is required')
    .trim()
    .escape(),

  body('jurisdictionCountryOutsideUS')
    .if(body('issuingJurisdiction').equals('other'))
    .notEmpty()
    .withMessage('Country Outside US is required when jurisdiction is other')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country Outside US must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('jurisdictionStateProvidence')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State/Providence cannot exceed 100 characters')
    .trim()
    .escape(),

  // Photo ID
  body('photoId')
    .notEmpty()
    .withMessage('Photo ID is required')
    .custom((value) => {
      if (!value || value.length === 0) {
        throw new Error('Photo ID must be provided (License, ID or Passport)');
      }
      // Basic validation for file path or base64 string
      if (typeof value !== 'string') {
        throw new Error('Photo ID must be a valid string');
      }
      return true;
    }),

  // Certification and Authorization
  body('certificationAccepted')
    .notEmpty()
    .withMessage('Certification must be accepted')
    .isBoolean()
    .withMessage('Certification must be a boolean value')
    .custom((value) => {
      if (value !== true) {
        throw new Error('Client must certify that all information is accurate and complete');
      }
      return true;
    }),

  body('serviceTermsAccepted')
    .notEmpty()
    .withMessage('Service terms must be accepted')
    .isBoolean()
    .withMessage('Service terms must be a boolean value')
    .custom((value) => {
      if (value !== true) {
        throw new Error('Client must accept service terms and delivery timeframe');
      }
      return true;
    }),

  body('electronicSignature')
    .notEmpty()
    .withMessage('Electronic signature is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Electronic signature must be between 2 and 100 characters')
    .trim()
    .escape(),

  // Associated Company
  body('reportingCompanyId')
    .notEmpty()
    .withMessage('Associated reporting company is required')
    .isInt({ min: 1 })
    .withMessage('Reporting company ID must be a valid positive integer'),

  // Optional metadata
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Validation rules for updating a beneficial owner
const validateUpdateBeneficialOwner = [
  // Personal Information (optional for updates)
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First Name must be between 1 and 50 characters')
    .trim()
    .escape(),

  body('middleName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Middle Name cannot exceed 50 characters')
    .trim()
    .escape(),

  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last Name must be between 1 and 50 characters')
    .trim()
    .escape(),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of Birth must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
          throw new Error('Beneficial owner must be at least 18 years old');
        }
        if (birthDate > today) {
          throw new Error('Date of Birth cannot be in the future');
        }
      }
      return true;
    }),

  // Residence Information
  body('residenceLocation')
    .optional()
    .isIn(['inside', 'outside'])
    .withMessage('Residence location must be either "inside" or "outside"'),

  body('country')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters')
    .trim()
    .escape(),

  // Address Information
  body('street')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters')
    .trim()
    .escape(),

  body('city')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('stateProvidence')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('State/Providence must be between 2 and 100 characters')
    .trim()
    .escape(),

  body('zipPostalCode')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Zip/Postal Code must be between 3 and 20 characters')
    .trim()
    .escape(),

  // Identification Information
  body('identifyingDocumentType')
    .optional()
    .isIn(['license', 'id', 'passport', 'other'])
    .withMessage('Document type must be license, id, passport, or other'),

  body('identifyingDocumentNumber')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Document number must be between 3 and 50 characters')
    .trim()
    .escape(),

  body('reportingCompanyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Reporting company ID must be a valid positive integer'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errorMessages
    });
  }
  
  next();
};

// Validation for MongoDB ObjectId parameters
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}. Must be a valid positive integer`
      });
    }
    
    next();
  };
};

module.exports = {
  validateCreateBeneficialOwner,
  validateUpdateBeneficialOwner,
  handleValidationErrors,
  validateObjectId
};