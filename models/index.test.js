const sequelize = require('../config/database.test');
const { DataTypes } = require('sequelize');

// Definir modelos para pruebas usando SQLite
const ReportingCompany = sequelize.define('ReportingCompany', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  alternateNames: {
    type: DataTypes.JSON,
    allowNull: true
  },
  taxIdType: {
    type: DataTypes.ENUM('EIN', 'SSN', 'ITIN'),
    allowNull: false
  },
  taxIdNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  countryOfFormation: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  stateOfFormation: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tribalJurisdiction: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  otherFormationJurisdiction: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  addressType: {
    type: DataTypes.ENUM('business', 'residential'),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
});

const BeneficialOwner = sequelize.define('BeneficialOwner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportingCompanyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ReportingCompany,
      key: 'id'
    }
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  residenceLocation: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  residenceAddress: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  residenceCity: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  residenceState: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  residenceZipCode: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  residenceCountry: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  identificationDocumentType: {
    type: DataTypes.ENUM('passport', 'drivers_license', 'state_id'),
    allowNull: false
  },
  identificationNumber: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  identificationCountry: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  ownershipPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  controlType: {
    type: DataTypes.ENUM('ownership', 'control', 'both'),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Definir asociaciones
ReportingCompany.hasMany(BeneficialOwner, {
  foreignKey: 'reportingCompanyId',
  as: 'beneficialOwners'
});

BeneficialOwner.belongsTo(ReportingCompany, {
  foreignKey: 'reportingCompanyId',
  as: 'ReportingCompany'
});

// Exportar modelos y sequelize
module.exports = {
  sequelize,
  ReportingCompany,
  BeneficialOwner
};