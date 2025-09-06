const { Sequelize } = require('sequelize');

// Configuración de base de datos para pruebas usando SQLite en memoria
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // Base de datos en memoria
  logging: false, // Desactivar logs en pruebas
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

module.exports = sequelize;