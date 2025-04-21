# Síntesis: Álgebra relacional, SQL básico y funciones agregadas

## Definiciones básicas

- **SQL (Structured Query Language):** Lenguaje estándar utilizado para gestionar y manipular bases de datos relacionales. Permite realizar consultas, actualizaciones, inserciones y eliminaciones de datos.
- **Álgebra Relacional:** Conjunto de operaciones matemáticas que se aplican a relaciones (tablas) para obtener nuevas relaciones. Es la base teórica de las consultas SQL.

## Equivalencia entre Álgebra Relacional y SQL

### Consulta de una relación cualquiera
- **Álgebra Relacional:** `materiales`
- **SQL:** 
  ```sql
  SELECT * FROM materiales;
  ```

### Selección
- **Álgebra Relacional:** `SL{clave=1000}(materiales)`
- **SQL:** 
  ```sql
  SELECT * FROM materiales WHERE clave = 1000;
  ```

### Proyección
- **Álgebra Relacional:** `PR{clave, rfc, fecha}(entregan)`
- **SQL:** 
  ```sql
  SELECT clave, rfc, fecha FROM entregan;
  ```

### Reunión Natural (Natural Join)
- **Álgebra Relacional:** `entregan JN proveedores`
- **SQL:** 
  ```sql
  SELECT * FROM entregan, proveedores WHERE entregan.rfc = proveedores.rfc;
  ```

### Reunión con Criterio Específico (Theta Join)
- **Álgebra Relacional:** `entregan JN{entregan.numero <= proyectos.numero} proyectos`
- **SQL:** 
  ```sql
  SELECT * FROM entregan, proyectos WHERE entregan.numero <= proyectos.numero;
  ```

### Unión
- **Álgebra Relacional:** `SL{clave=1000}(entregan) UN SL{clave=2000}(entregan)`
- **SQL:** 
  ```sql
  (SELECT * FROM entregan WHERE clave = 1000)
  UNION
  (SELECT * FROM entregan WHERE clave = 2000);
  ```

### Intersección
- **Álgebra Relacional:** `PR{clave}(SL{numero=5001}(entregan)) IN PR{clave}(SL{numero=5018}(entregan))`
- **SQL:** 
  ```sql
  (SELECT clave FROM entregan WHERE numero = 5001)
  INTERSECT
  (SELECT clave FROM entregan WHERE numero = 5018);
  ```

### Diferencia
- **Álgebra Relacional:** `entregan - SL{clave=1000}(entregan)`
- **SQL:** 
  ```sql
  (SELECT * FROM entregan)
  MINUS
  (SELECT * FROM entregan WHERE clave = 1000);
  ```

### Producto Cartesiano
- **Álgebra Relacional:** `entregan X materiales`
- **SQL:** 
  ```sql
  SELECT * FROM entregan, materiales;
  ```

## Agregaciones en SQL

### Funciones Agregadas
- **SUM(expresión):** Suma de los valores de una expresión.
- **AVG(expresión):** Promedio de los valores de una expresión.
- **MIN(expresión):** Valor mínimo de una expresión.
- **MAX(expresión):** Valor máximo de una expresión.
- **COUNT(*):** Número de tuplas (filas) en una relación.
- **COUNT(expresión):** Número de tuplas donde la expresión no es nula.
- **STD(expresión):** Desviación estándar de los valores de una expresión.

### Ejemplos de Agregaciones
- **Cantidad vendida por producto:**
  ```sql
  SELECT codproducto, SUM(cantidad) 
  FROM ventas 
  GROUP BY codproducto;
  ```
- **Cantidad vendida por producto y fecha:**
  ```sql
  SELECT codproducto, fecha, SUM(cantidad) 
  FROM ventas 
  GROUP BY codproducto, fecha;
  ```
- **Ventas por cliente y fecha con condiciones:**
  ```sql
  SELECT nocliente, fecha, SUM(cantidad), SUM(precioventa * cantidad), AVG(cantidad), MIN(precioventa), MAX(precioventa)
  FROM ventas
  GROUP BY nocliente, fecha
  HAVING SUM(precioventa * cantidad) > 200;
  ```

## JOINs en SQL

### INNER JOIN
- **Sintaxis:**
  ```sql
  SELECT campos 
  FROM tabla1 
  INNER JOIN tabla2 
  ON tabla1.campo1 = tabla2.campo2;
  ```
- **Ejemplo:**
  ```sql
  SELECT NombreCategoria, NombreProducto 
  FROM Categorias 
  INNER JOIN Productos 
  ON Categorias.IDCategoria = Productos.IDCategoria;
  ```

### LEFT JOIN y RIGHT JOIN
- **LEFT JOIN:** Incluye todos los registros de la tabla izquierda, incluso si no hay coincidencias en la tabla derecha.
- **RIGHT JOIN:** Incluye todos los registros de la tabla derecha, incluso si no hay coincidencias en la tabla izquierda.
- **Ejemplo de LEFT JOIN:**
  ```sql
  SELECT Facturas.*, Albaranes.* 
  FROM Facturas 
  LEFT JOIN Albaranes 
  ON Facturas.IdAlbaran = Albaranes.IdAlbaran;
  ```

### Autocombinación (Self Join)
- **Ejemplo:**
  ```sql
  SELECT t.num_emp, t.nombre, t.puesto, t.num_sup, s.nombre, s.puesto
  FROM empleados AS t, empleados AS s
  WHERE t.num_sup = s.num_emp;
  ```

### Combinaciones no Comunes
- **Ejemplo:**
  ```sql
  SELECT grados.grado, empleados.nombre, empleados.salario, empleados.puesto
  FROM empleados, grados
  WHERE empleados.salario BETWEEN grados.salarioinferior AND grados.salariosuperior
  ORDER BY grados.grado, empleados.salario;
  ```

### CROSS JOIN
- **Ejemplo:**
  ```sql
  SELECT Autores.Nombre, Libros.Titulo 
  FROM Autores 
  CROSS JOIN Libros;
  ```