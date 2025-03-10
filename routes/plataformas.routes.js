const express = require('express');
const router = express.Router();
const fs = require('fs');

const html_header = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Spopify - Plataformas</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body>
    <nav class="bg-green-600 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a class="text-white text-2xl font-bold" href="/">Spopify</a>
        <div>
          <a class="text-white mr-4" href="/">Inicio</a>
          <a class="text-white mr-4" href="/canciones">Canciones</a>
          <a class="text-white mr-4" href="/plataformas">Plataformas</a>
          <a class="text-white bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded" href="/plataformas/agregar">Agregar Plataforma</a>
        </div>
      </div>
    </nav>

    <section class="container mx-auto p-4">`;

const html_content_form = `<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form action="/plataformas/agregar" method="POST">
          <div class="mb-4">
            <label for="nombre" class="block text-gray-700 text-sm font-bold mb-2">Nombre de la Plataforma</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Nombre de la Plataforma"
              id="nombre"
              name="nombre"
            />
          </div>
          <div class="mb-4">
            <label for="url" class="block text-gray-700 text-sm font-bold mb-2">URL</label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="https://ejemplo.com"
              id="url"
              name="url"
            />
          </div>
          <div class="flex items-center justify-between">
            <input type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" value="Agregar Plataforma">
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

const plataformas = [];

// Load platforms from the text file
fs.readFile('plataformas.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file', err);
        return;
    }
    data.split('\n').forEach((line) => {
        if (line.trim()) {
            const [nombre, url] = line.split('|');
            plataformas.push({ nombre: nombre.trim(), url: url ? url.trim() : '#' });
        }
    });
});

router.get('/', (request, response, next) => {
    let html = html_header + `<h1 class="text-3xl font-bold mb-4">Plataformas de Música</h1>`;
    
    if (plataformas.length === 0) {
        html += `<p class="text-gray-600">Aún no se han agregado plataformas. ¡Agrega tu primera plataforma!</p>`;
    } else {
        html += `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">`;
        
        plataformas.forEach((plataforma) => {
            html += `
            <div class="bg-white shadow-md rounded px-6 py-4 hover:shadow-lg transition duration-300">
              <h2 class="text-xl font-bold text-green-600">${plataforma.nombre}</h2>
              <span target="_blank">${plataforma.url}</span>
            </div>`;
        });
        
        html += `</div>`;
    }
    
    html += html_footer;
    response.send(html);
});

router.get('/agregar', (request, response, next) => {
    let html = html_header + `<h1 class="text-3xl font-bold mb-4">Agregar una Nueva Plataforma</h1>` + html_content_form + html_footer;
    response.send(html);
});

router.post('/agregar', (request, response, next) => {
    console.log(request.body);
    const nombre = request.body.nombre;
    const url = request.body.url || '#';
    
    plataformas.push({ nombre, url });
    console.log(plataformas);

    // Save the platform data to a text file
    fs.appendFile('plataformas.txt', `${nombre}|${url}\n`, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            response.status(500).send('Internal Server Error');
            return;
        }
    });

    response.redirect('/plataformas/');
});

module.exports = router;