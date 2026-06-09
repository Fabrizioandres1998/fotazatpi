const express = require('express');
const router = express.Router();
const { Publicacion, Imagen, Usuario, Etiqueta, comentario, Valoracion, reporte_publicacion, me_interesa, reporte_comentario, coleccion, follower } = require('../models');
const { sequelize } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');

// listar todas, filtrar por etiqueta o buscar
router.get('/', async (req, res) => {
    const { etiqueta, busqueda } = req.query;
    let publicaciones = [];
    let usuarios = [];
    let whereCondition = {};

    try {
        // condicion de busqueda
        if (busqueda && busqueda.trim() !== '') {
            whereCondition = {
                [Op.or]: [
                    { titulo: { [Op.like]: `%${busqueda}%` } },
                    { descripcion: { [Op.like]: `%${busqueda}%` } }
                ]
            };
        }

        if (etiqueta) {
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            });

            if (etiquetaEncontrada) {
                publicaciones = await etiquetaEncontrada.getPublicaciones({
                    where: whereCondition,
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
            const isLoggedIn = req.session && req.session.id_usuario;

            // Buscar publicaciones
            if (!isLoggedIn) {
                publicaciones = await Publicacion.findAll({
                    where: whereCondition,
                    include: [
                        { model: Usuario },
                        { model: Imagen, as: "imagenes", where: { licencia: "sin_copyright" } }
                    ]
                });
            } else {
                publicaciones = await Publicacion.findAll({
                    where: whereCondition,
                    include: [
                        { model: Imagen, as: "imagenes" },
                        { model: Usuario },
                        { model: Etiqueta, as: "etiquetas" }
                    ]
                });
            }

            // buscar usuarios
            if (busqueda && busqueda.trim() !== '' && publicaciones.length === 0) {
                usuarios = await Usuario.findAll({
                    where: {
                        username: { [Op.like]: `%${busqueda}%` }
                    },
                    attributes: ['id', 'username', 'email']
                });
            }
        }

        res.render('publicaciones', {
            publicaciones,
            usuarios,
            filtro: etiqueta || null,
            busqueda: busqueda || null
        });

    } catch (error) {
        console.error('Error en /publicaciones:', error);
        res.status(500).send("Error al cargar publicaciones: " + error.message);
    }
});

// publicaciones de usuarios que sigo (feed)
router.get('/feed', authMiddleware, async (req, res) => {
    try {
        const id_usuario = req.session.id_usuario;

        const seguidos = await follower.findAll({
            where: { id_seguidor: id_usuario },
            attributes: ['id_seguido']
        });

        const idsSeguidos = seguidos.map(s => s.id_seguido);

        if (idsSeguidos.length === 0) {
            return res.render('feed', {
                publicaciones: [],
                mensaje: 'Aún no sigues a nadie. Sigue a otros usuarios para ver sus publicaciones.'
            });
        }

        const publicaciones = await Publicacion.findAll({
            where: { id_usuario: idsSeguidos },
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario },
                { model: Etiqueta, as: 'etiquetas' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('feed', {
            publicaciones,
            mensaje: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el feed');
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

        const comentarios = await comentario.findAll({
            where: { id_publicacion: req.params.id },
            include: [
                { model: Usuario, as: 'usuario' },
                { model: reporte_comentario, as: 'reportes', required: false }
            ],
            order: [['createdAt', 'ASC']]
        });

        const stats = await Valoracion.findAll({
            where: { id_publicacion: req.params.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('puntaje')), 'promedio'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
            ]
        });

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
        const cantidadReportes = await reporte_publicacion.count({
            where: { id_publicacion: req.params.id }
        });
        const interesadosCount = await me_interesa.count({
            where: { id_publicacion: req.params.id }
        });

        let yaInteresado = false;
        if (req.session.id_usuario) {
            const interes = await me_interesa.findOne({
                where: {
                    id_usuario: req.session.id_usuario,
                    id_publicacion: req.params.id
                }
            });
            yaInteresado = !!interes;
        }

        let misColecciones = [];
        if (req.session.id_usuario) {
            misColecciones = await coleccion.findAll({
                where: { id_usuario: req.session.id_usuario },
                attributes: ['id', 'nombre'],
                order: [['nombre', 'ASC']]
            });
        }

        res.render('publicacion', {
            publicacion,
            comentarios,
            promedio,
            cantidadVotos,
            votoUsuario: votoUsuario ? votoUsuario.puntaje : null,
            cantidadReportes,
            interesadosCount,
            yaInteresado,
            misColecciones
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar la publicación");
    }
});

// post comentario 
router.post('/:id/comentario', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { texto } = req.body;
        const id_usuario = req.session.id_usuario;

        if (!id_usuario) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        if (!texto || texto.trim() === '') {
            return res.status(400).json({ error: 'El comentario no puede estar vacío' });
        }

        const nuevoComentario = await comentario.create({
            texto: texto.trim(),
            id_usuario: id_usuario,
            id_publicacion: id
        });

        // Obtener el usuario que comento
        const usuario = await Usuario.findByPk(id_usuario, {
            attributes: ['id', 'username']
        });

        // Formatear la fecha
        const fecha = new Date(nuevoComentario.createdAt).toLocaleString();

        res.json({
            success: true,
            comentario: {
                id: nuevoComentario.id,
                texto: nuevoComentario.texto,
                usuario: usuario,
                createdAt: fecha
            }
        });

    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ error: 'Error al crear comentario' });
    }
});

// eliminar comentario
router.post('/eliminar/:id', authMiddleware, async (req, res) => {
    try {
        const comentarioItem = await comentario.findByPk(req.params.id, {
            include: [{ model: Publicacion, as: 'publicacion' }]
        });

        if (!comentarioItem) {
            return res.redirect('back');
        }

        if (comentarioItem.publicacion.id_usuario !== req.session.id_usuario) {
            return res.redirect('back');
        }

        await comentarioItem.destroy();
        res.redirect('back');
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.redirect('back');
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