let express = require('express');
let router = express.Router();

router.get('/registro', function (req, res, next) {
    res.render('registro', { title: 'Registrarse' });
});

router.post('/registro', function (req, res, next) {
    
});

module.exports = router;