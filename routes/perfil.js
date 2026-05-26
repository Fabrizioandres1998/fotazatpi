const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
    const autenticado = req.session.usuarioId;
    if(!autenticado) {
        return res.send('usuario no autenticadoo')
    }
    res.send('usuario autenticado')
})

module.exports = router