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

            // obtener publicaciones con sus valoraciones
            let publicacionesRaw;
            if (!isLoggedIn) {
                publicacionesRaw = await Publicacion.findAll({
                    where: whereCondition,
                    include: [
                        { model: Usuario },
                        { model: Imagen, as: "imagenes", where: { licencia: "sin_copyright" } },
                        { model: Valoracion, as: 'valoraciones' }
                    ]
                });
            } else {
                publicacionesRaw = await Publicacion.findAll({
                    where: whereCondition,
                    include: [
                        { model: Imagen, as: "imagenes" },
                        { model: Usuario },
                        { model: Etiqueta, as: "etiquetas" },
                        { model: Valoracion, as: 'valoraciones' }
                    ]
                });
            }

            // calcular puntaje por promedio y cantidad de votos
            const conPuntaje = publicacionesRaw.map(pub => {
                const valoraciones = pub.valoraciones || [];
                const cantidad = valoraciones.length;
                let promedio = 0;

                if (cantidad > 0) {
                    const suma = valoraciones.reduce((acc, v) => acc + v.puntaje, 0);
                    promedio = suma / cantidad;
                }

                const puntaje = (promedio * 0.7) + (Math.log(cantidad + 1) * 0.3 * (5 / Math.log(6)));

                return {
                    ...pub.dataValues,
                    score: puntaje,
                    createdAt: pub.createdAt
                };
            });

            // ordenar por puntaje
            conPuntaje.sort((a, b) => b.score - a.score);

            // obtener ultimas 5 publicaciones nuevas
            const nuevas = publicacionesRaw
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(pub => ({
                    ...pub.dataValues,
                    score: 0,
                    createdAt: pub.createdAt
                }));

            // mezclar populares y nuevas (balance)
            const populares = [...conPuntaje];
            const nuevasIds = new Set(nuevas.map(p => p.id));
            const popularesSinNuevas = populares.filter(p => !nuevasIds.has(p.id));

            const resultado = [];
            let idxPop = 0;
            let idxNue = 0;

            while (idxPop < popularesSinNuevas.length || idxNue < nuevas.length) {
                for (let i = 0; i < 2 && idxPop < popularesSinNuevas.length; i++) {
                    resultado.push(popularesSinNuevas[idxPop++]);
                }
                if (idxNue < nuevas.length) {
                    resultado.push(nuevas[idxNue++]);
                }
            }

            while (idxPop < popularesSinNuevas.length) {
                resultado.push(popularesSinNuevas[idxPop++]);
            }

            publicaciones = resultado;

            // buscar usuarios si no hay publicaciones
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
        console.error('error en /publicaciones:', error);
        res.status(500).send("error al cargar publicaciones: " + error.message);
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

        // Verificar si los comentarios estan cerrados
        const publicacion = await Publicacion.findByPk(id);
        if (!publicacion) {
            return res.status(404).json({ error: 'Publicacion no encontrada' });
        }

        if (publicacion.comentarios_cerrados) {
            return res.status(403).json({ error: 'Los comentarios estan cerrados para esta publicacion' });
        }

        if (!texto || texto.trim() === '') {
            return res.status(400).json({ error: 'El comentario no puede estar vacio' });
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
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        if (comentarioItem.publicacion.id_usuario !== req.session.id_usuario) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await comentarioItem.destroy();

        res.json({ success: true });

    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ error: 'Error al eliminar comentario' });
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
        const publicacion = await Publicacion.findByPk(req.params.id, {
            include: [{ model: Imagen, as: 'imagenes' }]
        });

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        if (publicacion.id_usuario !== req.session.id_usuario) {
            return res.status(403).send("No autorizado");
        }

        // eliminar las imagenes asociadas primero
        if (publicacion.imagenes && publicacion.imagenes.length > 0) {
            for (const imagen of publicacion.imagenes) {
                await imagen.destroy();
            }
        }

        // eliminar la publicacion (ahora sin imagenes asociadas)
        await publicacion.destroy();

        res.redirect('/perfil');
    } catch (error) {
        console.error('Error al eliminar la publicacion:', error);
        res.status(500).send("Error al eliminar la publicacion");
    }
});
// alternar comentariosabrir/cerrar
router.post('/:id/toggle-comentarios', authMiddleware, async (req, res) => {
    try {
        const publicacionId = req.params.id;
        const id_usuario = req.session.id_usuario;

        const publicacion = await Publicacion.findByPk(publicacionId);

        if (!publicacion) {
            return res.status(404).json({ error: 'Publicacion no encontrada' });
        }

        // solo el autor puede hacer esto
        if (publicacion.id_usuario !== id_usuario) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const nuevoEstado = !publicacion.comentarios_cerrados;
        await publicacion.update({ comentarios_cerrados: nuevoEstado });

        res.json({
            success: true,
            comentarios_cerrados: nuevoEstado,
            message: nuevoEstado ? 'Comentarios cerrados' : 'Comentarios abiertos'
        });

    } catch (error) {
        console.error('Error al cambiar estado de comentarios:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

module.exports = router;