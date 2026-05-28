function noAuthMiddleware(req, res, next) {
    if (req.session.id_usuario) {
        res.redirect('/perfil'); //CAMBIAR AL ROOT CUANDO SE PUEDA
    }
    next();
}

module.exports = noAuthMiddleware;