const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const session = require('express-session');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(session({
    secret: 'mi_string_secreto_spopify_2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection); 

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.userName = req.session.userName || null;
    res.locals.csrfToken = req.csrfToken();
    next();
});

const rutasCanciones = require('./routes/canciones.routes');
const rutasPlataformas = require('./routes/plataformas.routes');
const rutasPlaylists = require('./routes/playlists.routes');
const rutasAuth = require('./routes/auth.routes');

app.use((request, response, next) => {
    console.log(`Solicitud: ${request.method} ${request.url}`);
    next();
});

app.get('/', (request, response, next) => {
    response.cookie('lastVisit', new Date().toISOString(), {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
    });
    
    response.render('index', { 
        title: 'Inicio',
        lastVisit: request.cookies.lastVisit || 'Primera visita'
    });
});

app.use('/auth', rutasAuth);
app.use('/canciones', rutasCanciones);
app.use('/plataformas', rutasPlataformas);
app.use('/playlists', rutasPlaylists);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
});

app.listen(3000, () => {
    console.log('Server is localhost:3000');
});