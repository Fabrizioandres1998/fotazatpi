const express = require('express');
const router = express.Router();
const { me_interesa, Publicacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// marcar o quitar me interesa
router.post('/publicacion/:id', authMiddleware, async (req, res) => {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.id_usuario;

        // publicacion existe
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.redirect('back');
        }

        // verificar si marco interes
        const existe = await me_interesa.findOne({
            where: { id_usuario, id_publicacion }
        });

        if (existe) {
            // quitar interes
            await existe.destroy();
        } else {
            // marcar interes
            await me_interesa.create({ id_usuario, id_publicacion });
        }

        res.redirect('back');

    } catch (error) {
        console.error('Error al procesar interés:', error);
        res.redirect('back');
    }
});

// cantidad de interesados 
router.get('/publicacion/:id/count', async (req, res) => {
    try {
        const cantidad = await me_interesa.count({
            where: { id_publicacion: req.params.id }
        });
        res.json({ cantidad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al contar intereses' });
    }
});

module.exports = router;