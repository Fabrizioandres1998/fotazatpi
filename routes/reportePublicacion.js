const express = require('express');
const router = express.Router();
const { reporte_publicacion, Publicacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// Enviar reporte
router.post('/publicacion/:id', authMiddleware, async (req, res) => {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.id_usuario;
        const { motivo, descripcion } = req.body;

        // Validar motivo
        const motivosValidos = ['spam', 'contenido_inapropiado', 'violencia', 'odio', 'copyright'];
        if (!motivo || !motivosValidos.includes(motivo)) {
            req.flash('error', 'Motivo inválido');
            return res.redirect('back');
        }

        // Verificar que la publicacion existe
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada');
            return res.redirect('back');
        }

        // No reportar propia publicacion
        if (publicacion.id_usuario === id_usuario) {
            req.flash('error', 'No puedes reportar tu propia publicación');
            return res.redirect('back');
        }

        // Verificar si ya report
        const reporteExistente = await reporte_publicacion.findOne({
            where: { id_usuario, id_publicacion }
        });

        if (reporteExistente) {
            req.flash('error', 'Ya reportaste esta publicación anteriormente');
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

        if (cantidadReportes >= 3) {
            req.flash('warning', `Esta publicación tiene ${cantidadReportes} reportes. Un moderador la revisará.`);
        } else {
            req.flash('success', `Reporte enviado (${cantidadReportes}/3 reportes). Gracias por ayudar.`);
        }

        res.redirect(`/publicaciones/${id_publicacion}`);

    } catch (error) {
        console.error('Error al reportar:', error);
        req.flash('error', 'Error al enviar el reporte');
        res.redirect('back');
    }
});

module.exports = router;