const express = require('express');
const router = express.Router();
const { Usuario, follower, notificacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// funcion para crear notificacin
async function crearNotificacion(id_usuario_destino, id_usuario_origen, mensaje) {
    try {
        await notificacion.create({
            id_usuario_destino,
            id_usuario_origen,
            mensaje,
            leida: false
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
}

// Seguir a un usuario
router.post('/seguir/:id', authMiddleware, async (req, res) => {
    try {
        const id_seguido = req.params.id;
        const id_seguidor = req.session.id_usuario;

        if (parseInt(id_seguidor) === parseInt(id_seguido)) {
            return res.redirect('back');
        }

        const usuarioExistente = await Usuario.findByPk(id_seguido);
        if (!usuarioExistente) {
            return res.redirect('/publicaciones');
        }

        const yaSigue = await follower.findOne({
            where: {
                id_seguidor: id_seguidor,
                id_seguido: id_seguido
            }
        });

        if (yaSigue) {
            return res.redirect(`/perfil/${usuarioExistente.username}`);
        }

        await follower.create({
            id_seguidor: id_seguidor,
            id_seguido: id_seguido
        });

        // NOTIFICACION cuando alguien te sigue
        if (id_seguidor !== id_seguido) {
            await crearNotificacion(
                id_seguido,
                id_seguidor,
                ` comenzó a seguirte`
            );
        }

        res.redirect(`/perfil/${usuarioExistente.username}`);

    } catch (error) {
        console.error('Error al seguir:', error);
        res.redirect('back');
    }
});

// Dejar de seguir
router.post('/dejar-seguir/:id', authMiddleware, async (req, res) => {
    try {
        const id_seguido = req.params.id;
        const id_seguidor = req.session.id_usuario;

        if (parseInt(id_seguidor) === parseInt(id_seguido)) {
            return res.redirect('back');
        }

        const usuarioExistente = await Usuario.findByPk(id_seguido);
        if (!usuarioExistente) {
            return res.redirect('/publicaciones');
        }

        await follower.destroy({
            where: {
                id_seguidor: id_seguidor,
                id_seguido: id_seguido
            }
        });

        res.redirect(`/perfil/${usuarioExistente.username}`);

    } catch (error) {
        console.error('Error al dejar de seguir:', error);
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