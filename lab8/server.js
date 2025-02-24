const fs = require("fs");

const { createServer } = require("node:http");

const hostname = "127.0.0.1";
const port = 3000;

function calcularPromedio(arreglo) {
  if (arreglo.length === 0) return 0;
  const suma = arreglo.reduce((acumulador, numero) => acumulador + numero, 0);
  return suma / arreglo.length;
}

function escribirArchivo(nombreArchivo, contenido) {
  fs.writeFile(nombreArchivo, contenido, (err) => {
    if (err) {
      console.error("Error al escribir en el archivo:", err);
    } else {
      console.log(`El contenido ha sido escrito en ${nombreArchivo}`);
    }
  });
}

function calcularFactorial(n) {
  if (n < 0) return -1;
  if (n === 0) return 1;
  return n * calcularFactorial(n - 1);
}

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    fs.readFile("../index.html", (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Error al leer el archivo index.html");
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  const numeros = [10, 20, 30, 40, 50];
  const promedio = calcularPromedio(numeros);
  console.log(`El promedio del arreglo [${numeros}] es: ${promedio}`);
  const numero = 5;
  const factorial = calcularFactorial(numero);
  console.log(`El factorial de ${numero} es: ${factorial}`);
  const contenido = "Este es el contenido que se escribirá en el archivo.";
  escribirArchivo("output.txt", contenido);
});
