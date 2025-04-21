# Síntesis: Consultas en SQL Usando Roles y Subconsultas

## Definiciones básicas

- **Roles en SQL:** Cuando una tabla debe aparecer más de una vez en una consulta, se utilizan **alias** o **sinónimos** para diferenciar los diferentes roles que juega la tabla en la consulta.
- **Subconsultas:** Consultas anidadas dentro de otra consulta principal, utilizadas para filtrar resultados o realizar cálculos basados en los datos de la consulta principal.

## Consultas con Roles

### Ejemplo 1: Consulta con una tabla que juega múltiples roles
- **Modelo Entidad-Relación:** 
  - **Tablas:** 
    - `viajes(idviaje, idorigen, iddestino, fecha)`
    - `ciudades(idciudad, nombreciudad)`
  - **Problema:** La tabla `ciudades` debe aparecer dos veces en la consulta, una para la ciudad de origen y otra para la ciudad de destino.
- **Solución con Alias:**
  ```sql
  SELECT idviaje, origen.nombre, destino.nombre, fecha
  FROM viajes, ciudades origen, ciudades destino
  WHERE viajes.idorigen = origen.idciudad 
    AND viajes.iddestino = destino.idciudad;
  ```
- **Solución con Sinónimos:**
  ```sql
  CREATE SYNONYM origen FOR ciudades;
  CREATE SYNONYM destino FOR ciudades;

  SELECT idviaje, origen.nombre, destino.nombre, fecha
  FROM viajes, origen, destino
  WHERE viajes.idorigen = origen.idciudad 
    AND viajes.iddestino = destino.idciudad;
  ```

### Ejemplo 2: Consulta con una tabla que se referencia a sí misma
- **Tabla:** `empleados(idempleado, nombre, idjefe)`
- **Problema:** Se necesita obtener el nombre del empleado y el nombre de su jefe, donde el jefe es otro empleado.
- **Solución con Alias:**
  ```sql
  SELECT e.nombre AS empleado, j.nombre AS jefe
  FROM empleados e, empleados j
  WHERE e.idjefe = j.idempleado;
  ```
- **Solución con Sinónimos:**
  ```sql
  CREATE SYNONYM jefes FOR empleados;

  SELECT empleados.nombre AS empleado, jefes.nombre AS jefe
  FROM empleados, jefes
  WHERE empleados.idjefe = jefes.idempleado;
  ```

### Ejemplo 3: Consulta con una tabla que se referencia a sí misma para comparar datos
- **Tablas:** 
  - `ventasdiarias(idproducto, fecha, cantidad)`
  - `productos(idproducto, descripción, precio)`
- **Problema:** Calcular la diferencia en ventas de cada producto entre dos fechas diferentes.
- **Solución con Alias:**
  ```sql
  SELECT p.idproducto, p.descripcion, vprimero.cantidad - vsegundo.cantidad AS diferencia
  FROM productos p, ventasdiarias vprimero, ventasdiarias vsegundo
  WHERE p.idproducto = vprimero.idproducto 
    AND p.idproducto = vsegundo.idproducto 
    AND vprimero.fecha = '1-SEP-00' 
    AND vsegundo.fecha = '2-SEP-00';
  ```

## Subconsultas

### Ejemplo 1: Encontrar productos no vendidos
- **Tablas:** 
  - `ventasdiarias(idproducto, fecha, cantidad)`
  - `productos(idproducto, descripción, precio)`
- **Problema:** Identificar los productos que no han sido vendidos.
- **Solución con Operador `MINUS`:**
  ```sql
  (SELECT idproducto FROM productos)
  MINUS
  (SELECT idproducto FROM ventasdiarias);
  ```
- **Solución con Subconsulta y Operador `NOT IN`:**
  ```sql
  SELECT idproducto 
  FROM productos
  WHERE idproducto NOT IN (SELECT idproducto FROM ventasdiarias);
  ```
- **Solución con Subconsulta y Operador `NOT EXISTS`:**
  ```sql
  SELECT idproducto 
  FROM productos p
  WHERE NOT EXISTS (
      SELECT * 
      FROM ventasdiarias v 
      WHERE v.idproducto = p.idproducto
  );
  ```

### Ejemplo 2: Encontrar productos con ventas superiores a un monto
- **Problema:** Obtener los productos cuyas ventas totales superan 1,000,000 pesos.
- **Solución con Subconsulta:**
  ```sql
  SELECT idproducto, descripcion 
  FROM productos p
  WHERE 1000000 < (
      SELECT SUM(v.cantidad * p.precio)
      FROM ventasdiarias v
      WHERE v.idproducto = p.idproducto
  );
  ```
