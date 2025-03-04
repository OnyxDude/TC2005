# Síntesis: Diagramas de secuencia

## Definiciones básicas

- **Diagrama de Interacción:** Representación gráfica que muestra la interacción entre objetos, sus relaciones y los mensajes que intercambian.
- **Diagrama de Secuencia:** Tipo de diagrama de interacción que destaca el **orden temporal** de los mensajes entre objetos. Se compone de dos dimensiones: temporal (eje vertical) e instancias (eje horizontal).
- **Diagrama de Colaboración:** Tipo de diagrama de interacción que destaca la **organización estructural** de los objetos y sus relaciones, representado como una colección de nodos y arcos.

## Componentes de un Diagrama de Secuencia

### Línea de Vida
- **Definición:** Línea discontinua vertical que representa la existencia de un objeto a lo largo del tiempo.
- **Uso:** Muestra cómo un objeto participa en la interacción y cuándo está activo.

### Foco de Control
- **Definición:** Rectángulo delgado que representa el período de tiempo en que un objeto ejecuta una acción o método.
- **Uso:** Indica cuándo un objeto está procesando un mensaje o realizando una operación.

### Creación y Destrucción de Objetos
- **Creación:** Representada con el estereotipo **<<create>>** o la palabra **new**. Indica cuándo un objeto es creado durante la secuencia.
- **Destrucción:** Representada con el estereotipo **<<destroy>>** o la palabra **delete**. Indica cuándo un objeto es eliminado.

## Tipos de Flujo de Control (Mensajes)

### Mensajes Síncronos
- **Definición:** Corresponden a llamadas a métodos del objeto que recibe el mensaje. El objeto que envía el mensaje queda bloqueado hasta que se completa la llamada.
- **Representación:** Flecha con la cabeza llena.

### Mensajes Asíncronos
- **Definición:** Terminan inmediatamente y crean un nuevo hilo de ejecución dentro de la secuencia.
- **Representación:** Flecha con la cabeza abierta.

### Retorno de una Llamada a Procedimiento
- **Definición:** Representa la respuesta a un mensaje síncrono.
- **Representación:** Flecha discontinua. Puede omitirse si el fin de la activación es claro.

## Tipos de Diagramas de Secuencia

### Diagrama de Secuencia de Instancia
- **Definición:** Describe un escenario específico, mostrando la interacción entre objetos en un caso particular.
- **Uso:** Útil para modelar situaciones concretas y específicas.

### Diagrama de Secuencia Genérico
- **Definición:** Describe la interacción para cada caso de uso, utilizando ramificaciones, condiciones y bucles.
- **Uso:** Útil para modelar interacciones más generales que pueden variar según condiciones.

## Fragmentos Combinados

### Alternativa (alt)
- **Definición:** Modela una elección entre varias interacciones, similar a una estructura **if...then...else**.
- **Uso:** Se ejecuta una interacción específica dependiendo de una condición (guarda).

### Opción (opt)
- **Definición:** Equivale a un operador **alt** con un solo fragmento. Se ejecuta si la guarda se cumple.
- **Uso:** Similar a una estructura **switch**.

### Bucle (loop)
- **Definición:** El fragmento se ejecuta múltiples veces. La guarda indica cómo se realiza la iteración.
- **Uso:** Modela estructuras de repetición como **for** o **while**.

### Diagrama de Secuencia (sd)
- **Definición:** Rodea un diagrama de secuencia para encapsularlo.
- **Uso:** Útil para organizar y modularizar diagramas complejos.

### Referencia (ref)
- **Definición:** Hace referencia a una interacción definida en otro diagrama. Puede incluir parámetros y un valor de retorno.
- **Uso:** Permite reutilizar interacciones definidas en otros diagramas.

### Paralelo (par)
- **Definición:** Cada fragmento se ejecuta en paralelo.
- **Uso:** Modela interacciones concurrentes.

### Región Crítica (critical)
- **Definición:** Sólo puede haber un proceso ejecutando simultáneamente el fragmento.
- **Uso:** Garantiza que no haya interferencia entre procesos en una sección crítica.

## DUDAS

- ¿Cómo se manejan las interacciones complejas con múltiples condiciones y bucles en un diagrama de secuencia?
- ¿Cuál es la diferencia entre un mensaje síncrono y uno asíncrono en términos de implementación?
- ¿Cómo se pueden representar excepciones o errores en un diagrama de secuencia?