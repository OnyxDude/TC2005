const Plataforma = require('../models/plataforma.model');

exports.getAll = async (request, response, next) => {
    try {
        const plataformas = await Plataforma.fetchAll();
        response.render('plataformas/index', { 
            plataformas: plataformas,
            titulo: 'Plataformas de Música'
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar las plataformas');
    }
};

exports.getNew = (request, response, next) => {
    response.render('plataformas/agregar', {
        titulo: 'Agregar una Nueva Plataforma',
        editing: false,
        csrfToken: request.csrfToken(),
    });
};

exports.postNew = async (request, response, next) => {
    try {
        console.log(request.body);
        const nombre = request.body.nombre;
        const url = request.body.url || '#';
        
        const nuevaPlataforma = new Plataforma(nombre, url);
        await nuevaPlataforma.save();
        response.redirect('/plataformas/');
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al guardar la plataforma');
    }
};

exports.getEdit = async (request, response, next) => {
    try {
        const id = parseInt(request.params.id);
        const plataforma = await Plataforma.findById(id);
        
        if (!plataforma) {
            return response.status(404).render('404', { title: 'Plataforma no encontrada' });
        }
        
        response.render('plataformas/agregar', {
            titulo: 'Editar Plataforma',
            plataforma: plataforma,
            editing: true,
            csrfToken: request.csrfToken(),
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al cargar la plataforma');
    }
};

exports.postEdit = async (request, response, next) => {
    try {
        const id = parseInt(request.body.id);
        const nombre = request.body.nombre;
        const url = request.body.url || '#';
        
        await Plataforma.update(id, { nombre, url });
        response.redirect('/plataformas/');
    } catch (error) {
        console.log(error);
        response.status(500).send('Error al actualizar la plataforma');
    }
};