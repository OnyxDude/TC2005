const express = require('express');
const router = express.Router();
const plataformasController = require('../controllers/plataformas.controller');

router.get('/', plataformasController.getAll);

router.get('/agregar', plataformasController.getNew);

router.post('/agregar', plataformasController.postNew);

module.exports = router;