function moderadorMiddleware(req, res, next) {
    if (!req.session.id_usuario) {
        req.flash('error', 'Debes iniciar sesión');
        return res.redirect('/login');
    }
    
    if (req.session.rol !== 'moderador' && req.session.rol !== 'admin') {
        req.flash('error', 'No tienes permiso para acceder a esta página');
        return res.redirect('/');
    }
    
    next();
}

module.exports = moderadorMiddleware;