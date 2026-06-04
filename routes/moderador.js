const express = require('express');
const router = express.Router();
const { Publicacion, Usuario, Imagen, reporte_publicacion } = require('../models');
const { sequelize } = require('../models');
const moderadorMiddleware = require('../middlewares/moderadorMiddleware');

// Aplicar middleware a todas las rutas de moderador
router.use(moderadorMiddleware);

// Panel principal: publicaciones con 3 o más reportes pendientes
router.get('/reportes', async (req, res) => {
    try {
        // Obtener todas las publicaciones que tienen reportes
        const publicacionesConReportes = await Publicacion.findAll({
            include: [
                { model: Usuario, attributes: ['id', 'username'] },
                { model: Imagen, as: 'imagenes', limit: 1 }
            ]
        });

        // Filtrar las que tienen 3 o ms reportes
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
            titulo: 'Publicaciones con reportes pendientes'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el panel de reportes');
    }
});

// Ver detalles de una publicación reportada
router.get('/reportes/publicacion/:id', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id, {
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario, attributes: ['id', 'username'] }
            ]
        });

        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada');
            return res.redirect('/moderador/reportes');
        }

        const reportes = await reporte_publicacion.findAll({
            where: { id_publicacion: req.params.id },
            include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'username'] }]
        });

        res.render('moderador/publicacion-reportada', { publicacion, reportes });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la publicación');
    }
});

// Dar de baja publicación (eliminar)
router.post('/reportes/publicacion/:id/eliminar', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id);
        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada');
            return res.redirect('/moderador/reportes');
        }

        const id_usuario = publicacion.id_usuario;

        // Eliminar publicación (reportes se eliminan por CASCADE)
        await publicacion.destroy();

        // Actualizar estado de reportes a 'resuelto'
        await reporte_publicacion.update(
            { estado: 'resuelto' },
            { where: { id_publicacion: req.params.id } }
        );

        // INCREMENTAR contador de publicaciones eliminadas del usuario
        const usuario = await Usuario.findByPk(id_usuario);
        if (usuario) {
            const nuevasEliminadas = (usuario.publicaciones_eliminadas || 0) + 1;
            await usuario.update({
                publicaciones_eliminadas: nuevasEliminadas
            });

            // Si llega a 3, inactivar cuenta
            if (nuevasEliminadas >= 3) {
                await usuario.update({ activo: false });
                req.flash('warning', `El usuario ${usuario.username} ha sido INACTIVADO por acumular 3 publicaciones eliminadas`);
            } else {
                req.flash('info', `El usuario ${usuario.username} tiene ${nuevasEliminadas}/3 publicaciones eliminadas`);
            }
        }

        req.flash('success', 'Publicación eliminada correctamente');
        res.redirect('/moderador/reportes');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Error al eliminar la publicación');
        res.redirect('/moderador/reportes');
    }
});

// Desestimar reportes (marcar como revisado)
router.post('/reportes/publicacion/:id/desestimar', async (req, res) => {
    try {
        await reporte_publicacion.update(
            { estado: 'revisado' },
            { where: { id_publicacion: req.params.id } }
        );

        req.flash('success', 'Reportes desestimados correctamente');
        res.redirect('/moderador/reportes');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Error al desestimar los reportes');
        res.redirect('/moderador/reportes');
    }
});

module.exports = router;