const Playlist = require('../models/playlist.model');
const Cancion = require('../models/cancion.model');
const Plataforma = require('../models/plataforma.model');

exports.getAll = async (request, response, next) => {
    try {
        const playlists = await Playlist.fetchAll();
        response.render('playlists/index', { 
            playlists: playlists,
            titulo: 'Mis Playlists'
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar las playlists');
    }
};

exports.getPlaylist = async (request, response, next) => {
    try {
        const id = parseInt(request.params.id);
        const playlist = await Playlist.getDetailedPlaylist(id);
        
        if (!playlist) {
            return response.status(404).render('404', { title: 'Playlist no encontrada' });
        }
        
        response.render('playlists/ver', { 
            playlist: playlist,
            titulo: `Playlist: ${playlist.nombre}`
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar la playlist');
    }
};

exports.getNew = async (request, response, next) => {
    try {
        const canciones = await Cancion.fetchAll();
        const plataformas = await Plataforma.fetchAll();
        
        response.render('playlists/agregar', {
            titulo: 'Crear Nueva Playlist',
            canciones: canciones,
            plataformas: plataformas,
            editing: false,
            csrfToken: request.csrfToken(),
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar el formulario');
    }
};

exports.postNew = async (request, response, next) => {
    try {
        console.log('Request body:', request.body);
        const nombre = request.body.nombre;
        const descripcion = request.body.descripcion || '';
        const plataforma_id = request.body.plataforma;
        const usuario_id = 1;
        
        console.log('Playlist data:', { nombre, descripcion, plataforma_id, usuario_id });
        
        let canciones = [];
        if (request.body.canciones) {
            if (!Array.isArray(request.body.canciones)) {
                canciones = [parseInt(request.body.canciones)];
            } else {
                canciones = request.body.canciones.map(id => parseInt(id));
            }
        }
        
        console.log('Selected songs:', canciones);
        
        const nuevaPlaylist = new Playlist(nombre, descripcion, usuario_id, plataforma_id, canciones);
        await nuevaPlaylist.save();
        response.redirect('/playlists');
    } catch (error) {
        console.log('Error details:', error);
        console.log('Stack trace:', error.stack);
        response.status(500).send('Error al guardar la playlist');
    }
};

exports.getEdit = async (request, response, next) => {
    try {
        const id = parseInt(request.params.id);
        const playlist = await Playlist.getDetailedPlaylist(id);
        
        if (!playlist) {
            return response.status(404).render('404', { title: 'Playlist no encontrada' });
        }
        
        const canciones = await Cancion.fetchAll();
        const plataformas = await Plataforma.fetchAll();
        
        response.render('playlists/agregar', {
            titulo: 'Editar Playlist',
            playlist: playlist,
            canciones: canciones,
            plataformas: plataformas,
            editing: true,
            csrfToken: request.csrfToken(),
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar el formulario de edición');
    }
};

exports.postEdit = async (request, response, next) => {
    try {
        const id = parseInt(request.params.id);
        
        const playlist = {
            nombre: request.body.nombre,
            descripcion: request.body.descripcion || '',
            plataforma_id: parseInt(request.body.plataforma)
        };
        
        let canciones = [];
        if (request.body.canciones) {
            if (!Array.isArray(request.body.canciones)) {
                canciones = [parseInt(request.body.canciones)];
            } else {
                canciones = request.body.canciones.map(id => parseInt(id));
            }
        }
        
        playlist.canciones = canciones;
        
        await Playlist.update(id, playlist);
        response.redirect('/playlists');
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al actualizar la playlist');
    }
};