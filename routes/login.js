let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('login', { title: 'Iniciar sesion' });
});

router.post('/', async (req, res) => {
  try {
    const { email, password_hash } = req.body;
    console.log('Datos recibidos: ', req.body);

    const usuario = await Usuario.findOne({
      where: { email }
    })

    if (!usuario) {
      return res.send('Usuario no encontrado');
    }

    const passwordValida = await bcrypt.compare(password_hash, usuario.password_hash);

    if (passwordValida) {
      return res.send('Login exitoso')
    } else {
      return res.send('Contraseña incorrecta');
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno');
  }
});
module.exports = router;
