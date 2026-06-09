const express = require('express');
const router = express.Router();
const { coleccion, coleccion_publicacion, Publicacion, Imagen, Usuario } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// formulario para crear coleccion
router.get('/crear', authMiddleware, (req, res) => {
    res.render('colecciones/crearColeccion');
});

// crear coleccion
router.post('/crear', authMiddleware, async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.redirect('/colecciones/crear');
        }

        await coleccion.create({
            id_usuario: req.session.id_usuario,
            nombre: nombre.trim()
        });

        res.redirect('/colecciones');
    } catch (error) {
        console.error(error);
        res.redirect('/colecciones/crear');
    }
});

// listar mis colecciones
router.get('/', authMiddleware, async (req, res) => {
    try {
        const colecciones = await coleccion.findAll({
            where: { id_usuario: req.session.id_usuario },
            order: [['createdAt', 'DESC']]
        });

        for (let coleccionItem of colecciones) {
            const publicaciones = await coleccionItem.getPublicaciones({
                include: [{ model: Imagen, as: 'imagenes' }],
                limit: 3,
                order: [['createdAt', 'DESC']]
            });
            coleccionItem.publicaciones = publicaciones;
        }

        console.log('colecciones encontradas:', colecciones.length);
        res.render('colecciones/index', { colecciones });
    } catch (error) {
        console.error('error:', error);
        res.status(500).send('error al cargar colecciones: ' + error.message);
    }
});

// ver una coleccion especifica 
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const coleccionItem = await coleccion.findOne({
            where: { 
                id: req.params.id,
                id_usuario: req.session.id_usuario
            },
            include: [{
                model: Publicacion,
                as: 'publicaciones',
                include: [
                    { model: Imagen, as: 'imagenes' },
                    { model: Usuario, attributes: ['id', 'username'] }
                ]
            }]
        });

        if (!coleccionItem) {
            return res.redirect('/colecciones');
        }

        res.render('colecciones/verColecciones', { coleccion: coleccionItem });
    } catch (error) {
        console.error(error);
        res.status(500).send('error al cargar la coleccion');
    }
});

// agregar publicacion a coleccion
router.post('/:id/agregar/:id_publicacion', authMiddleware, async (req, res) => {
    try {
        const id_coleccion = req.params.id;
        const id_publicacion = req.params.id_publicacion;

        const coleccionItem = await coleccion.findOne({
            where: { id: id_coleccion, id_usuario: req.session.id_usuario }
        });

        if (!coleccionItem) {
            return res.redirect('back');
        }

        const existe = await coleccion_publicacion.findOne({
            where: { id_coleccion, id_publicacion }
        });

        if (existe) {
            return res.redirect('back');
        }

        await coleccion_publicacion.create({
            id_coleccion,
            id_publicacion
        });

        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.redirect('back');
    }
});

// quitar publicacion de coleccion
router.post('/:id/quitar/:id_publicacion', authMiddleware, async (req, res) => {
    try {
        const id_coleccion = req.params.id;
        const id_publicacion = req.params.id_publicacion;

        await coleccion_publicacion.destroy({
            where: { id_coleccion, id_publicacion }
        });

        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.redirect('back');
    }
});

// eliminar coleccion
router.post('/eliminar/:id', authMiddleware, async (req, res) => {
    try {
        await coleccion.destroy({
            where: { id: req.params.id, id_usuario: req.session.id_usuario }
        });

        res.redirect('/colecciones');
    } catch (error) {
        console.error(error);
        res.redirect('/colecciones');
    }
});

module.exports = router;