# Síntesis: Generación de Casos de Prueba a partir de Casos de Uso

## Definiciones básicas

- **Caso de Uso:** Descripción de una secuencia de acciones realizadas por un sistema para proporcionar un resultado observable de valor para un actor (persona o sistema). Los casos de uso definen los requisitos del sistema y son utilizados para guiar el desarrollo, la documentación y las pruebas.
- **Caso de Prueba:** Conjunto de entradas, condiciones de ejecución y resultados esperados diseñados para verificar el cumplimiento de un requisito específico o para ejercitar una ruta particular del programa.
- **Escenario de Caso de Uso:** Instancia de un caso de uso que representa una "ruta" completa a través del caso de uso, incluyendo flujos básicos y alternativos.

## Proceso de Generación de Casos de Prueba

### Paso 1: Generar Escenarios
- **Descripción:** A partir de la descripción textual del caso de uso, se identifican todas las combinaciones posibles de flujos básicos y alternativos (escenarios).
- **Ejemplo:** Para el caso de uso "Registro de Cursos", los escenarios pueden incluir:
  - **Escenario 1:** Flujo básico (registro exitoso).
  - **Escenario 2:** Flujo básico + flujo alternativo 1 (estudiante no identificado).
  - **Escenario 3:** Flujo básico + flujo alternativo 2 (usuario decide salir).

### Paso 2: Identificar Casos de Prueba
- **Descripción:** Para cada escenario, se identifican uno o más casos de prueba. Esto implica analizar las condiciones necesarias para ejecutar cada escenario y documentar los datos requeridos.
- **Ejemplo:** Para el escenario "Registro exitoso", un caso de prueba podría ser:
  - **ID del Caso de Prueba:** RC1
  - **Condiciones:** ID de estudiante válido, contraseña válida, cursos seleccionados con prerrequisitos cumplidos.
  - **Resultado Esperado:** Se muestra el horario y el número de confirmación.

### Paso 3: Identificar Valores de Datos para Pruebas
- **Descripción:** Una vez identificados los casos de prueba, se asignan valores concretos a las condiciones (por ejemplo, ID de estudiante, contraseña, cursos seleccionados).
- **Ejemplo:** Para el caso de prueba RC1:
  - **ID de Estudiante:** Jheumann
  - **Contraseña:** abc123
  - **Cursos Seleccionados:** M101, E201, S101
  - **Resultado Esperado:** Se muestra el horario y el número de confirmación.

## Ventajas de Generar Casos de Prueba a partir de Casos de Uso

1. **Inicio Temprano de las Pruebas:** Permite comenzar las actividades de prueba en etapas tempranas del desarrollo, reduciendo el riesgo de encontrar errores críticos en fases posteriores.
2. **Cobertura Completa:** Al seguir una metodología estructurada, se asegura que todos los flujos (básicos y alternativos) sean probados.
3. **Comunicación Clara:** Los casos de prueba documentados proporcionan una guía clara para los desarrolladores, testers y otros stakeholders sobre lo que se debe probar y cómo.

## Ejemplo de Matriz de Casos de Prueba

| ID de Caso de Prueba | Escenario / Condición | ID de Estudiante | Contraseña | Cursos Seleccionados | Prerrequisitos Cumplidos | Curso Abierto | Horario Abierto | Resultado Esperado |
|-----------------------|------------------------|------------------|------------|-----------------------|--------------------------|---------------|-----------------|--------------------|
| RC1                   | Registro exitoso       | Jheumann         | abc123     | M101, E201, S101      | Sí                       | Sí            | Sí              | Horario y número de confirmación mostrados |
| RC2                   | Estudiante no identificado | Jheuman1      | N/A        | N/A                   | N/A                      | N/A           | N/A             | Mensaje de error; vuelve a la pantalla de inicio de sesión |
| RC3                   | Usuario sale            | Jheumann         | abc123     | N/A                   | N/A                      | N/A           | N/A             | Pantalla de inicio de sesión aparece |
