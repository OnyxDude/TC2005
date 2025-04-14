const express = require('express');
const router = express.Router();
const cancionesController = require('../controllers/canciones.controller');
const isAuth = require('../util/is-auth');

router.get('/', cancionesController.getAll);

router.get('/ver/:id', cancionesController.getSong);

router.get('/agregar', isAuth, cancionesController.getNew);
router.post('/agregar', isAuth, cancionesController.postNew);

router.get('/editar/:id', isAuth, cancionesController.getEdit);
router.post('/editar', isAuth, cancionesController.postEdit);

// Spotify integration
router.get('/agregar-spotify/:trackId', isAuth, cancionesController.getAddFromSpotify);

module.exports = router;