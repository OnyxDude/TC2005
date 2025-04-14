const fs = require('fs');
const path = require('path');
const Archivo = require('../models/archivo.model');

exports.getIndex = (req, res, next) => {
    res.render('archivos/index', {
        title: 'Manejo de Archivos',
        csrfToken: req.csrfToken(),
    });
};

exports.getSubirArchivo = (req, res, next) => {
    res.render('archivos/subir', {
        title: 'Subir Archivo',
        error: null,
        csrfToken: req.csrfToken(),
    });
};

exports.postSubirArchivo = async (req, res, next) => {
    try {
        // Verificar si se subió un archivo
        if (!req.file) {
            return res.render('archivos/subir', {
                title: 'Subir Archivo',
                error: 'Por favor selecciona una imagen válida (PNG, JPG o JPEG)',
                csrfToken: req.csrfToken(),
            });
        }

        const fileData = fs.readFileSync(req.file.path);
        
        // Guardar el archivo en la base de datos
        const archivo = new Archivo(
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            req.session.userId || 1,
            fileData  // Archivo binario
        );
        

        fs.unlinkSync(req.file.path);
        
        const savedArchivo = await archivo.save();
        
        res.render('archivos/exito', {
            title: 'Archivo Subido',
            archivo: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            },
            archivo_id: savedArchivo.id,
            csrfToken: req.csrfToken(),
        });
        
    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).render('archivos/subir', {
            title: 'Subir Archivo',
            error: 'Ocurrió un error al subir el archivo: ' + error.message,
            csrfToken: req.csrfToken(),
        });
    }
};

exports.getListaArchivos = async (req, res, next) => {
    try {
        const archivos = await Archivo.fetchAll();
        

        const archivosParaVista = archivos.map(archivo => ({
            id: archivo.id,
            nombre: archivo.nombre,
            fecha: archivo.created_at,
            mimetype: archivo.mimetype,
            size: archivo.size
        }));
        
        res.render('archivos/lista', {
            title: 'Lista de Archivos',
            archivos: archivosParaVista,
            error: null,
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        res.status(500).render('archivos/lista', {
            title: 'Lista de Archivos',
            error: 'Error al obtener la lista de archivos',
            archivos: [],
            csrfToken: req.csrfToken(),
        });
    }
};


exports.getArchivo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const archivo = await Archivo.findById(id);
        
        if (!archivo || !archivo.file_data) {
            return res.status(404).render('404', { 
                title: 'Archivo no encontrado'
            });
        }
        
    
        res.set('Content-Type', archivo.mimetype);

        if (req.query.download === 'true') {
            res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(archivo.nombre)}"`);
        }
        

        res.send(archivo.file_data);
        
    } catch (error) {
        console.error('Error al obtener archivo:', error);
        res.status(500).render('500', { 
            title: 'Error del Servidor',
            error: 'No se pudo obtener el archivo solicitado.'
        });
    }
};

exports.getEliminarArchivo = async (req, res, next) => {
    try {
        const archivoId = req.params.id;
        
        
        await Archivo.deleteById(archivoId);
        
        res.redirect('/archivos/lista');
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        res.status(500).render('archivos/lista', {
            title: 'Lista de Archivos',
            error: 'Error al eliminar el archivo',
            archivos: await Archivo.fetchAll().map(archivo => ({
                id: archivo.id,
                nombre: archivo.nombre,
                fecha: archivo.created_at,
                mimetype: archivo.mimetype,
                size: archivo.size
            })),
            csrfToken: req.csrfToken(),
        });
    }
};
