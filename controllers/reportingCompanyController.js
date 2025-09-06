const { ReportingCompany } = require(process.env.NODE_ENV === 'test' ? '../models/index.test' : '../models');
const { validationResult } = require('express-validator');

// Crear nueva empresa reportante
exports.createReportingCompany = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    // Mapear los datos del middleware al modelo
    const companyData = {
      companyName: req.body.companyLegalName,
      alternateNames: req.body.alternateName ? [req.body.alternateName] : [],
      phone: req.body.companyPhone,
      street: req.body.address.street,
      city: req.body.address.city,
      state: req.body.address.state,
      zipCode: req.body.address.zipCode,
      country: 'United States',
      taxIdType: req.body.taxInformation.taxIdentificationType,
      taxIdNumber: req.body.taxInformation.taxIdentificationNumber,
      countryOrJurisdiction: req.body.taxInformation.countryJurisdiction,
      stateOfIncorporation: req.body.stateOfIncorporation,
      businessType: 'LLC', // Valor por defecto
      formationDate: new Date().toISOString().split('T')[0], // Fecha actual por defecto
      email: req.body.email || null
    };

    const savedCompany = await ReportingCompany.create(companyData);
    
    res.status(201).json({
      success: true,
      message: 'Empresa reportante creada exitosamente',
      data: savedCompany
    });
  } catch (error) {
    console.error('Error creando empresa:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todas las empresas reportantes
exports.getAllReportingCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: companies } = await ReportingCompany.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
    
    res.status(200).json({
      success: true,
      count: companies.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: companies
    });
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener empresa reportante por ID
exports.getReportingCompanyById = async (req, res) => {
  try {
    const company = await ReportingCompany.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa reportante no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar empresa reportante
exports.updateReportingCompany = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const [updatedRowsCount] = await ReportingCompany.update(
      req.body,
      {
        where: { id: req.params.id },
        returning: true
      }
    );
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empresa reportante no encontrada'
      });
    }

    // Get the updated company
    const company = await ReportingCompany.findByPk(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Empresa reportante actualizada exitosamente',
      data: company
    });
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar empresa reportante
exports.deleteReportingCompany = async (req, res) => {
  try {
    const company = await ReportingCompany.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa reportante no encontrada'
      });
    }

    await company.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Empresa reportante eliminada exitosamente',
      data: company
    });
  } catch (error) {
    console.error('Error eliminando empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};