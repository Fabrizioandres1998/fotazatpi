let express = require('express');
let router = express.Router();

router.get('/logout', function(req, res, next) {
  res.render('logout', { title: 'Cerrar sesion' });
});

router.post('/logout', function(req, res, next) {

});

module.exports = router;