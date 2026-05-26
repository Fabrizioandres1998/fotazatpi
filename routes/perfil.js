const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware', 'authMiddleware')

router.get('/', authMiddleware, async (req, res, next) => {
    res.render('perfil');
})

module.exports = router