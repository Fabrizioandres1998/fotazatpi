let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
    res.render('registro', { title: 'Registrarse' });
});

router.post('/', async (req, res, next) => {
    try {

        const { username, email, password_hash, confirmPassword } = req.body;

        if (password_hash !== confirmPassword) {
            return res.render('registro', {
                title: 'Registrarse',
                error: 'Las contraseñas no coinciden'
            });
        }

        const passwordHash = await bcrypt.hash(password_hash, 10);

        await Usuario.create({
            username,
            email,
            password_hash: passwordHash
        });

        res.redirect('/login');

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error');
        
    }
});

module.exports = router;