const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: false // Deshabilitado para desarrollo
}));
app.use(cors());

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para el body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'disspace-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Flash messages
app.use(flash());

// Middleware global para pasar datos a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.messages = req.flash();
    next();
});

// Importar rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

// Usar rutas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Middleware para manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Página no encontrada',
        url: req.url 
    });
});

// Middleware para manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Inicializar base de datos y servidor
const { initializeDatabase } = require('./config/database');

async function startServer() {
    try {
        await initializeDatabase();
        console.log('✅ Base de datos inicializada correctamente');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
