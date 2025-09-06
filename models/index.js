const sequelize = require('../config/database');
const ReportingCompany = require('./ReportingCompany');
const BeneficialOwner = require('./BeneficialOwner');

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

// Sincronizar modelos si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Modelos sincronizados');
  }).catch(err => {
    console.error('Error sincronizando modelos:', err);
  });
}