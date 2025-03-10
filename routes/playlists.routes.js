const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlists.controller');

// Route to display all playlists
router.get('/', playlistsController.getAll);

// Route to display the form for creating a new playlist
router.get('/nuevo', playlistsController.getNew);

// Route to process a new playlist
router.post('/nuevo', playlistsController.postNew);

// Route to view a specific playlist (must be last to avoid conflicts)
router.get('/:id', playlistsController.getPlaylist);

module.exports = router;