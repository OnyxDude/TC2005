const express = require('express');
const router = express.Router();

// Datos de ejemplo (en una aplicación real, esto vendría de una base de datos)
const canciones = [
    { id: 1, titulo: 'Bohemian Rhapsody', artista: 'Queen', album: 'A Night at the Opera', año: 1975 },
    { id: 2, titulo: 'Imagine', artista: 'John Lennon', album: 'Imagine', año: 1971 },
    { id: 3, titulo: 'Billie Jean', artista: 'Michael Jackson', album: 'Thriller', año: 1982 }
];

// Ruta para mostrar todas las canciones
router.get('/', (req, res) => {
    res.render('canciones/index', {
        pageTitle: 'Lista de Canciones',
        path: '/canciones',
        canciones: canciones,
        hasStyles: true,
        activeCancionesLista: true
    });
});

// Ruta para mostrar el formulario de nueva canción
router.get('/agregar', (req, res) => {
    res.render('canciones/agregar', {
        pageTitle: 'Nueva Canción',
        path: '/canciones',
        editing: false,
        hasStyles: true,
        activeCancionesForm: true
    });
});

// Ruta para procesar la nueva canción
router.post('/agregar', (req, res) => {
    console.log(req.body);
    
    const nuevaCancion = {
        id: canciones.length + 1,
        titulo: req.body.titulo || 'Sin título',
        artista: req.body.artista || 'Desconocido',
        album: req.body.album || 'Sin álbum',
        año: parseInt(req.body.año) || 0
    };
    
    canciones.push(nuevaCancion);
    console.log(canciones);
    
    res.redirect('/canciones');
});

module.exports = router;