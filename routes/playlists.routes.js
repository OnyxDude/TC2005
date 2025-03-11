const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlists.controller');

const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.cookie('redirectTo', req.originalUrl, { httpOnly: true });
        return res.redirect('/');
    }
    next();
};

router.get('/', playlistsController.getAll);

router.get('/agregar', isAuth, playlistsController.getNew);
router.post('/agregar', isAuth, playlistsController.postNew);
router.get('/:id', isAuth, playlistsController.getPlaylist);

module.exports = router;