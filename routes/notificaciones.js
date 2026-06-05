const express = require('express');
const router = express.Router();
const { notificacion, Usuario, Publicacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/listar', authMiddleware, async (req, res) => {
    try {
        console.log('=== DEBUG NOTIFICACIONES ===');
        console.log('Usuario ID:', req.session.id_usuario);
        
        const notificaciones = await notificacion.findAll({
            where: { id_usuario_destino: req.session.id_usuario },
            include: [
                { model: Usuario, as: 'origen', attributes: ['id', 'username'] },
                { model: Publicacion, as: 'publicacion', attributes: ['id', 'titulo'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: 30
        });
        
        console.log('Notificaciones encontradas:', notificaciones.length);
        res.json(notificaciones);
    } catch (error) {
        console.error('ERROR COMPLETO:', error);
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
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
        console.error('Error al marcar:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;