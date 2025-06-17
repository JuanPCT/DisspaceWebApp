const { validationResult } = require('express-validator');
const User = require('../models/User');

// Mostrar formulario de login
const showLogin = (req, res) => {
    res.render('auth/login', { 
        title: 'Iniciar Sesión',
        layout: 'layouts/layout' 
    });
};

// Procesar login
const processLogin = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/auth/login');
        }

        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findByEmail(email);
        if (!user) {
            req.flash('error', 'Credenciales incorrectas');
            return res.redirect('/auth/login');
        }

        // Verificar contraseña
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            req.flash('error', 'Credenciales incorrectas');
            return res.redirect('/auth/login');
        }

        // Actualizar último login
        await user.updateLastLogin();

        // Crear sesión
        req.session.user = user.getPublicInfo();

        req.flash('success', `¡Bienvenido de vuelta, ${user.first_name}!`);
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error en login:', error);
        req.flash('error', 'Error interno del servidor');
        res.redirect('/auth/login');
    }
};

// Mostrar formulario de registro
const showRegister = (req, res) => {
    res.render('auth/register', { 
        title: 'Crear Cuenta',
        layout: 'layouts/layout' 
    });
};

// Procesar registro
const processRegister = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/auth/register');
        }

        const { username, email, password, first_name, last_name } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.existsEmailOrUsername(email, username);
        if (existingUser) {
            req.flash('error', 'Ya existe un usuario con ese email o nombre de usuario');
            return res.redirect('/auth/register');
        }

        // Crear nuevo usuario
        const newUser = await User.create({
            username,
            email,
            password,
            first_name,
            last_name
        });

        // Crear sesión automáticamente
        req.session.user = newUser.getPublicInfo();

        req.flash('success', `¡Cuenta creada exitosamente! Bienvenido, ${first_name}!`);
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error en registro:', error);
        req.flash('error', 'Error al crear la cuenta. Inténtalo de nuevo.');
        res.redirect('/auth/register');
    }
};

// Procesar logout
const logout = (req, res) => {
    const userName = req.session.user ? req.session.user.first_name : '';
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            req.flash('error', 'Error al cerrar sesión');
            return res.redirect('/');
        }
        
        res.clearCookie('connect.sid'); // Limpiar cookie de sesión
        req.flash('success', `¡Hasta luego, ${userName}!`);
        res.redirect('/');
    });
};

module.exports = {
    showLogin,
    processLogin,
    showRegister,
    processRegister,
    logout
};
