const express = require('express');
const router = express.Router();
const { Usuario, follower, notificacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

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
            return res.status(400).json({ error: 'no puedes seguirte a ti mismo' });
        }

        const usuarioExistente = await Usuario.findByPk(id_seguido);
        if (!usuarioExistente) {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }

        const yaSigue = await follower.findOne({
            where: { id_seguidor: id_seguidor, id_seguido: id_seguido }
        });

        if (yaSigue) {
            return res.status(400).json({ error: 'ya sigues a este usuario' });
        }

        await follower.create({ id_seguidor: id_seguidor, id_seguido: id_seguido });

        if (id_seguidor !== id_seguido) {
            await crearNotificacion(id_seguido, id_seguidor, `comenzo a seguirte`);
        }

        // Obtener nuevos contadores
        const seguidoresCount = await follower.count({ where: { id_seguido: id_seguido } });
        const seguidosCount = await follower.count({ where: { id_seguidor: id_seguido } });

        res.json({
            success: true,
            siguiendo: true,
            seguidoresCount: seguidoresCount,
            seguidosCount: seguidosCount
        });

    } catch (error) {
        console.error('Error al seguir:', error);
        res.status(500).json({ error: 'error al seguir usuario' });
    }
});

// Dejar de seguir 
router.post('/dejar-seguir/:id', authMiddleware, async (req, res) => {
    try {
        const id_seguido = req.params.id;
        const id_seguidor = req.session.id_usuario;

        if (parseInt(id_seguidor) === parseInt(id_seguido)) {
            return res.status(400).json({ error: 'no puedes dejar de seguirte a ti mismo' });
        }

        const usuarioExistente = await Usuario.findByPk(id_seguido);
        if (!usuarioExistente) {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }

        await follower.destroy({
            where: { id_seguidor: id_seguidor, id_seguido: id_seguido }
        });

        const seguidoresCount = await follower.count({ where: { id_seguido: id_seguido } });
        const seguidosCount = await follower.count({ where: { id_seguidor: id_seguido } });

        res.json({
            success: true,
            siguiendo: false,
            seguidoresCount: seguidoresCount,
            seguidosCount: seguidosCount
        });

    } catch (error) {
        console.error('Error al dejar de seguir:', error);
        res.status(500).json({ error: 'error al dejar de seguir' });
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