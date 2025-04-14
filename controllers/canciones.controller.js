const Cancion = require('../models/cancion.model');
const spotifyApi = require('../util/spotify');

exports.getAll = async (request, response, next) => {
    try {
        // Buscar canciones en la base de datos
        const canciones = await Cancion.fetchAll();
        
        // Verificar si hay una búsqueda de Spotify
        const query = request.query.q || '';
        let spotifyResults = [];
        let spotifyError = null;
        
        if (query) {
            try {
                const spotifyData = await spotifyApi.searchTracks(query);
                spotifyResults = spotifyData.tracks.items;
            } catch (err) {
                console.log(err);
                spotifyError = 'Error al buscar en Spotify';
            }
        }
        
        response.render('canciones/index', {
            pageTitle: 'Lista de Canciones',
            path: '/canciones',
            canciones: canciones,
            query: query,
            spotifyResults: spotifyResults,
            spotifyError: spotifyError,
            hasStyles: true,
            activeCancionesLista: true
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar las canciones');
    }
};

exports.getSong = async (request, response, next) => {
    try {
        const id = parseInt(request.params.id);
        const cancion = await Cancion.findById(id);
        
        if (!cancion) {
            return response.status(404).render('404', { title: 'Canción no encontrada' });
        }
        
        // Search for the song on Spotify
        let spotifyTrack = null;
        try {
            spotifyTrack = await spotifyApi.findTrackByNameAndArtist(cancion.titulo, cancion.artista);
        } catch (spotifyError) {
            console.log('Error fetching Spotify data:', spotifyError);
            // Continue without Spotify data
        }
        
        response.render('canciones/ver', {
            pageTitle: cancion.titulo,
            path: '/canciones',
            cancion: cancion,
            spotifyTrack: spotifyTrack,
            hasStyles: true
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar la canción');
    }
};

exports.getNew = (request, response, next) => {
    response.render('canciones/agregar', {
        pageTitle: 'Nueva Canción',
        path: '/canciones',
        editing: false,
        hasStyles: true,
        activeCancionesForm: true,
        csrfToken: request.csrfToken(),
    });
};

exports.postNew = async (request, response, next) => {
    try {
        console.log(request.body);
        
        const nuevaCancion = new Cancion(
            request.body.titulo || request.body.nombre || 'Sin título',
            request.body.artista || 'Desconocido',
            request.body.album || 'Sin álbum',
            parseInt(request.body.año) || 0
        );
        
        await nuevaCancion.save();
        
        response.redirect('/canciones');
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al guardar la canción');
    }
};

exports.getEdit = async (request, response, next) => {
    try {
        const id = request.params.id;
        const cancion = await Cancion.findById(parseInt(id));
        
        if (!cancion) {
            return response.status(404).send('Canción no encontrada');
        }
        
        response.render('canciones/agregar', {
            pageTitle: 'Editar Canción',
            path: '/canciones',
            editing: true,
            cancion: cancion,
            hasStyles: true,
            activeCancionesForm: true,
            csrfToken: request.csrfToken(),
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar la canción');
    }
};

exports.postEdit = async (request, response, next) => {
    try {
        const id = parseInt(request.body.id);
        
        const cancion = {
            titulo: request.body.titulo || request.body.nombre || 'Sin título',
            artista: request.body.artista || 'Desconocido',
            album: request.body.album || 'Sin álbum',
            año: parseInt(request.body.año) || 0
        };
        
        await Cancion.update(id, cancion);
        
        response.redirect('/canciones');
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al actualizar la canción');
    }
};

exports.getAddFromSpotify = async (request, response, next) => {
    try {
        const trackId = request.params.trackId;
        
        if (!trackId) {
            return response.status(400).send('ID de canción requerido');
        }
        
        const trackDetails = await spotifyApi.getTrackDetails(trackId);
        
        response.render('canciones/agregar', {
            pageTitle: 'Guardar Canción de Spotify',
            path: '/canciones',
            editing: false,
            spotifyData: {
                titulo: trackDetails.name,
                artista: trackDetails.artists.map(a => a.name).join(', '),
                album: trackDetails.album.name,
                año: new Date(trackDetails.album.release_date).getFullYear(),
                imagen: trackDetails.album.images.length > 0 ? trackDetails.album.images[0].url : null
            },
            hasStyles: true,
            activeCancionesForm: true,
            csrfToken: request.csrfToken(),
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al obtener detalles de la canción');
    }
};

exports.searchSongs = async (request, response, next) => {
    try {
        // Verificar si hay una búsqueda de Spotify
        const query = request.query.term || '';
        let spotifyResults = [];
        let message = '';
        let error = false;
        
        if (query) {
            try {
                const spotifyData = await spotifyApi.searchTracks(query);
                spotifyResults = spotifyData.tracks.items;
                
                if (spotifyResults.length > 0) {
                    message = `Se encontraron ${spotifyResults.length} canciones`;
                } else {
                    message = 'No se encontraron canciones';
                    error = true;
                }
            } catch (err) {
                console.log(err);
                message = 'Error al buscar en Spotify';
                error = true;
            }
        } else {
            message = 'Ingresa un término de búsqueda';
            error = true;
        }
        
        response.json({
            message: message,
            error: error,
            songs: spotifyResults
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Error al procesar la búsqueda',
            error: true,
            songs: []
        });
    }
};

exports.searchAjax = async (request, response, next) => {
    try {
        // Buscar canciones en la base de datos
        const canciones = await Cancion.fetchAll();
        
        // Verificar si hay una búsqueda de Spotify
        const query = request.query.q || '';
        let spotifyResults = [];
        let spotifyError = null;
        
        if (query) {
            try {
                const spotifyData = await spotifyApi.searchTracks(query);
                spotifyResults = spotifyData.tracks.items;
            } catch (err) {
                console.log(err);
                spotifyError = 'Error al buscar en Spotify';
            }
        }
        
        // Enviar los resultados como JSON para AJAX
        response.json({
            canciones: canciones.filter(cancion => 
                !query || 
                cancion.nombre.toLowerCase().includes(query.toLowerCase()) || 
                cancion.artista.toLowerCase().includes(query.toLowerCase())
            ),
            spotifyResults: spotifyResults,
            spotifyError: spotifyError
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({error: 'Error al buscar canciones'});
    }
};