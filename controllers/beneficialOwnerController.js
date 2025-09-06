const { BeneficialOwner, ReportingCompany } = require(process.env.NODE_ENV === 'test' ? '../models/index.test' : '../models');

// @desc    Get all beneficial owners
// @route   GET /api/beneficial-owners
// @access  Public
const getAllBeneficialOwners = async (req, res) => {
  try {
    const { page = 1, limit = 10, reportingCompanyId } = req.query;
    const whereClause = reportingCompanyId ? { reportingCompanyId, isActive: true } : { isActive: true };
    
    const { count, rows: beneficialOwners } = await BeneficialOwner.findAndCountAll({
      where: whereClause,
      include: [{
        model: ReportingCompany,
        as: 'ReportingCompany',
        attributes: ['companyName']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: beneficialOwners.length,
      total: count,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      data: beneficialOwners
    });
  } catch (error) {
    console.error('Error getting beneficial owners:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los beneficial owners',
      error: error.message
    });
  }
};

// @desc    Get single beneficial owner
// @route   GET /api/beneficial-owners/:id
// @access  Public
const getBeneficialOwnerById = async (req, res) => {
  try {
    const beneficialOwner = await BeneficialOwner.findByPk(req.params.id, {
      include: [{
        model: ReportingCompany,
        as: 'reportingCompany'
      }]
    });

    if (!beneficialOwner) {
      return res.status(404).json({
        success: false,
        message: 'Beneficial owner no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: beneficialOwner
    });
  } catch (error) {
    console.error('Error getting beneficial owner:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el beneficial owner',
      error: error.message
    });
  }
};

// @desc    Create new beneficial owner
// @route   POST /api/beneficial-owners
// @access  Public
const createBeneficialOwner = async (req, res) => {
  try {
    // Verify that the reporting company exists
    if (req.body.reportingCompanyId) {
      const reportingCompany = await ReportingCompany.findByPk(req.body.reportingCompanyId);
      if (!reportingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Reporting company no encontrada'
        });
      }
    }

    const beneficialOwner = await BeneficialOwner.create(req.body);
    
    // Reload with reporting company information
    await beneficialOwner.reload({
      include: [{
        model: ReportingCompany,
        as: 'ReportingCompany',
        attributes: ['companyName']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Beneficial owner creado exitosamente',
      data: beneficialOwner
    });
  } catch (error) {
    console.error('Error creating beneficial owner:', error);
    
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
      message: 'Error al crear el beneficial owner',
      error: error.message
    });
  }
};

// @desc    Update beneficial owner
// @route   PUT /api/beneficial-owners/:id
// @access  Public
const updateBeneficialOwner = async (req, res) => {
  try {
    // Verify that the reporting company exists if being updated
    if (req.body.reportingCompanyId) {
      const reportingCompany = await ReportingCompany.findByPk(req.body.reportingCompanyId);
      if (!reportingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Reporting company no encontrada'
        });
      }
    }

    const [updatedRowsCount] = await BeneficialOwner.update(
      req.body,
      {
        where: { id: req.params.id },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Beneficial owner no encontrado'
      });
    }

    // Get the updated beneficial owner with reporting company info
    const beneficialOwner = await BeneficialOwner.findByPk(req.params.id, {
      include: [{
        model: ReportingCompany,
        as: 'ReportingCompany',
        attributes: ['companyName']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Beneficial owner actualizado exitosamente',
      data: beneficialOwner
    });
  } catch (error) {
    console.error('Error updating beneficial owner:', error);
    
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
      message: 'Error al actualizar el beneficial owner',
      error: error.message
    });
  }
};

// @desc    Delete beneficial owner (soft delete)
// @route   DELETE /api/beneficial-owners/:id
// @access  Public
const deleteBeneficialOwner = async (req, res) => {
  try {
    const [updatedRowsCount] = await BeneficialOwner.update(
      { isActive: false },
      { where: { id: req.params.id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Beneficial owner no encontrado'
      });
    }

    const beneficialOwner = await BeneficialOwner.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Beneficial owner eliminado exitosamente',
      data: beneficialOwner
    });
  } catch (error) {
    console.error('Error deleting beneficial owner:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el beneficial owner',
      error: error.message
    });
  }
};

// @desc    Get beneficial owners by reporting company
// @route   GET /api/beneficial-owners/company/:companyId
// @access  Public
const getBeneficialOwnersByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify that the reporting company exists
    const reportingCompany = await ReportingCompany.findByPk(companyId);
    if (!reportingCompany) {
      return res.status(404).json({
        success: false,
        message: 'Reporting company no encontrada'
      });
    }

    const { count, rows: beneficialOwners } = await BeneficialOwner.findAndCountAll({
      where: { 
        reportingCompanyId: companyId, 
        isActive: true 
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: beneficialOwners.length,
      total: count,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      companyInfo: {
        id: reportingCompany.id,
        name: reportingCompany.companyName
      },
      data: beneficialOwners
    });
  } catch (error) {
    console.error('Error getting beneficial owners by company:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los beneficial owners de la empresa',
      error: error.message
    });
  }
};

// @desc    Permanently delete beneficial owner
// @route   DELETE /api/beneficial-owners/:id/permanent
// @access  Public
const permanentDeleteBeneficialOwner = async (req, res) => {
  try {
    const beneficialOwner = await BeneficialOwner.findByPk(req.params.id);

    if (!beneficialOwner) {
      return res.status(404).json({
        success: false,
        message: 'Beneficial owner no encontrado'
      });
    }

    await beneficialOwner.destroy();

    res.status(200).json({
      success: true,
      message: 'Beneficial owner eliminado permanentemente',
      data: beneficialOwner
    });
  } catch (error) {
    console.error('Error permanently deleting beneficial owner:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar permanentemente el beneficial owner',
      error: error.message
    });
  }
};

module.exports = {
  getAllBeneficialOwners,
  getBeneficialOwnerById,
  createBeneficialOwner,
  updateBeneficialOwner,
  deleteBeneficialOwner,
  getBeneficialOwnersByCompany,
  permanentDeleteBeneficialOwner
};