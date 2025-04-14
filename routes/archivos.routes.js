const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivos.controller');
const isAuth = require('../util/is-auth');

router.get('/', isAuth, archivosController.getIndex);
router.get('/subir', isAuth, archivosController.getSubirArchivo);
router.post('/subir', isAuth, archivosController.postSubirArchivo);
router.get('/lista', isAuth, archivosController.getListaArchivos);
router.get('/eliminar/:id', isAuth, archivosController.getEliminarArchivo);
router.get('/archivo/:id', archivosController.getArchivo); 

module.exports = router;
