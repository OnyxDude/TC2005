# Síntesis: Normalización de Bases de Datos

## Definiciones básicas
- **Normalización:** Proceso de organizar datos en una base de datos para reducir redundancias y mejorar la integridad de los datos.
- **Formas Normales:** Conjunto de reglas que definen cómo deben estructurarse las tablas para evitar anomalías en los datos (1FN, 2FN, 3FN, FNBC, 4FN, 5FN).

## Razones para Normalizar

1. **Estructurar datos:** Representar relaciones entre datos de manera clara.
2. **Facilitar consultas:** Simplificar la recuperación de datos.
3. **Simplificar mantenimiento:** Hacer más eficientes las operaciones de inserción, actualización y eliminación.
4. **Reducir reestructuraciones:** Minimizar cambios futuros en el esquema de la base de datos.

## Formas Normales

### Primera Forma Normal (1FN)
- **Definición:** Una tabla está en 1FN si:
  - Cada celda contiene valores atómicos (únicos, no repetidos).
  - Todas las columnas tienen el mismo tipo de dato.
  - No hay filas duplicadas.
- **Ejemplo:**
  ```plaintext
  Alumno (Control, Nombre, Esp)
  Materia (Clave, NomM, Creditos)
  ```

### Segunda Forma Normal (2FN)
- **Definición:** Una tabla está en 2FN si:
  - Está en 1FN.
  - Todos los atributos no clave dependen completamente de la llave primaria.
- **Ejemplo:**
  - **Tabla no normalizada:** `Alumno_Materia (Control, Nombre, Clave, NomM, Creditos)`
  - **Normalizada:**
    ```plaintext
    Alumno (Control, Nombre)
    Materia (Clave, NomM, Creditos)
    Cursa (Control, Clave)
    ```

### Tercera Forma Normal (3FN)
- **Definición:** Una tabla está en 3FN si:
  - Está en 2FN.
  - No hay dependencias transitivas (atributos no clave que dependen de otros atributos no clave).
- **Ejemplo:**
  - **Tabla con dependencia transitiva:** `Alumno (Control, Nombre, RFC, Necono)`
  - **Normalizada:**
    ```plaintext
    Alumno (Control, Nombre, RFC)
    Maestro (Necono, Nombre)
    ```

### Forma Normal de Boyce-Codd (FNBC)
- **Definición:** Una tabla está en FNBC si:
  - Está en 3FN.
  - Todos los determinantes (atributos que determinan otros) son llaves candidatas.
- **Ejemplo:**
  - **Tabla no normalizada:** `Alumno (Control, Esp, Nombre)` (si `Control` y `Esp` pueden determinar `Nombre`).
  - **Normalizada:** Agrupar llaves candidatas para eliminar redundancias.

### Cuarta Forma Normal (4FN)
- **Definición:** Una tabla está en 4FN si:
  - Está en FNBC.
  - No hay dependencias de valores múltiples no triviales.
- **Ejemplo:**
  - **Tabla con redundancia:** `Estudiante (Clave, Especialidad, Curso)`
  - **Normalizada:**
    ```plaintext
    Especialidad (Clave, Especialidad)
    Curso (Clave, Curso)
    ```

### Quinta Forma Normal (5FN)
- **Definición:** Una tabla está en 5FN si:
  - Está en 4FN.
  - No hay dependencias de producto no triviales (evita pérdida de información al descomponer tablas).
- **Ejemplo:** Tablas con relaciones complejas que requieren descomposición sin pérdida de información.

## Beneficios de la Normalización

1. **Reduce redundancia:** Elimina datos duplicados.
2. **Mejora integridad:** Evita inconsistencias en los datos.
3. **Facilita mantenimiento:** Simplifica actualizaciones y eliminaciones.
4. **Optimiza consultas:** Mejora el rendimiento en operaciones de lectura.
