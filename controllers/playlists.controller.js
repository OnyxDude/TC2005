const Playlist = require('../models/playlist.model');
const Cancion = require('../models/cancion.model');
const Plataforma = require('../models/plataforma.model');

exports.getAll = (request, response, next) => {
    response.render('playlists/index', { 
        playlists: Playlist.fetchAll(),
        titulo: 'Mis Playlists'
    });
};

exports.getPlaylist = (request, response, next) => {
    const id = parseInt(request.params.id);
    const playlist = Playlist.getDetailedPlaylist(id);
    
    if (!playlist) {
        return response.status(404).render('404', { title: 'Playlist no encontrada' });
    }
    
    response.render('playlists/ver', { 
        playlist: playlist,
        titulo: `Playlist: ${playlist.nombre}`
    });
};

exports.getNew = (request, response, next) => {
    response.render('playlists/agregar', {
        titulo: 'Crear Nueva Playlist',
        canciones: Cancion.fetchAll(),
        plataformas: Plataforma.fetchAll()
    });
};

exports.postNew = (request, response, next) => {
    console.log(request.body);
    const nombre = request.body.nombre;
    const descripcion = request.body.descripcion || '';
    const plataformaId = request.body.plataforma;
    
    // Convert song IDs to numbers if they exist
    let canciones = [];
    if (request.body.canciones) {
        // If single value, convert to array
        if (!Array.isArray(request.body.canciones)) {
            canciones = [parseInt(request.body.canciones)];
        } else {
            canciones = request.body.canciones.map(id => parseInt(id));
        }
    }
    
    const nuevaPlaylist = new Playlist(nombre, descripcion, plataformaId, canciones);
    nuevaPlaylist.save();

    response.redirect('/playlists');
};