const express = require('express');
const router = express.Router();
const { Publicacion, Usuario, Imagen, Comentario, Valoracion, reporte_publicacion, sequelize } = require('../models');
const moderadorMiddleware = require('../middlewares/moderadorMiddleware');

// aplicar middleware a todas las rutas de moderador
router.use(moderadorMiddleware);

// panel principal publicaciones con 3 o mas reportes pendientes
router.get('/reportes', async (req, res) => {
    try {
        // obtener todas las publicaciones que tienen reportes
        const publicacionesConReportes = await Publicacion.findAll({
            include: [
                { model: Usuario, attributes: ['id', 'username'] },
                { model: Imagen, as: 'imagenes', limit: 1 }
            ]
        });

        // filtrar las que tienen 3 o mas reportes
        const publicacionesReportadas = [];
        for (const pub of publicacionesConReportes) {
            const cantidadReportes = await reporte_publicacion.count({
                where: {
                    id_publicacion: pub.id,
                    estado: 'pendiente'
                }
            });

            if (cantidadReportes >= 3) {
                publicacionesReportadas.push({
                    ...pub.dataValues,
                    cantidadReportes
                });
            }
        }

        res.render('moderador/reportes', {
            publicaciones: publicacionesReportadas,
            titulo: 'publicaciones con reportes pendientes'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('error al cargar el panel de reportes');
    }
});

// ver detalles de una publicacion reportada
router.get('/reportes/publicacion/:id', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id, {
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario, attributes: ['id', 'username'] }
            ]
        });

        if (!publicacion) {
            req.flash('error', 'publicacion no encontrada');
            return res.redirect('/moderador/reportes');
        }

        const reportes = await reporte_publicacion.findAll({
            where: { id_publicacion: req.params.id },
            include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'username'] }]
        });

        res.render('moderador/publicacion-reportada', { publicacion, reportes });

    } catch (error) {
        console.error(error);
        res.status(500).send('error al cargar la publicacion');
    }
});

// dar de baja publicacion (eliminar)
router.post('/reportes/publicacion/:id/eliminar', async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const publicacionId = req.params.id;

        // obtener publicacion con el id_usuario
        const publicacion = await Publicacion.findByPk(publicacionId, { transaction });
        if (!publicacion) {
            await transaction.rollback();
            return res.status(404).json({ error: 'publicacion no encontrada' });
        }

        const id_usuario = publicacion.id_usuario;

        // 1. eliminar reportes asociados primero
        await reporte_publicacion.destroy({
            where: { id_publicacion: publicacionId },
            transaction
        });

        // 2. eliminar imagenes de la publicacion
        await Imagen.destroy({
            where: { id_publicacion: publicacionId },
            transaction
        });

        // 3. eliminar comentarios de la publicacion
        if (Comentario) {
            await Comentario.destroy({
                where: { id_publicacion: publicacionId },
                transaction
            });
        }

        // 4. eliminar valoraciones de la publicacion
        if (Valoracion) {
            await Valoracion.destroy({
                where: { id_publicacion: publicacionId },
                transaction
            });
        }

        // 5. finalmente eliminar la publicacion
        await Publicacion.destroy({
            where: { id: publicacionId },
            transaction
        });

        // 6. actualizar contador de publicaciones eliminadas del usuario
        const usuario = await Usuario.findByPk(id_usuario, { transaction });
        let mensaje = '';

        if (usuario) {
            const nuevasEliminadas = (usuario.publicaciones_eliminadas || 0) + 1;
            await usuario.update({
                publicaciones_eliminadas: nuevasEliminadas
            }, { transaction });

            // si llega a 3, inactivar cuenta
            if (nuevasEliminadas >= 3) {
                await usuario.update({ activo: false }, { transaction });
                mensaje = `publicacion eliminada. el usuario ${usuario.username} ha sido inactivado por acumular 3 publicaciones eliminadas`;
            } else {
                mensaje = `publicacion eliminada. el usuario ${usuario.username} tiene ${nuevasEliminadas}/3 publicaciones eliminadas`;
            }
        } else {
            mensaje = 'publicacion eliminada correctamente';
        }

        await transaction.commit();
        res.json({ success: true, message: mensaje });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: 'error al eliminar la publicacion: ' + error.message });
    }
});

// desestimar reportes
router.post('/reportes/publicacion/:id/desestimar', async (req, res) => {
    try {
        // actualizar reportes pendientes a revisado
        await reporte_publicacion.update(
            { estado: 'revisado' },
            { where: { id_publicacion: req.params.id, estado: 'pendiente' } }
        );

        req.flash('success', 'reportes desestimados correctamente');
        res.redirect('/moderador/reportes');

    } catch (error) {
        console.error(error);
        req.flash('error', 'error al desestimar los reportes');
        res.redirect('/moderador/reportes');
    }
});

module.exports = router;