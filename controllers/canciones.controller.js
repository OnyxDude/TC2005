const Cancion = require('../models/cancion.model');

exports.getAll = async (request, response, next) => {
    try {
        const canciones = await Cancion.fetchAll();
        response.render('canciones/index', {
            pageTitle: 'Lista de Canciones',
            path: '/canciones',
            canciones: canciones,
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
        
        response.render('canciones/ver', {
            pageTitle: cancion.titulo,
            path: '/canciones',
            cancion: cancion,
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