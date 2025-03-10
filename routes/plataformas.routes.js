const express = require('express');
const router = express.Router();

// In-memory storage for platforms
const plataformas = [
    { nombre: 'Spotify', url: 'https://spotify.com' },
    { nombre: 'Apple Music', url: 'https://music.apple.com' },
    { nombre: 'YouTube Music', url: 'https://music.youtube.com' }
];

router.get('/', (request, response, next) => {
    response.render('plataformas/index', { 
        plataformas: plataformas,
        titulo: 'Plataformas de Música'
    });
});

router.get('/agregar', (request, response, next) => {
    response.render('plataformas/agregar', {
        titulo: 'Agregar una Nueva Plataforma'
    });
});

router.post('/agregar', (request, response, next) => {
    console.log(request.body);
    const nombre = request.body.nombre;
    const url = request.body.url || '#';
    
    plataformas.push({ nombre, url });
    console.log(plataformas);

    response.redirect('/plataformas/');
});

module.exports = router;