const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const { createServer } = require("node:http");

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {

   const html_header =`
    <!DOCTYPE html>
     <html>
      <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>Lab 10</title>
      </head>
      <body>
       <nav style="margin-bottom: 20px;">
            <a href="/"><button>Inicio</button></a>
            <a href="/about"><button>Acerca de</button></a>
            <a href="/contact"><button>Contacto</button></a>
       </nav>
    `;

    const html_footer = `
    </div>
     </section>
      <footer class="footer">
       <div class="content has-text-centered">
        <p>Leonardo Cervantes Perez - A07184003</p>
       </div>
      </footer>
     </body>
    </html>
    `;

    const form = `
    <form method="POST" action="/contact">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <br>
        <button type="submit">Enviar</button>
    </form>
    `;

    if (req.method === "GET" && req.url === "/") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(html_header + `<h1>Pagina de inicio</h1>` + html_footer);
        res.end();
      } else if (req.method === "GET" && req.url === "/about") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(html_header + `<h1>Acerca de nosotros</h1>` + html_footer);
        res.end();
      } else if (req.method === "GET" && req.url === "/contact") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(html_header + `<h1>Contacto</h1>` + form + html_footer);
        res.end();
      } else if (req.method === "POST" && req.url === "/contact") {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const postData = querystring.parse(body);
            const dataToSave = `Nombre: ${postData.name}, Email: ${postData.email}\n`;

            fs.appendFile('contactos.txt', dataToSave, err => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/html');
                    res.write('Error al guardar los datos.');
                    res.end();
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    res.write(html_header + ` <h1>Datos recibidos y guardados correctamente.</h1>
                        <a href="/contact"><button>Volver al formulario</button></a>` + html_footer);
                    res.end();
                }
            });
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.write(html_header + "La pagina no existe" + html_footer);
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});