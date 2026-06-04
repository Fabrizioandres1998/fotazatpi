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

    if (!email || !password_hash) {
      return res.redirect('/login');
    }

    const usuario = await Usuario.findOne({
      where: { email }
    })

    if (!usuario) {
      return res.redirect('/login');
    }

    const passwordValida = await bcrypt.compare(password_hash, usuario.password_hash);

    if (!passwordValida) {
      return res.redirect('/login');
    }

    const isActivo = usuario.activo === null ? true : usuario.activo;

    if (!isActivo) {
      return res.redirect('/login');
    }

    const userRole = usuario.rol === null ? 'usuario' : usuario.rol;

    req.session.id_usuario = usuario.id;
    req.session.rol = userRole;
    req.session.username = usuario.username;

    req.session.save((err) => {
      if (err) {
        return res.redirect('/login');
      }
      return res.redirect('/');
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.redirect('/login');
  }
});

module.exports = router;