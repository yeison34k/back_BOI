const { body } = require('express-validator');

exports.validateReportingCompany = [
  body('companyLegalName')
    .notEmpty()
    .withMessage('El nombre legal de la empresa es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres')
    .trim(),
    
  body('alternateName')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El nombre alternativo no puede exceder 255 caracteres')
    .trim(),
    
  body('companyPhone')
    .notEmpty()
    .withMessage('El teléfono de la empresa es requerido')
    .matches(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/)
    .withMessage('Formato de teléfono inválido')
    .trim(),
    
  body('address.street')
    .notEmpty()
    .withMessage('La dirección es requerida')
    .isLength({ min: 5, max: 255 })
    .withMessage('La dirección debe tener entre 5 y 255 caracteres')
    .trim(),
    
  body('address.city')
    .notEmpty()
    .withMessage('La ciudad es requerida')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres')
    .trim(),
    
  body('address.state')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El estado debe tener entre 2 y 50 caracteres')
    .trim(),
    
  body('address.zipCode')
    .notEmpty()
    .withMessage('El código postal es requerido')
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Formato de código postal inválido (12345 o 12345-6789)')
    .trim(),
    
  body('taxInformation.taxIdentificationType')
    .isIn(['EIN', 'SSN/ITIN', 'Foreign'])
    .withMessage('Tipo de identificación fiscal inválido'),
    
  body('taxInformation.taxIdentificationNumber')
    .notEmpty()
    .withMessage('El número de identificación fiscal es requerido')
    .isLength({ min: 9, max: 20 })
    .withMessage('El número de identificación debe tener entre 9 y 20 caracteres')
    .trim(),
    
  body('taxInformation.countryJurisdiction')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El país/jurisdicción debe tener entre 2 y 100 caracteres')
    .trim(),
    
  body('stateOfIncorporation')
    .notEmpty()
    .withMessage('El estado de incorporación es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El estado de incorporación debe tener entre 2 y 50 caracteres')
    .trim()
];