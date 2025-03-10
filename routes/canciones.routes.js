const express = require('express');
const router = express.Router();
const cancionesController = require('../controllers/canciones.controller');

// Middleware de autenticación
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.cookie('redirectTo', req.originalUrl, { httpOnly: true });
        return res.redirect('/');
    }
    next();
};

// Ruta pública para mostrar todas las canciones
router.get('/', cancionesController.getAll);

// Rutas protegidas que requieren autenticación
router.get('/agregar', isAuth, cancionesController.getNew);
router.post('/agregar', isAuth, cancionesController.postNew);

module.exports = router;