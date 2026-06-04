const express = require('express');
const router = express.Router();
const { notificacion, Usuario } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// vista de notificaciones
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notificaciones = await notificacion.findAll({
            where: { id_usuario_destino: req.session.id_usuario },
            include: [{ model: Usuario, as: 'origen', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']]
        });

        res.render('notificaciones', { notificaciones });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar notificaciones');
    }
});

// obtener notificaciones en JSON ppara el modal
router.get('/listar', authMiddleware, async (req, res) => {
    try {
        const notificaciones = await notificacion.findAll({
            where: { id_usuario_destino: req.session.id_usuario },
            include: [{ model: Usuario, as: 'origen', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']],
            limit: 30
        });
        res.json(notificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar notificaciones' });
    }
});

router.post('/marcar/:id', authMiddleware, async (req, res) => {
    try {
        await notificacion.update(
            { leida: true },
            { where: { id: req.params.id, id_usuario_destino: req.session.id_usuario } }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;