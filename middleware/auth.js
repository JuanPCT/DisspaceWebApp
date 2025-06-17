// Middleware para verificar si el usuario está autenticado
function requireAuth(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'Debes iniciar sesión para acceder a esta página');
        return res.redirect('/auth/login');
    }
}

// Middleware para redirigir usuarios autenticados
function requireGuest(req, res, next) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    } else {
        return next();
    }
}

// Middleware para verificar si el usuario es administrador
function requireAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        req.flash('error', 'No tienes permisos para acceder a esta página');
        return res.redirect('/');
    }
}

// Middleware para pasar información del usuario a las vistas
function setUserLocals(req, res, next) {
    res.locals.currentUser = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
}

module.exports = {
    requireAuth,
    requireGuest,
    requireAdmin,
    setUserLocals
};
