# Síntesis: Álgebra relacional, SQL básico y funciones agregadas

## Definiciones básicas

- **INNER JOIN:** Combina registros de dos tablas basándose en la igualdad de valores en un campo común. Solo se incluyen los registros que tienen coincidencias en ambas tablas.
- **LEFT JOIN (LEFT OUTER JOIN):** Incluye todos los registros de la tabla izquierda y los registros coincidentes de la tabla derecha. Si no hay coincidencias, se incluyen valores nulos para la tabla derecha.
- **RIGHT JOIN (RIGHT OUTER JOIN):** Incluye todos los registros de la tabla derecha y los registros coincidentes de la tabla izquierda. Si no hay coincidencias, se incluyen valores nulos para la tabla izquierda.
- **CROSS JOIN:** Realiza un producto cartesiano entre dos tablas, combinando cada fila de la primera tabla con cada fila de la segunda tabla.
- **SELF JOIN:** Combina una tabla consigo misma, comparando valores de dos columnas con el mismo tipo de datos.

## Sintaxis básica de JOINs

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
- **Sintaxis LEFT JOIN:**
  ```sql
  SELECT campos 
  FROM tabla1 
  LEFT JOIN tabla2 
  ON tabla1.campo1 = tabla2.campo2;
  ```
- **Sintaxis RIGHT JOIN:**
  ```sql
  SELECT campos 
  FROM tabla1 
  RIGHT JOIN tabla2 
  ON tabla1.campo1 = tabla2.campo2;
  ```

### CROSS JOIN
- **Sintaxis:**
  ```sql
  SELECT campos 
  FROM tabla1 
  CROSS JOIN tabla2;
  ```
- **Ejemplo:**
  ```sql
  SELECT Autores.Nombre, Libros.Titulo 
  FROM Autores 
  CROSS JOIN Libros;
  ```

### SELF JOIN
- **Sintaxis:**
  ```sql
  SELECT alias1.columna, alias2.columna 
  FROM tabla AS alias1, tabla AS alias2 
  WHERE alias1.campo = alias2.campo;
  ```
- **Ejemplo:**
  ```sql
  SELECT t.num_emp, t.nombre, t.puesto, s.nombre AS Supervisor 
  FROM empleados AS t, empleados AS s 
  WHERE t.num_sup = s.num_emp;
  ```

## Combinaciones no comunes

- **BETWEEN:** Combina registros basándose en un rango de valores.
  ```sql
  SELECT grados.grado, empleados.nombre, empleados.salario 
  FROM empleados, grados 
  WHERE empleados.salario BETWEEN grados.salarioinferior AND grados.salariosuperior;
  ```

- **GROUP BY y AVG:** Agrupa registros y calcula el promedio.
  ```sql
  SELECT grados.grado, AVG(empleados.salario) 
  FROM empleados, grados 
  WHERE empleados.salario BETWEEN grados.salarioinferior AND grados.salariosuperior 
  GROUP BY grados.grado;
  ```

## Consultas de Autocombinación (SELF JOIN)

- **Ejemplo 1:** Obtener parejas de autores para cada libro.
  ```sql
  SELECT A.Codigo, A.Autor, B.Autor 
  FROM Autores A, Autores B 
  WHERE A.Codigo = B.Codigo AND A.Autor < B.Autor;
  ```

- **Ejemplo 2:** Obtener el nombre del empleado y su jefe.
  ```sql
  SELECT Emple.Nombre, Jefes.Nombre 
  FROM Empleados Emple, Empleados Jefes 
  WHERE Emple.SuJefe = Jefes.Id;
  ```