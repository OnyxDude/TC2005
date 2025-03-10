const express = require('express');
const fs = require('fs');

const router = express.Router();

const html_header = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Spopify</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body>
    <nav class="bg-green-600 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a class="text-white text-2xl font-bold" href="/">Spopify</a>
        <div>
          <a class="text-white mr-4" href="/">Inicio</a>
          <a class="text-white mr-4" href="/canciones">Canciones</a>
          <a class="text-white bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded" href="/canciones/agregar">Agregar Canción</a>
        </div>
      </div>
    </nav>

    <section class="container mx-auto p-4">`;

const html_content_form = `<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form action="/canciones/agregar" method="POST">
          <div class="mb-4">
            <label for="nombre" class="block text-gray-700 text-sm font-bold mb-2">Nombre de la Canción</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Nombre de la Canción"
              id="nombre"
              name="nombre"
            />
          </div>
          <div class="mb-4">
            <label for="artista" class="block text-gray-700 text-sm font-bold mb-2">Artista</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Nombre del Artista"
              id="artista"
              name="artista"
            />
          </div>
          <div class="flex items-center justify-between">
            <input type="submit" id="boton_cancion" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="Agregar Canción">
          </div>
        </form>
      </div>`;

const html_footer = `</section>
    <footer class="bg-green-600 p-4 mt-4">
      <div class="container mx-auto text-center text-white">
        <p>&copy; 2025 Spopify. Todos los derechos reservados.</p>
      </div>
    </footer>
  </body>
</html>
`;

const canciones = [];

// Cargar canciones desde el archivo de texto
fs.readFile('canciones.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo', err);
        return;
    }
    data.split('\n').forEach((line) => {
        if (line.trim()) {
            const [nombre, artista] = line.split('|');
            canciones.push({ nombre: nombre.trim(), artista: artista ? artista.trim() : 'Artista Desconocido' });
        }
    });
});

router.get('/', (request, response, next) => {
    let html = html_header + `<h1 class="text-3xl font-bold mb-4">Tu Colección de Canciones</h1>`;
    
    canciones.forEach((cancion, index) => {
        html += `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 hover:shadow-lg transition duration-300">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-xl font-bold text-green-600">${cancion.nombre}</span>
              <p class="text-gray-600">${cancion.artista}</p>
            </div>
            <div class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </div>
          </div>
        </div>`;
    });
    
    html += html_footer;
    response.send(html);
});

router.get('/agregar', (request, response, next) => {
    let html = html_header + `<h1 class="text-3xl font-bold mb-4">Agregar una Nueva Canción</h1>` + html_content_form + html_footer;
    response.send(html);
});

router.post('/agregar', (request, response, next) => {
    console.log(request.body);
    const nombre = request.body.nombre;
    const artista = request.body.artista || 'Artista Desconocido';
    
    canciones.push({ nombre, artista });
    console.log(canciones);

    // Guardar los datos de la canción en un archivo de texto
    fs.appendFile('canciones.txt', `${nombre}|${artista}\n`, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo', err);
            response.status(500).send('Error Interno del Servidor');
            return;
        }
    });

    response.redirect('/canciones/');
});

module.exports = router;