let express = require('express');
let router = express.Router();

// cerrar sesion (por post, desde un formulario)
router.post("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir sesión:', err);
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/login');
  });
});

// si alguien entra por get, lo mando al login
router.get("/", (req, res) => {
  res.redirect('/login');
});

module.exports = router;