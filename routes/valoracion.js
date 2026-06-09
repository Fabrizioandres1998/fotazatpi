const express = require('express');
const router = express.Router();
const { Valoracion, Publicacion, notificacion } = require('../models');
const { sequelize } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// Funcion para crear notificacion
async function crearNotificacion(id_usuario_destino, id_usuario_origen, mensaje) {
    try {
        await notificacion.create({
            id_usuario_destino,
            id_usuario_origen,
            mensaje,
            leida: false
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
}

// votar una publicacion (ajax)
router.post('/publicacion/:id', authMiddleware, async (req, res) => {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.id_usuario;
        const { puntaje } = req.body;

        if (!puntaje || puntaje < 1 || puntaje > 5) {
            return res.status(400).json({ error: 'puntaje invalido' });
        }

        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.status(404).json({ error: 'publicacion no encontrada' });
        }

        if (publicacion.id_usuario === id_usuario) {
            return res.status(400).json({ error: 'no puedes votar tu propia publicacion' });
        }

        const votoExistente = await Valoracion.findOne({
            where: { id_usuario, id_publicacion }
        });

        if (votoExistente) {
            await votoExistente.update({ puntaje });
        } else {
            await Valoracion.create({ id_usuario, id_publicacion, puntaje });
            
            await crearNotificacion(
                publicacion.id_usuario,
                id_usuario,
                `valoró tu publicación con ${puntaje}`
            );
        }

        const stats = await Valoracion.findAll({
            where: { id_publicacion },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('puntaje')), 'promedio'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
            ]
        });

        const promedio = parseFloat(stats[0]?.dataValues?.promedio || 0);
        const cantidad = parseInt(stats[0]?.dataValues?.cantidad || 0);

        res.json({
            success: true,
            promedio: promedio,
            cantidad: cantidad
        });

    } catch (error) {
        console.error('Error al votar:', error);
        res.status(500).json({ error: 'error al procesar el voto' });
    }
});

module.exports = router;