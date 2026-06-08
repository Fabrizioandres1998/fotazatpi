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
            return res.redirect('back');
        }

        // Verificar que la publicacion existe
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.redirect('back');
        }

        // No reportar propia publicacion
        if (publicacion.id_usuario === id_usuario) {
            return res.redirect('back');
        }

        // Verificar si ya reportó
        const reporteExistente = await reporte_publicacion.findOne({
            where: { id_usuario, id_publicacion }
        });

        if (reporteExistente) {
            return res.redirect('back');
        }

        // crear reporte
        await reporte_publicacion.create({
            id_publicacion,
            id_usuario,
            motivo,
            descripcion: descripcion || null,
            estado: 'pendiente'
        });

        // Contar reportes de esta publicacion
        const cantidadReportes = await reporte_publicacion.count({
            where: { id_publicacion }
        });

        res.redirect(`/publicaciones/${id_publicacion}`);

    } catch (error) {
        console.error('Error al reportar:', error);
        res.redirect('back');
    }
});

module.exports = router;