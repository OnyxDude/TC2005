const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlists.controller');

// Middleware de autenticación
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.cookie('redirectTo', req.originalUrl, { httpOnly: true });
        return res.redirect('/');
    }
    next();
};

// Route to display all playlists
router.get('/', playlistsController.getAll);

// Protected routes - require authentication
router.get('/nuevo', isAuth, playlistsController.getNew);
router.post('/nuevo', isAuth, playlistsController.postNew);
router.get('/:id', isAuth, playlistsController.getPlaylist);

module.exports = router;