# Síntesis: Modelo Relacional y Álgebra Relacional 

## Definiciones básicas

- **Modelo Relacional:** Propuesto por Edgar F. Codd en 1970, es un modelo de datos basado en la teoría de conjuntos y relaciones, donde los datos se estructuran en tablas (relaciones). Su objetivo principal es mantener la independencia entre la estructura lógica de los datos y su almacenamiento físico.
- **Relación (Tabla):** Estructura fundamental del modelo relacional, compuesta por tuplas (filas) y atributos (columnas). Cada relación es un subconjunto del producto cartesiano de dominios.
- **Dominio:** Conjunto de valores homogéneos y atómicos (indivisibles) que definen el tipo de datos para un atributo. Ejemplo: Dominio "Nacionalidades" = {España, Francia, EE.UU.}.
- **Atributo:** Rol que juega un dominio en una relación. Ejemplo: En la relación **AUTOR**, "NOMBRE" es un atributo definido sobre el dominio "Nombres".

## Objetivos del Modelo Relacional

1. **Independencia física:** El almacenamiento físico de los datos no afecta su manipulación lógica.
2. **Independencia lógica:** Cambios en la estructura de la base de datos no afectan a los programas o usuarios.
3. **Flexibilidad:** Los datos pueden presentarse de acuerdo con las preferencias del usuario.
4. **Uniformidad:** Las estructuras lógicas de los datos son consistentes y fáciles de manipular.
5. **Sencillez:** El modelo es fácil de entender y utilizar, con lenguajes de consulta simples como SQL.

## Componentes del Modelo Relacional

### Relación (Tabla)
- **Intensión (Esquema):** Define la estructura de la relación, incluyendo los atributos y sus dominios. Ejemplo: **AUTOR(NOMBRE:Nombres, NACIONALIDAD:Nacionalidades)**.
- **Extensión (Instancia):** Conjunto de tuplas que conforman la relación en un momento dado. Ejemplo:
  ```
  AUTOR
  NOMBRE    NACIONALIDAD
  Pepe      España
  John      EE.UU.
  Pierre    Francia
  ```

### Llaves
- **Llave Primaria:** Atributo o conjunto de atributos que identifican de manera única cada tupla en una relación. Ejemplo: En la relación **Empleados**, la columna **EmpleadoID** es la llave primaria.
- **Llave Compuesta:** Llave formada por dos o más atributos. Ejemplo: En la relación **Vuelos**, la llave primaria es compuesta: **(NúmeroVuelo, Fecha)**.
- **Llave Foránea:** Atributo en una relación que referencia la llave primaria de otra relación. Ejemplo: En la relación **Empleados**, **DepartamentoID** es una llave foránea que referencia la llave primaria de la relación **Departamentos**.

### Restricciones
- **Restricciones Inherentes:** Derivadas de la definición matemática de relación, como la unicidad de las tuplas y la prohibición de valores nulos en la llave primaria.
- **Restricciones de Usuario:** Definidas por el usuario para garantizar la integridad de los datos. Ejemplo: **Integridad Referencial**, que asegura que los valores de una llave foránea coincidan con los de la llave primaria referenciada.

## Dinámica del Modelo Relacional

### Álgebra Relacional
- **Operadores Básicos:** Incluyen operaciones como **Unión**, **Intersección**, **Diferencia**, **Proyección**, **Selección**, **Join Natural**, **Theta-Join**, y **Producto Cartesiano**.
- **Ejemplo de Operador Proyección:** Extrae columnas específicas de una relación. Ejemplo: Proyectar **NOMBRE** y **NACIONALIDAD** de la relación **AUTOR**.
- **Ejemplo de Operador Selección:** Filtra tuplas que cumplen una condición. Ejemplo: Seleccionar autores de nacionalidad "España" de la relación **AUTOR**.

### Lenguajes Relacionales
- **Álgebra Relacional:** Basado en operaciones que toman relaciones como entrada y producen relaciones como salida.
- **Cálculo Relacional:** Basado en predicados que definen conjuntos de tuplas sin especificar operaciones explícitas.

## Valores Nulos
- **Definición:** Representan información desconocida o inaplicable. Ejemplo: Un atributo **Editorial** en la relación **LIBRO** puede ser nulo si no se conoce la editorial.
- **Uso:** Permiten manejar situaciones donde ciertos atributos no tienen valor en algunas tuplas.

## Arquitectura ANSI y el Modelo Relacional
- **Esquema Conceptual:** Define las relaciones, dominios, llaves y restricciones.
- **Esquema Externo:** Representado por **Vistas**, que son tablas virtuales definidas sobre tablas base.
- **Esquema Interno:** No especificado por el modelo relacional, ya que este es un modelo lógico.