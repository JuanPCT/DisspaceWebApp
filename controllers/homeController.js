const User = require('../models/User');

// Página principal
const home = (req, res) => {
    res.render('landing', {
        title: 'DisspaceWebApp',
        layout: 'layouts/layout'
    });
};

// Dashboard (página principal para usuarios autenticados)
const dashboard = async (req, res) => {
    try {
        // Obtener estadísticas básicas
        const totalUsers = await User.count();
        
        res.render('dashboard', { 
            title: 'Dashboard - DisspaceWebApp',
            layout: 'layouts/layout',
            stats: {
                totalUsers
            }
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        req.flash('error', 'Error al cargar el dashboard');
        res.redirect('/');
    }
};

// Perfil de usuario
const profile = (req, res) => {
    res.render('profile', { 
        title: 'Mi Perfil - DisspaceWebApp',
        layout: 'layouts/layout' 
    });
};

module.exports = {
    home,
    dashboard,
    profile
};
