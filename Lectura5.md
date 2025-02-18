# Síntesis: Notación MER y restricciones adicionales

## Definiciones básicas

- **Modelo Entidad-Relación (MER):** Herramienta conceptual para diseñar bases de datos relacionales, representando entidades, relaciones y atributos. Fue propuesto por Peter Chen en 1976.
- **Entidad:** Objeto del mundo real con existencia propia, representado como un rectángulo en el diagrama. Ejemplos: Clientes, Productos, Empleados.
- **Relación (Asociación):** Conexión entre entidades, representada por un rombo. Ejemplos: Clientes realizan Pedidos, Empleados trabajan en Proyectos.
- **Atributo:** Característica o propiedad de una entidad o relación. Ejemplos: Nombre, Fecha, Precio.

## Problemas en el diseño de bases de datos relacionales

- **Redundancia e inconsistencia:** Datos repetidos en múltiples archivos pueden llevar a valores contradictorios.
- **Dificultad de acceso:** Consultas no previstas requieren reprogramación o manipulación manual.
- **Aislamiento de datos:** Formatos incompatibles entre archivos dificultan la integración.
- **Problemas de seguridad e integridad:** Falta de control centralizado sobre permisos y validaciones.

## Fases del diseño de bases de datos

1. **Recolección y análisis de requerimientos:** Entrevistas con usuarios para documentar necesidades de información.
2. **Diseño conceptual:** Creación de un esquema conceptual usando el modelo E-R.
3. **Diseño lógico:** Transformación del modelo conceptual al modelo de datos del SGBD (relacional, jerárquico, red).
4. **Diseño físico:** Especificación de estructuras de almacenamiento y organización de archivos.

## Elementos del Modelo ER

### Entidades

- **Definición:** Objetos del mundo real con existencia propia.
- **Representación:** Rectángulo con el nombre de la entidad.
- **Identificador:** Atributo o conjunto de atributos que identifican de manera única una entidad. Ejemplo: RFC de un cliente.

### Relaciones (Asociaciones)

- **Definición:** Conexión entre entidades, representada por un rombo.
- **Grado:** Número de entidades que participan en la relación (binaria, ternaria, etc.).
- **Cardinalidad:** Número de elementos de las entidades que se relacionan (1:1, 1:N, N:N).
- **Tipos de participación:**
  - **Opcional (parcial):** No todas las ocurrencias de una entidad están relacionadas.
  - **Obligatoria (total):** Todas las ocurrencias de una entidad deben estar relacionadas.

### Atributos

- **Definición:** Características o propiedades de entidades o relaciones.
- **Tipos:**
  - **Simples o compuestos:** Los compuestos están formados por varios atributos.
  - **Mono valuados o multivaluados:** Los multivaluados pueden tener más de un valor.
  - **Almacenados o derivados:** Los derivados se calculan a partir de otros atributos.

## Modelo ER Extendido

### Roles

- **Definición:** Se utilizan cuando una entidad juega más de un rol en una relación.
- **Ejemplo:** Una entidad "Ciudad" puede tener roles de "Origen" y "Destino" en una relación de viaje.

### Entidades generalizadoras y especializadoras (Superclase y Subclase)

- **Superclase:** Entidad general que contiene atributos comunes.
- **Subclase:** Entidad especializada con atributos particulares.
- **Relación ISA:** Relación de herencia entre superclase y subclase. Puede ser disjunta o solapada.

### Entidades fuertes y débiles

- **Entidad fuerte:** Tiene existencia propia (Ejemplo: Empleado).
- **Entidad débil:** Depende de otra entidad para existir (Ejemplo: Familiar depende de Empleado).

## Restricciones de Integridad

- **Definición:** Reglas adicionales que no se exhiben en el modelo pero son importantes para la consistencia de los datos.
- **Ejemplos:**
  - **Cotas de cardinalidad:** Límites mínimos y máximos en las relaciones.
  - **Reglas lógicas:** Condiciones que deben cumplir los atributos (Ejemplo: FechaInicial <= FechaFinal).

## Metodología para integrar un Modelo ER

1. Identificar entidades (sustantivos o agrupaciones).
2. Incorporar atributos a las entidades.
3. Determinar identificadores (valores únicos).
4. Identificar relaciones entre entidades (verbos).
5. Determinar la cardinalidad de las relaciones.
6. Incorporar atributos a las relaciones.
7. Verificar con los requerimientos y refinar el modelo.
