// Initial in-memory storage for songs
const canciones = [
    { id: 1, titulo: 'Bohemian Rhapsody', artista: 'Queen', album: 'A Night at the Opera', año: 1975 },
    { id: 2, titulo: 'Imagine', artista: 'John Lennon', album: 'Imagine', año: 1971 },
    { id: 3, titulo: 'Billie Jean', artista: 'Michael Jackson', album: 'Thriller', año: 1982 }
];

module.exports = class Cancion {
    // Constructor for the class
    constructor(titulo, artista, album, año) {
        this.titulo = titulo;
        this.artista = artista;
        this.album = album;
        this.año = año;
    }

    // Save method to store a new song
    save() {
        this.id = canciones.length + 1;
        canciones.push(this);
        return this;
    }

    // Static method to retrieve all songs
    static fetchAll() {
        return canciones;
    }

    // Static method to find a song by ID
    static findById(id) {
        return canciones.find(cancion => cancion.id === id);
    }
}