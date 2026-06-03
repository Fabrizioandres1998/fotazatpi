const express = require('express');
const router = express.Router();
const { Usuario, follower } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// Seguir a un usuario
router.post('/seguir/:id', authMiddleware, async (req, res) => {
    try {
        const id_seguido = req.params.id;
        const id_seguidor = req.session.id_usuario;

        if (parseInt(id_seguidor) === parseInt(id_seguido)) {
            req.flash('error', 'No puedes seguirte a ti mismo');
            return res.redirect('back');
        }

        const usuarioExistente = await Usuario.findByPk(id_seguido);
        if (!usuarioExistente) {
            req.flash('error', 'Usuario no encontrado');
            return res.redirect('/publicaciones');
        }

        const yaSigue = await follower.findOne({
            where: {
                id_seguidor: id_seguidor,
                id_seguido: id_seguido
            }
        });

        if (yaSigue) {
            req.flash('error', 'Ya sigues a este usuario');
            return res.redirect(`/perfil/${usuarioExistente.username}`);
        }

        await follower.create({
            id_seguidor: id_seguidor,
            id_seguido: id_seguido
        });

        req.flash('success', `Ahora sigues a ${usuarioExistente.username}`);
        res.redirect(`/perfil/${usuarioExistente.username}`);

    } catch (error) {
        console.error('Error al seguir:', error);
        req.flash('error', 'Error al seguir usuario');
        res.redirect('back');
    }
});

// Dejar de seguir
router.post('/dejar-seguir/:id', authMiddleware, async (req, res) => {
    try {
        const id_seguido = req.params.id;
        const id_seguidor = req.session.id_usuario;

        if (parseInt(id_seguidor) === parseInt(id_seguido)) {
            req.flash('error', 'No puedes dejar de seguirte a ti mismo');
            return res.redirect('back');
        }

        const usuarioExistente = await Usuario.findByPk(id_seguido);
        if (!usuarioExistente) {
            req.flash('error', 'Usuario no encontrado');
            return res.redirect('/publicaciones');
        }

        await follower.destroy({
            where: {
                id_seguidor: id_seguidor,
                id_seguido: id_seguido
            }
        });

        req.flash('success', `Dejaste de seguir a ${usuarioExistente.username}`);
        res.redirect(`/perfil/${usuarioExistente.username}`);

    } catch (error) {
        console.error('Error al dejar de seguir:', error);
        req.flash('error', 'Error al dejar de seguir');
        res.redirect('back');
    }
});

// Ver seguidores
router.get('/seguidores/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [{
                model: Usuario,
                as: 'seguidores',
                attributes: ['id', 'username']
            }]
        });

        if (!usuario) {
            req.flash('error', 'Usuario no encontrado');
            return res.redirect('/publicaciones');
        }

        res.render('seguidores', {
            titulo: `Seguidores de ${usuario.username}`,
            usuarios: usuario.seguidores,
            tipo: 'seguidores'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar seguidores');
    }
});

// Ver seguidos
router.get('/seguidos/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [{
                model: Usuario,
                as: 'seguidos',
                attributes: ['id', 'username']
            }]
        });

        if (!usuario) {
            req.flash('error', 'Usuario no encontrado');
            return res.redirect('/publicaciones');
        }

        res.render('seguidores', {
            titulo: `Usuarios que sigue ${usuario.username}`,
            usuarios: usuario.seguidos,
            tipo: 'seguidos'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar seguidos');
    }
});

module.exports = router;