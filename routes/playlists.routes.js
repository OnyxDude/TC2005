const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlists.controller');
const isAuth = require('../util/is-auth');

router.get('/search', playlistsController.searchPlaylists);

router.get('/', playlistsController.getAll);
router.get('/agregar', isAuth, playlistsController.getNew);
router.post('/agregar', isAuth, playlistsController.postNew);
router.get('/editar/:id', isAuth, playlistsController.getEdit);
router.post('/editar/:id', isAuth, playlistsController.postEdit);
router.get('/:id', isAuth, playlistsController.getPlaylist);

module.exports = router;