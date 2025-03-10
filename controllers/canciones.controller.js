const Cancion = require('../models/cancion.model');

exports.getAll = (request, response, next) => {
    response.render('canciones/index', {
        pageTitle: 'Lista de Canciones',
        path: '/canciones',
        canciones: Cancion.fetchAll(),
        hasStyles: true,
        activeCancionesLista: true
    });
};

exports.getNew = (request, response, next) => {
    response.render('canciones/agregar', {
        pageTitle: 'Nueva Canción',
        path: '/canciones',
        editing: false,
        hasStyles: true,
        activeCancionesForm: true
    });
};

exports.postNew = (request, response, next) => {
    console.log(request.body);
    
    const nuevaCancion = new Cancion(
        request.body.titulo || request.body.nombre || 'Sin título',
        request.body.artista || 'Desconocido',
        request.body.album || 'Sin álbum',
        parseInt(request.body.año) || 0
    );
    
    nuevaCancion.save();
    
    response.redirect('/canciones');
};