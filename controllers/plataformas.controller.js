const Plataforma = require('../models/plataforma.model');

exports.getAll = (request, response, next) => {
    response.render('plataformas/index', { 
        plataformas: Plataforma.fetchAll(),
        titulo: 'Plataformas de Música'
    });
};

exports.getNew = (request, response, next) => {
    response.render('plataformas/agregar', {
        titulo: 'Agregar una Nueva Plataforma'
    });
};

exports.postNew = (request, response, next) => {
    console.log(request.body);
    const nombre = request.body.nombre;
    const url = request.body.url || '#';
    
    const nuevaPlataforma = new Plataforma(nombre, url);
    nuevaPlataforma.save();

    response.redirect('/plataformas/');
};