const express = require('express');
const router = express.Router();
const { Usuario, Publicacion, Imagen } = require('../models')

router.get('/crear', async (req, res, next) => {
    res.render('crearPublicacion')
})
router.post('/crear', async (req, res, next) => {
    try {
        const { titulo, descripcion, url, licencia, marca_agua } = req.body;  

        console.log('Datos recibidos:', { titulo, descripcion, url, licencia });  

        const publicacion = await Publicacion.create({
            titulo: titulo,
            descripcion: descripcion,
            id_usuario: req.session.id_usuario
        })

        if (url && licencia) {
            await Imagen.create({
                url: url,
                licencia: licencia,
                id_publicacion: publicacion.id
            });
            console.log('Imagen creada');
        } else {
            console.log('No se creó imagen: faltan url o licencia');
        }

        res.redirect(`/publicaciones/${publicacion.id}`);

    } catch (error) {
        console.error(error);
        res.send(error.message);
    }

})

module.exports = router;