const express = require('express');
const router = express.Router();
const plataformasController = require('../controllers/plataformas.controller');

// Middleware de autenticación
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.cookie('redirectTo', req.originalUrl, { httpOnly: true });
        return res.redirect('/');
    }
    next();
};

// Ruta pública para ver plataformas
router.get('/', plataformasController.getAll);

// Rutas protegidas que requieren autenticación
router.get('/agregar', isAuth, plataformasController.getNew);
router.post('/agregar', isAuth, plataformasController.postNew);

module.exports = router;