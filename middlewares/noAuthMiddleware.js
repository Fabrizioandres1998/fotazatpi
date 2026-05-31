function noAuthMiddleware(req, res, next) {
    if (req.session.id_usuario) {
        res.redirect('/'); 
    }
    next();
}

module.exports = noAuthMiddleware;