const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class BeneficialOwner extends Model {
  // Método para obtener el nombre completo
  get fullName() {
    const middle = this.middleName ? ` ${this.middleName}` : '';
    return `${this.firstName}${middle} ${this.lastName}`;
  }
}

BeneficialOwner.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Personal Information
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'First Name is required'
      },
      len: {
        args: [1, 50],
        msg: 'First Name cannot exceed 50 characters'
      }
    }
  },
  middleName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'Middle Name cannot exceed 50 characters'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last Name is required'
      },
      len: {
        args: [1, 50],
        msg: 'Last Name cannot exceed 50 characters'
      }
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Date of Birth is required'
      },
      isDate: {
        msg: 'Date of Birth must be a valid date'
      },
      isAdult(value) {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) {
          throw new Error('Beneficial owner must be at least 18 years old');
        }
      }
    }
  },

  // Residence Information
  residenceLocation: {
    type: DataTypes.ENUM('inside', 'outside'),
    allowNull: false,
    defaultValue: 'inside',
    validate: {
      notNull: {
        msg: 'Residence location is required'
      },
      isIn: {
        args: [['inside', 'outside']],
        msg: 'Residence location must be either inside or outside'
      }
    }
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Country is required'
      }
    }
  },
  countryOutsideUS: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      requiredIfOutside(value) {
        if (this.residenceLocation === 'outside' && !value) {
          throw new Error('Country outside US is required when residence is outside US');
        }
      }
    }
  },

  // Address Information
  street: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Street address is required'
      },
      len: {
        args: [1, 200],
        msg: 'Street address cannot exceed 200 characters'
      }
    }
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'City is required'
      },
      len: {
        args: [1, 100],
        msg: 'City cannot exceed 100 characters'
      }
    }
  },
  stateProvidence: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'State/Providence is required'
      },
      len: {
        args: [1, 100],
        msg: 'State/Providence cannot exceed 100 characters'
      }
    }
  },
  zipPostalCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Zip/Postal Code is required'
      },
      len: {
        args: [1, 20],
        msg: 'Zip/Postal Code cannot exceed 20 characters'
      }
    }
  },

  // Identification Information
  identifyingDocumentType: {
    type: DataTypes.ENUM('license', 'id', 'passport', 'other'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Identifying document type is required'
      },
      isIn: {
        args: [['license', 'id', 'passport', 'other']],
        msg: 'Document type must be license, id, passport, or other'
      }
    }
  },
  identifyingDocumentNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Identifying document number is required'
      },
      len: {
        args: [1, 50],
        msg: 'Document number cannot exceed 50 characters'
      }
    }
  },
  issuingJurisdiction: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Country/Jurisdiction is required'
      }
    }
  },
  jurisdictionCountryOutsideUS: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      requiredIfOther(value) {
        if (this.issuingJurisdiction === 'other' && !value) {
          throw new Error('Country outside US is required when jurisdiction is other');
        }
      }
    }
  },
  jurisdictionStateProvidence: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'State/Providence cannot exceed 100 characters'
      }
    }
  },

  // Photo ID
  photoId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Photo ID is required'
      },
      len: {
        args: [1, 255],
        msg: 'Photo ID must be a valid License, ID or Passport'
      }
    }
  },

  // Certification and Authorization
  certificationAccepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Certification must be accepted'
      },
      isTrue(value) {
        if (value !== true) {
          throw new Error('Client must certify that all information is accurate and complete');
        }
      }
    }
  },
  serviceTermsAccepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Service terms must be accepted'
      },
      isTrue(value) {
        if (value !== true) {
          throw new Error('Client must accept service terms and delivery timeframe');
        }
      }
    }
  },
  electronicSignature: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Electronic signature is required'
      },
      len: {
        args: [1, 100],
        msg: 'Electronic signature cannot exceed 100 characters'
      }
    }
  },
  signatureDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  // Associated Company
  reportingCompanyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'reporting_companies',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Associated reporting company is required'
      }
    }
  },

  // Metadata
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'BeneficialOwner',
  tableName: 'beneficial_owners',
  timestamps: true,
  indexes: [
    {
      fields: ['reportingCompanyId']
    },
    {
      fields: ['firstName', 'lastName']
    },
    {
      fields: ['createdAt']
    }
  ],
  // hooks: {
  //   beforeUpdate: (instance) => {
  //     instance.updatedAt = new Date();
  //   }
  // }
});

// Definir asociaciones
BeneficialOwner.associate = (models) => {
  BeneficialOwner.belongsTo(models.ReportingCompany, {
    foreignKey: 'reportingCompanyId',
    as: 'ReportingCompany'
  });
};

module.exports = BeneficialOwner;