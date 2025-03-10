# Síntesis: Reglas de traslado MER a MR

## Definiciones básicas

- **Modelo Relacional (MR):** Representación de datos en forma de tablas, donde cada tabla corresponde a una entidad o relación del Modelo Entidad-Relación (MER).
- **Llave primaria:** Columna o conjunto de columnas que identifican de manera única cada fila en una tabla.
- **Cardinalidad:** Define la relación entre entidades en términos de cuántas instancias de una entidad están asociadas con instancias de otra entidad (1:1, 1:N, N:N).

## Procedimiento de transferencia del MER a tablas

### 1. Entidades a tablas
- **Regla:** Por cada entidad en el MER, se define una tabla con el mismo nombre. Las columnas de la tabla corresponden a los atributos de la entidad.
- **Llave primaria:** El identificador de la entidad se convierte en la llave primaria de la tabla. Si no existe un identificador natural, se crea una llave primaria artificial (por ejemplo, un número único).
- **Ejemplo:**  
  Entidad: **Cliente**(ID, Nombre, Dirección)  
  Tabla: **Cliente(ID, Nombre, Dirección)**

### 2. Relaciones N:N a tablas
- **Regla:** Por cada relación con cardinalidad N:N, se crea una nueva tabla. Esta tabla incluye las llaves primarias de las entidades participantes y los atributos de la relación.
- **Llave primaria:** La llave primaria de la nueva tabla es la concatenación de las llaves primarias de las entidades relacionadas.
- **Ejemplo:**  
  Relación: **Compra**(ClienteID, ProductoID, Fecha, Cantidad)  
  Tabla: **Compra(ClienteID, ProductoID, Fecha, Cantidad)**

### 3. Relaciones 1:N a tablas
- **Regla:** Para relaciones con cardinalidad 1:N, se agrega la llave primaria de la entidad del lado "1" a la tabla de la entidad del lado "N".
- **Ejemplo:**  
  Relación: **Departamento**(1) - **Empleado**(N)  
  Tabla: **Empleado**(EmpleadoID, Nombre, DepartamentoID)

### 4. Relaciones 1:1 a tablas
- **Regla:** Para relaciones con cardinalidad 1:1, se agrega la llave primaria de una entidad a la tabla de la otra entidad. No importa el orden.
- **Ejemplo:**  
  Relación: **Persona**(1) - **Pasaporte**(1)  
  Tabla: **Pasaporte**(PasaporteID, Número, PersonaID)

## Reglas para elementos adicionales del MER

### Relaciones ISA (Superclase y Subclase)
- **Regla:** Las relaciones ISA son 1:1. La llave primaria de la superclase se hereda a las subclases.
- **Ejemplo:**  
  Superclase: **Empleado**(EmpleadoID, Nombre)  
  Subclase: **Honorarios**(EmpleadoID, RFC)  
  Subclase: **Planta**(EmpleadoID, NoIMSS)

### Entidades fuertes y débiles
- **Regla:** Las entidades débiles heredan la llave primaria de la entidad fuerte. La llave primaria de la entidad débil incluye la llave primaria de la entidad fuerte más un atributo que distingue las tuplas.
- **Ejemplo:**  
  Entidad fuerte: **Empleado**(EmpleadoID, Nombre)  
  Entidad débil: **Familiar**(EmpleadoID, FamiliarID, Nombre)

### Roles en relaciones reflexivas
- **Regla:** En relaciones reflexivas (una entidad relacionada consigo misma) o múltiples relaciones entre la misma pareja de entidades, se utilizan roles para nombrar las columnas heredadas.
- **Ejemplo:**  
  Entidad: **Empleado**(EmpleadoID, Nombre)  
  Relación: **Supervisa**(EmpleadoID, SupervisorID)  
  Tabla: **Supervisa**(EmpleadoID, SupervisorID)

## Ejemplo de traslado completo

### MER:
- Entidades: **A**(a1, a2, a3), **B**(b1, b2), **C**(c1, c2, c3, c4)
- Relaciones: **X**(A, C) con cardinalidad N:N, **Y**(A, B) con cardinalidad 1:N

### MR resultante:
- **A**(a1, a2, a3)
- **B**(b1, b2, a1)
- **C**(c1, c2, c3, c4)
- **X**(a1, c1, x1, x2)