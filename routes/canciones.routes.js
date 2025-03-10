const express = require('express');
const router = express.Router();
const cancionesController = require('../controllers/canciones.controller');

// Ruta para mostrar todas las canciones
router.get('/', cancionesController.getAll);

// Ruta para mostrar el formulario de nueva canción
router.get('/agregar', cancionesController.getNew);

// Ruta para procesar la nueva canción
router.post('/agregar', cancionesController.postNew);

module.exports = router;