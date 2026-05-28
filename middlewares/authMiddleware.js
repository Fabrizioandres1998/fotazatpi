function authMiddleware(req, res, next) {

    if (!req.session.id_usuario) {
        return res.redirect('/login');
    }
    next();
}

module.exports = authMiddleware;