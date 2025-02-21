const fs = require("fs");

const { createServer } = require("node:http");

const hostname = "127.0.0.1";
const port = 3000;

function calcularPromedio(arreglo) {
  if (arreglo.length === 0) return 0; // Evitar división por cero
  const suma = arreglo.reduce((acumulador, numero) => acumulador + numero, 0);
  return suma / arreglo.length;
}

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");

  res.end(`Hello World\n`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  const numeros = [10, 20, 30, 40, 50];
  const promedio = calcularPromedio(numeros);
  console.log(`El promedio del arreglo [${numeros}] es: ${promedio}`);
});
