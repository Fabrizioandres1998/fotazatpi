let express = require('express');
let router = express.Router();

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Iniciar sesion' });
});

router.post('/login', function (req, res) {

});
module.exports = router;
