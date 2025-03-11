const Cancion = require('./cancion.model');
const Plataforma = require('./plataforma.model');

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
    constructor(nombre, descripcion, plataformaId, canciones = []) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.plataformaId = plataformaId;
        this.canciones = canciones;
    }

    save() {
        this.id = playlists.length + 1;
        playlists.push(this);
        return this;
    }

    static fetchAll() {
        return playlists;
    }

    static findById(id) {
        return playlists.find(playlist => playlist.id === id);
    }

       static getDetailedPlaylist(id) {
        const playlist = this.findById(id);
        
        if (!playlist) {
            return null;
        }
        
        const plataforma = Plataforma.findByName(playlist.plataformaId);
        
    
        const canciones = playlist.canciones.map(id => Cancion.findById(id)).filter(cancion => cancion);
        
        return {
            ...playlist,
            plataforma,
            canciones
        };
    }
}