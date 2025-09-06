const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware de seguridad
app.use(helmet());

// Middleware de logging
app.use(morgan('combined'));

// Middleware CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conectar a MySQL
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL conectado exitosamente');
    console.log('Conexión a base de datos establecida (sincronización deshabilitada)');
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    console.error('Detalles del error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
    process.exit(1);
  }
};

// Conectar a la base de datos solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Rutas
app.use('/api/reporting-companies', require('./routes/reportingCompany'));
app.use('/api/beneficial-owners', require('./routes/beneficialOwner'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Empresas Reportantes y Beneficial Owners funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      // Reporting Companies
      'GET /api/reporting-companies': 'Obtener todas las empresas',
      'POST /api/reporting-companies': 'Crear nueva empresa',
      'GET /api/reporting-companies/:id': 'Obtener empresa por ID',
      'PUT /api/reporting-companies/:id': 'Actualizar empresa',
      'DELETE /api/reporting-companies/:id': 'Eliminar empresa',
      
      // Beneficial Owners
      'GET /api/beneficial-owners': 'Obtener todos los beneficial owners',
      'POST /api/beneficial-owners': 'Crear nuevo beneficial owner',
      'GET /api/beneficial-owners/:id': 'Obtener beneficial owner por ID',
      'PUT /api/beneficial-owners/:id': 'Actualizar beneficial owner',
      'DELETE /api/beneficial-owners/:id': 'Eliminar beneficial owner (soft delete)',
      'GET /api/beneficial-owners/company/:companyId': 'Obtener beneficial owners por empresa',
      'DELETE /api/beneficial-owners/:id/permanent': 'Eliminar beneficial owner permanentemente'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Exportar app para pruebas
module.exports = app;

// Solo iniciar servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
  });

  // Manejo de cierre graceful
  process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    sequelize.close().then(() => {
      console.log('Conexión a MySQL cerrada.');
      process.exit(0);
    });
  });
}