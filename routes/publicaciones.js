const express = require('express');
const router = express.Router();
const { Publicacion, Imagen, Usuario, Etiqueta, comentario, Valoracion, reporte_publicacion } = require('../models');
const { sequelize } = require('../models');

// listar todas o filtrar por etiqueta
router.get('/', async (req, res) => {
    const { etiqueta } = req.query;
    let publicaciones = [];

    try {
        if (etiqueta) {
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            })

            if (etiquetaEncontrada) {
                publicaciones = await etiquetaEncontrada.getPublicaciones({
                    include: [
                        { model: Imagen, as: 'imagenes' },
                        { model: Usuario },
                        { model: Etiqueta, as: 'etiquetas' }
                    ]
                });
            } else {
                publicaciones = [];
            }
        } else {
            if (!req.session.id_usuario) {
                publicaciones = await Publicacion.findAll({
                    include: [
                        { model: Usuario },
                        { model: Imagen, as: "imagenes", where: { licencia: "sin_copyright" } }
                    ]
                })
                return res.render('publicaciones', {
                    publicaciones,
                    filtro: null
                });
            }
            publicaciones = await Publicacion.findAll({
                include: [
                    { model: Imagen, as: "imagenes" },
                    { model: Usuario },
                    { model: Etiqueta, as: "etiquetas" }
                ]
            });
        }

        res.render('publicaciones', {
            publicaciones,
            filtro: etiqueta || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar publicaciones");
    }
});

// ver una publicacion individual
router.get('/:id', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id, {
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario },
                { model: Etiqueta, as: 'etiquetas' }
            ]
        });

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        // traer comentarios con los datos del usuario
        const comentarios = await comentario.findAll({
            where: { id_publicacion: req.params.id },
            include: [{ model: Usuario }],
            order: [['createdAt', 'ASC']]
        });

        // promedio de votos
        const stats = await Valoracion.findAll({
            where: { id_publicacion: req.params.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('puntaje')), 'promedio'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
            ]
        });

        // verificar si el usuario ya voto
        let votoUsuario = null;
        if (req.session.id_usuario) {
            votoUsuario = await Valoracion.findOne({
                where: {
                    id_usuario: req.session.id_usuario,
                    id_publicacion: req.params.id
                }
            });
        }

        const promedio = parseFloat(stats[0]?.dataValues?.promedio || 0);
        const cantidadVotos = parseInt(stats[0]?.dataValues?.cantidad || 0);

        // contar reportes de esta publicacion
        const cantidadReportes = await reporte_publicacion.count({
            where: { id_publicacion: req.params.id }
        });

        res.render('publicacion', {
            publicacion,
            comentarios,
            promedio,
            cantidadVotos,
            votoUsuario: votoUsuario ? votoUsuario.puntaje : null,
            cantidadReportes  
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar la publicación");
    }
});

// post comentario 
router.post('/:id/comentario', async (req, res) => {
    try {
        const { id } = req.params;
        const { texto } = req.body;
        const id_usuario = req.session.id_usuario;

        if (!id_usuario) {
            req.flash('error', 'Debes iniciar sesión para comentar');
            return res.redirect(`/publicaciones/${id}`);
        }

        if (!texto || texto.trim() === '') {
            req.flash('error', 'El comentario no puede estar vacío');
            return res.redirect(`/publicaciones/${id}`);
        }

        await comentario.create({
            texto: texto.trim(),
            id_usuario: id_usuario,
            id_publicacion: id
        });

        req.flash('success', 'Comentario agregado correctamente');
        res.redirect(`/publicaciones/${id}`);

    } catch (error) {
        console.error('Error al crear comentario:', error);
        req.flash('error', 'Error al crear comentario');
        res.redirect(`/publicaciones/${req.params.id}`);
    }
});

// mostrar formulario de edicion
router.get('/:id/editar', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id, {
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario },
                { model: Etiqueta, as: 'etiquetas' }
            ]
        });

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        if (publicacion.id_usuario !== req.session.id_usuario) {
            return res.status(403).send("No autorizado");
        }

        const todasEtiquetas = await Etiqueta.findAll();

        res.render('editarPublicacion', {
            publicacion,
            todasEtiquetas
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el formulario de edición");
    }
});

// procesar la actualizacion
router.post('/:id/actualizar', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id);

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        await publicacion.update({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion
        });

        if (req.body.etiquetas) {
            let etiquetasIds = req.body.etiquetas;
            if (!Array.isArray(etiquetasIds)) {
                etiquetasIds = [etiquetasIds];
            }
            await publicacion.setEtiquetas(etiquetasIds);
        } else {
            await publicacion.setEtiquetas([]);
        }

        res.redirect(`/publicaciones/${publicacion.id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar");
    }
});

// eliminar una publicacion
router.post('/:id/eliminar', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id);

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        if (publicacion.id_usuario !== req.session.id_usuario) {
            return res.status(403).send("No autorizado");
        }

        await publicacion.destroy();
        res.redirect('/perfil');

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la publicacion");
    }
});

module.exports = router;