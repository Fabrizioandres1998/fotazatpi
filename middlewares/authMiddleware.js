function authMiddleware(req, res, next) {

    if (!req.session.usuarioId) {
        return res.send("Acceso denegado");
    }
    next();
}

module.exports = authMiddleware;