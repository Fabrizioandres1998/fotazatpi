let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('logout', { title: 'Cerrar sesion' });
});

router.post('/', function(req, res, next) {

});

module.exports = router;