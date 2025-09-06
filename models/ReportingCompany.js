const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ReportingCompany extends Model {
  // Método para obtener la dirección completa
  get fullAddress() {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }
}

ReportingCompany.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Company Information
  companyName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Company name is required'
      },
      len: {
        args: [1, 200],
        msg: 'Company name cannot exceed 200 characters'
      }
    }
  },
  alternateNames: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isValidArray(value) {
        if (value && Array.isArray(value)) {
          value.forEach(name => {
            if (typeof name !== 'string' || name.length > 200) {
              throw new Error('Each alternate name must be a string with max 200 characters');
            }
          });
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
  state: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'State is required'
      },
      len: {
        args: [1, 100],
        msg: 'State cannot exceed 100 characters'
      }
    }
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Zip code is required'
      },
      len: {
        args: [1, 20],
        msg: 'Zip code cannot exceed 20 characters'
      }
    }
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'United States',
    validate: {
      notEmpty: {
        msg: 'Country is required'
      }
    }
  },

  // Tax Information
  taxIdType: {
    type: DataTypes.ENUM('EIN', 'SSN', 'ITIN', 'Foreign'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Tax ID type is required'
      },
      isIn: {
        args: [['EIN', 'SSN', 'ITIN', 'Foreign']],
        msg: 'Tax ID type must be EIN, SSN, ITIN, or Foreign'
      }
    }
  },
  taxIdNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tax ID number is required'
      },
      len: {
        args: [1, 50],
        msg: 'Tax ID number cannot exceed 50 characters'
      }
    }
  },
  countryOrJurisdiction: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Country or jurisdiction is required'
      },
      len: {
        args: [1, 100],
        msg: 'Country or jurisdiction cannot exceed 100 characters'
      }
    }
  },

  // State of Incorporation
  stateOfIncorporation: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'State of incorporation is required'
      },
      len: {
        args: [1, 100],
        msg: 'State of incorporation cannot exceed 100 characters'
      }
    }
  },

  // Business Type
  businessType: {
    type: DataTypes.ENUM('Corporation', 'LLC', 'Partnership', 'Trust', 'Other'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Business type is required'
      },
      isIn: {
        args: [['Corporation', 'LLC', 'Partnership', 'Trust', 'Other']],
        msg: 'Business type must be Corporation, LLC, Partnership, Trust, or Other'
      }
    }
  },

  // Formation Date
  formationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Formation date is required'
      },
      isDate: {
        msg: 'Formation date must be a valid date'
      }
    }
  },

  // Contact Information
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'Phone number cannot exceed 20 characters'
      }
    }
  },

  // Status
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Pending', 'Dissolved'),
    allowNull: false,
    defaultValue: 'Active',
    validate: {
      isIn: {
        args: [['Active', 'Inactive', 'Pending', 'Dissolved']],
        msg: 'Status must be Active, Inactive, Pending, or Dissolved'
      }
    }
  },

  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Notes cannot exceed 1000 characters'
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
  modelName: 'ReportingCompany',
  tableName: 'reporting_companies',
  timestamps: true,
  indexes: [
    {
      fields: ['companyName']
    },
    {
      fields: ['taxIdNumber']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeUpdate: (reportingCompany, options) => {
      reportingCompany.updatedAt = new Date();
    }
  }
});

// Define associations
ReportingCompany.associate = function(models) {
  ReportingCompany.hasMany(models.BeneficialOwner, {
    foreignKey: 'reportingCompanyId',
    as: 'beneficialOwners'
  });
};

module.exports = ReportingCompany;