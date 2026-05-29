let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// mostrar formulario de registro
router.get('/', (req, res, next) => {
    res.render('registro', { title: 'Registrarse' });
});

// procesar el registro de un nuevo usuario
router.post('/', async (req, res, next) => {
    try {

        const { username, email, password_hash, confirmPassword } = req.body;

        // verifico que las contraseñas coincidan
        if (password_hash !== confirmPassword) {
            return res.render('registro', {
                title: 'Registrarse',
                error: 'Las contraseñas no coinciden'
            });
        }

        // encripto la contraseña
        const passwordHash = await bcrypt.hash(password_hash, 10);

        // creo el usuario en la base de datos
        await Usuario.create({
            username,
            email,
            password_hash: passwordHash
        });

        // redirijo al login
        res.redirect('/login');

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error');

    }
});

module.exports = router;