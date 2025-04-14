const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const db = require('./util/database'); 
const multer = require('multer');


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created successfully.');
}


const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, uploadsDir); 
    },
    filename: (request, file, callback) => {
        callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    },
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype == 'image/png' || 
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('archivo'));


app.use('/uploads', (req, res, next) => {
    
    return res.status(403).render('403', { title: 'Acceso Denegado' });
});


app.get('/archivos/archivo/:id', async (req, res, next) => {
    try {
        const Archivo = require('./models/archivo.model');
        const archivo = await Archivo.findById(req.params.id);
        
        if (!archivo || !archivo.file_data) {
            return res.status(404).render('404', { title: 'Archivo no encontrado' });
        }
        
        
        res.set('Content-Type', archivo.mimetype);
       
        if (req.query.download === 'true') {
            res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(archivo.nombre)}"`);
        }
        
        
        res.send(archivo.file_data);
        
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).render('500', { 
            title: 'Error interno', 
            error: 'No se pudo obtener el archivo solicitado' 
        });
    }
});


const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

app.use(csrfProtection);

app.use(async (req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.userName = req.session.userName || null;
    res.locals.csrfToken = req.csrfToken();
    console.log('CSRF Token:', res.locals.csrfToken); 

    if (req.session.userId) {
        const [roles] = await db.query('SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?', [req.session.userId]);
        req.session.userRole = roles.length > 0 ? roles[0].name : 'guest';
    } else {
        req.session.userRole = 'guest';
    }

    next();
});

function checkPermission(role) {
    return (req, res, next) => {
        if (req.session.userRole && req.session.userRole === role) {
            next();
        } else {
            res.status(403).render('403', { title: 'Acceso Denegado' });
        }
    };
}

const rutasCanciones = require('./routes/canciones.routes');
const rutasPlataformas = require('./routes/plataformas.routes');
const rutasPlaylists = require('./routes/playlists.routes');
const rutasAuth = require('./routes/auth.routes');
const rutasArchivos = require('./routes/archivos.routes');

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

app.get('/admin', checkPermission('admin'), (req, res, next) => {
    res.render('admin', { title: 'Admin Page' });
});

app.use('/auth', rutasAuth);
app.use('/canciones', rutasCanciones);
app.use('/plataformas', rutasPlataformas);
app.use('/playlists', rutasPlaylists);
app.use('/archivos', rutasArchivos);

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
});

app.listen(3005, () => {
    console.log('Server is localhost:3000');
});