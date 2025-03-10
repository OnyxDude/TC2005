const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const rutasCanciones = require('./routes/canciones.routes');
const rutasPlataformas = require('./routes/plataformas.routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    console.log(`Solicitud: ${request.method} ${request.url}`);
    next();
});

app.get('/', (request, response, next) => {
    response.send(`
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
              <a class="text-white mr-4" href="/plataformas">Plataformas</a>
            </div>
          </div>
        </nav>
    
        <section class="container mx-auto p-4">
          <div class="text-center py-12">
            <h1 class="text-5xl font-bold mb-4 text-green-600">Bienvenido a Spopify</h1>
            <p class="text-xl mb-8">Tu plataforma personal de colección de música</p>
            
            <div class="flex flex-col md:flex-row justify-center gap-6 mt-12">
              <a href="/canciones" class="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Explorar Canciones
              </a>
              <a href="/plataformas" class="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Ver Plataformas
              </a>
            </div>
          </div>
        </section>
        
        <footer class="bg-green-600 p-4 mt-4">
          <div class="container mx-auto text-center text-white">
            <p>&copy; 2025 Spopify. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
    `);
});

app.use('/canciones', rutasCanciones);
app.use('/plataformas', rutasPlataformas);

app.use((req, res, next) => {
    res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Spopify - Página No Encontrada</title>
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
            </div>
          </div>
        </nav>
    
        <section class="container mx-auto p-4 text-center py-16">
          <h1 class="text-5xl font-bold mb-4">404</h1>
          <p class="text-2xl mb-8">Página No Encontrada</p>
          <a href="/" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Ir al Inicio</a>
        </section>
        
        <footer class="bg-green-600 p-4 mt-4 absolute bottom-0 w-full">
          <div class="container mx-auto text-center text-white">
            <p>&copy; 2025 Spopify. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
    `);
});

app.listen(3000, () => {
    console.log('Servidor de Spopify corriendo en localhost:3000');
});