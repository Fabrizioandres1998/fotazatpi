let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// mostrar formulario de login
router.get('/', (req, res, next) => {
  res.render('login', { title: 'Iniciar sesion' });
});

// procesar el login
router.post('/', async (req, res) => {

  try {
    const { email, password_hash } = req.body;

    // busco el usuario por email
    const usuario = await Usuario.findOne({
      where: { email }
    })

    if (!usuario) {
      return res.send('Usuario no encontrado');
    }

    // verifico la contraseña
    const passwordValida = await bcrypt.compare(password_hash, usuario.password_hash);

    if (!passwordValida) {
      return res.send('Contraseña incorrecta');
    }

    // guardo los datos en sesion
    req.session.id_usuario = usuario.id;
    req.session.username = usuario.username;
    
    return res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno');
    console.error(error.message)
  }
});

module.exports = router;