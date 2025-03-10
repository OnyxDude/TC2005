const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', 'views');

// Configurar carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const rutasCanciones = require('./routes/canciones.routes');
const rutasPlataformas = require('./routes/plataformas.routes');

app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response, next) => {
    console.log(`Solicitud: ${request.method} ${request.url}`);
    next();
});

app.get('/', (request, response, next) => {
    response.render('index', { title: 'Inicio' });
});

app.use('/canciones', rutasCanciones);
app.use('/plataformas', rutasPlataformas);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
});

app.listen(3000, () => {
    console.log('Server is localhost:3000');
});