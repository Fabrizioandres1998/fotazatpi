const express = require('express');
const router = express.Router();
const { reporte_publicacion, Publicacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// Enviar reporte 
router.post('/:id', authMiddleware, async (req, res) => {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.id_usuario;
        const { motivo, descripcion } = req.body;

        // Validar motivo
        const motivosValidos = ['spam', 'contenido_inapropiado', 'violencia', 'odio', 'copyright'];
        if (!motivo || !motivosValidos.includes(motivo)) {
            return res.status(400).json({ error: 'Motivo invalido' });
        }

        // Verificar que la publicacion existe
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.status(404).json({ error: 'Publicacion no encontrada' });
        }

        // No reportar propia publicacion
        if (publicacion.id_usuario === id_usuario) {
            return res.status(400).json({ error: 'No puedes reportar tu propia publicacion' });
        }

        // Verificar si ya reporto
        const reporteExistente = await reporte_publicacion.findOne({
            where: { id_usuario, id_publicacion }
        });

        if (reporteExistente) {
            return res.status(400).json({ error: 'ya reportaste esta publicacion' });
        }

        // crear reporte
        await reporte_publicacion.create({
            id_publicacion,
            id_usuario,
            motivo,
            descripcion: descripcion || null,
            estado: 'pendiente'
        });

        // contar reportes de esta publicacion
        const cantidadReportes = await reporte_publicacion.count({
            where: { id_publicacion }
        });

        res.json({
            success: true,
            cantidadReportes
        });

    } catch (error) {
        console.error('Error al reportar:', error);
        res.status(500).json({ error: 'Error al crear reporte' });
    }
});

module.exports = router;