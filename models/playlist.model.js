const Cancion = require('./cancion.model');
const Plataforma = require('./plataforma.model');

// Initial in-memory storage for playlists
const playlists = [
    { 
        id: 1, 
        nombre: 'Éxitos de los 80s', 
        descripcion: 'Los mejores hits de la década de los 80s',
        plataformaId: 'Spotify',
        canciones: [2, 3] 
    }
];

module.exports = class Playlist {
    // Constructor for the class
    constructor(nombre, descripcion, plataformaId, canciones = []) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.plataformaId = plataformaId;
        this.canciones = canciones;
    }

    // Save method to store a new playlist
    save() {
        this.id = playlists.length + 1;
        playlists.push(this);
        return this;
    }

    // Static method to retrieve all playlists
    static fetchAll() {
        return playlists;
    }

    // Static method to find a playlist by ID
    static findById(id) {
        return playlists.find(playlist => playlist.id === id);
    }

    // Static method to get detailed playlist information including song and platform details
    static getDetailedPlaylist(id) {
        const playlist = this.findById(id);
        
        if (!playlist) {
            return null;
        }
        
        // Get the platform details
        const plataforma = Plataforma.findByName(playlist.plataformaId);
        
        // Get the songs details
        const canciones = playlist.canciones.map(id => Cancion.findById(id)).filter(cancion => cancion);
        
        return {
            ...playlist,
            plataforma,
            canciones
        };
    }
}