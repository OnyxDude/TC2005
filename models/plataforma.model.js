// Initial in-memory storage for platforms
const plataformas = [
    { nombre: 'Spotify', url: 'https://spotify.com' },
    { nombre: 'Apple Music', url: 'https://music.apple.com' },
    { nombre: 'YouTube Music', url: 'https://music.youtube.com' }
];

module.exports = class Plataforma {
    // Constructor for the class
    constructor(nombre, url) {
        this.nombre = nombre;
        this.url = url;
    }

    // Save method to store a new platform
    save() {
        plataformas.push(this);
        return this;
    }

    // Static method to retrieve all platforms
    static fetchAll() {
        return plataformas;
    }

    // Static method to find a platform by name
    static findByName(nombre) {
        return plataformas.find(plataforma => plataforma.nombre === nombre);
    }
}