let express = require('express');
let router = express.Router();

router.get("/", (req, res) => {
  res.render('logout');
});

router.post("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir sesión:', err);
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/login');
  });
});

module.exports = router;