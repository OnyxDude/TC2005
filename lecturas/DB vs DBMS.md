# Síntesis: DB vs DBMS

## Definiciones básicas

- **Base de datos (BD)**: Colección estructurada de datos interrelacionados, diseñada para minimizar la redundancia y representar la información de una organización de manera integral. Ejemplos incluyen registros de clientes, cuentas bancarias o matrículas de alumnos.
- **Sistema de Gestión de Bases de Datos (DBMS)**: Software que permite crear, gestionar y acceder a una base de datos. Facilita operaciones como consultas, actualizaciones, control de seguridad y manejo de concurrencia. Ejemplos: MySQL, Oracle.

## Justificación y contexto de bases de datos

### Antecedentes y problemáticas sin bases de datos

- Antes de los años 1960, los datos se almacenaban en archivos vinculados a programas específicos, lo que generaba:
  - **Redundancia e inconsistencia**: Mismos datos repetidos en múltiples archivos con valores contradictorios.
  - **Dificultad de acceso**: Consultas no previstas requerían reprogramación o manipulación manual.
  - **Aislamiento de datos**: Formatos incompatibles entre archivos dificultaban la integración.
  - **Problemas de seguridad e integridad**: Falta de control centralizado sobre permisos y validaciones.

### Ventajas de las bases de datos y DBMS

1. **Centralización**: Un único repositorio de datos accesible por múltiples usuarios y aplicaciones.
2. **Reducción de redundancia**: Diseño normalizado para evitar repeticiones innecesarias.
3. **Gestión eficiente**:
   - **Control de concurrencia**: Evita inconsistencias al manejar múltiples actualizaciones simultáneas (ejemplo: retiros bancarios concurrentes).
   - **Seguridad**: Restricciones de acceso basadas en roles (ejemplo: personal de nóminas no accede a cuentas de clientes).
   - **Integridad**: Validación de reglas (ejemplo: saldo mínimo en cuentas).
4. **Recuperación ante fallos**: Copias de seguridad y mecanismos para restaurar datos tras errores.

## Casos de uso

- **Grandes volúmenes de datos**: Directorios telefónicos, padrones electorales.
- **Sistemas críticos**: Bancos (gestión de cuentas, transacciones), empresas (ventas, producción).

## Funciones clave del DBMS (según Korth y Silberschatz)

- Interacción con el sistema de archivos para almacenamiento físico.
- Aplicación de restricciones de integridad y seguridad.
- Gestión de copias de seguridad y recuperación.
- Control de acceso concurrente para mantener consistencia.
