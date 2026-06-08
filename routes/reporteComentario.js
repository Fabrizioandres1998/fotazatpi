const express = require('express');
const router = express.Router();
const { reporte_comentario, comentario, Publicacion, notificacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

async function crearNotificacion(id_usuario_destino, id_usuario_origen, mensaje, link = null) {
    try {
        await notificacion.create({
            id_usuario_destino,
            id_usuario_origen,
            mensaje,
            link,
            leida: false
        });
        console.log('Notificación creada');
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
}

// reportar comentario
router.post('/:id', authMiddleware, async (req, res) => {
    try {
        const id_comentario = req.params.id;
        const id_usuario = req.session.id_usuario;
        const { motivo, descripcion } = req.body;

        const motivosValidos = ['spam', 'contenido_inapropiado', 'violencia', 'odio', 'copyright'];
        if (!motivo || !motivosValidos.includes(motivo)) {
            return res.redirect('back');
        }

        const comentarioItem = await comentario.findByPk(id_comentario, {
            include: [{ model: Publicacion, as: 'publicacion' }]
        });

        if (!comentarioItem) {
            return res.redirect('back');
        }

        if (comentarioItem.id_usuario === id_usuario) {
            return res.redirect('back');
        }

        const reporteExistente = await reporte_comentario.findOne({
            where: { id_usuario, id_comentario }
        });

        if (reporteExistente) {
            return res.redirect('back');
        }

        await reporte_comentario.create({
            id_comentario,
            id_usuario,
            motivo,
            descripcion: descripcion || null
        });

        const link = `/publicaciones/${comentarioItem.publicacion.id}`;

        const mensaje = `Se reportó un comentario en tu publicación <a href="${link}">"${comentarioItem.publicacion.titulo.substring(0, 50)}"</a>`;

        await crearNotificacion(
            comentarioItem.publicacion.id_usuario,
            id_usuario,
            mensaje
        );

        res.redirect('back');
    } catch (error) {
        console.error('Error al reportar comentario:', error);
        res.redirect('back');
    }
});

module.exports = router;