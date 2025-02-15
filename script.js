// ----------------------- FUNCION 1 --------------------- //
// --------- Tabla de números, cuadrados y cubos --------- //
// ------------------------------------------------------- //
function tablaCuadradosCubos() {
  const num = parseInt(prompt("Introduce un número:"));
  if (isNaN(num)) {
    alert("Por favor, ingresa un número válido.");
    return;
  }
  document.write("<h2>Tabla de cuadrados y cubos</h2>");
  document.write(
    "<table border='1'><tr><th>Número</th><th>Cuadrado</th><th>Cubo</th></tr>"
  );
  for (let i = 1; i <= num; i++) {
    document.write(
      `<tr><td>${i}</td><td>${i ** 2}</td><td>${i ** 3}</td></tr>`
    );
  }
  document.write("</table>");
}

// ---------------------- FUNCION 2 ---------------------- //
// --------- Suma aleatoria y tiempo de respuesta -------- //
// ------------------------------------------------------- //
function sumaAleatoria() {
  const num1 = Math.floor(Math.random() * 100);
  const num2 = Math.floor(Math.random() * 100);
  const inicio = Date.now();
  const respuesta = parseInt(prompt(`¿Cuánto es ${num1} + ${num2}?`));
  const fin = Date.now();
  const tiempo = (fin - inicio) / 1000;

  if (respuesta === num1 + num2) {
    alert(`¡Correcto! Tardaste ${tiempo} segundos.`);
  } else {
    alert(
      `Incorrecto. La respuesta correcta era ${
        num1 + num2
      }. Tardaste ${tiempo} segundos.`
    );
  }
}

// ---------------------- FUNCION 3 ---------------------- //
// -- Contador de números negativos, ceros y positivos --- //
// ------------------------------------------------------- //
function contador(arr) {
  let negativos = 0;
  let ceros = 0;
  let positivos = 0;

  arr.forEach((num) => {
    if (num < 0) negativos++;
    else if (num === 0) ceros++;
    else positivos++;
  });

  return `Arreglo: ${arr}\nNegativos: ${negativos}, Ceros: ${ceros}, Positivos: ${positivos}`;
}

// ---------------------- FUNCION 4 ---------------------- //
// ---------------- Promedios de una matriz -------------- //
// ------------------------------------------------------- //
function promedios(matriz) {
  const promedios = matriz.map(
    (fila) => fila.reduce((acc, n) => acc + n, 0) / fila.length
  );
  return `Matriz: ${JSON.stringify(matriz)}\nPromedios: ${promedios}`;
}

// ---------------------- FUNCION 5 ---------------------- //
// ----------------- Inverso de un número ---------------- //
// ------------------------------------------------------- //
function inverso(num) {
  const inversoNum = parseInt(num.toString().split("").reverse().join(""));
  return `Número: ${num}\nInverso: ${inversoNum}`;
}

// ---------------------- FUNCION 6 ---------------------- //
// -------------------- personalizado -------------------- //
// ------------------------------------------------------- //
function mayorDeEdad(edad) {
  class Usuario {
    constructor(nombre, edad) {
      this.nombre = nombre;
      this.edad = edad;
    }
    mostrarInfo() {
      return `Usuario: ${this.nombre}, Edad: ${this.edad}`;
    }
    esMayorDeEdad() {
      return this.edad >= 18 ? "Es mayor de edad." : "NO es mayor de edad.";
    }
  }
  let usuario = new Usuario("Carlos", edad);
  return usuario.mostrarInfo() + "\n" + usuario.esMayorDeEdad();
}
