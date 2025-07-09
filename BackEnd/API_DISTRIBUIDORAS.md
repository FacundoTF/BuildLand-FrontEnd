# API de Distribuidoras - BuildLand

## Descripción
Esta API proporciona endpoints RESTful para manejar distribuidoras en el sistema BuildLand.
Los datos se persisten en una base de datos MySQL.

## Configuración de Base de Datos

### Requisitos previos
- MySQL Server instalado y ejecutándose
- Base de datos `buildland_db` creada (se crea automáticamente si no existe)

### Configuración por defecto
- **Host**: localhost
- **Puerto**: 3306
- **Base de datos**: buildland_db
- **Usuario**: root
- **Contraseña**: Fafarneda227

Para cambiar estas configuraciones, edita el archivo `src/main/resources/application.properties`

## Endpoints Disponibles

### Base URL
```
http://localhost:8080/api/distribuidoras
```

### 1. Crear una nueva distribuidora
**POST** `/api/distribuidoras`

**Body (JSON):**
```json
{
    "nombre": "Distribuidora Ejemplo",
    "direccion": "Calle Falsa 123",
    "numeroTelefono": "+54 11 1234-5678"
}
```

**Respuesta exitosa (201 Created):**
```json
{
    "id": 1,
    "nombre": "Distribuidora Ejemplo",
    "direccion": "Calle Falsa 123",
    "numeroTelefono": "+54 11 1234-5678"
}
```

### 2. Obtener todas las distribuidoras
**GET** `/api/distribuidoras`

**Respuesta exitosa (200 OK):**
```json
[
    {
        "id": 1,
        "nombre": "Distribuidora Ejemplo",
        "direccion": "Calle Falsa 123",
        "numeroTelefono": "+54 11 1234-5678"
    }
]
```

### 3. Obtener una distribuidora por ID
**GET** `/api/distribuidoras/{id}`

**Ejemplo**: `/api/distribuidoras/1`

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "nombre": "Distribuidora Ejemplo",
    "direccion": "Calle Falsa 123",
    "numeroTelefono": "+54 11 1234-5678"
}
```

**Respuesta si no existe (404 Not Found)**

### 4. Buscar distribuidoras por nombre
**GET** `/api/distribuidoras/buscar?nombre={texto}`

**Ejemplo**: `/api/distribuidoras/buscar?nombre=Norte`

**Respuesta exitosa (200 OK):**
```json
[
    {
        "id": 2,
        "nombre": "Distribuidora Norte",
        "direccion": "Av. Libertador 1234",
        "numeroTelefono": "+54 11 4567-8901"
    }
]
```

### 5. Actualizar una distribuidora
**PUT** `/api/distribuidoras/{id}`

**Ejemplo**: `/api/distribuidoras/1`

**Body (JSON):**
```json
{
    "nombre": "Distribuidora Actualizada",
    "direccion": "Nueva Direccion 456",
    "numeroTelefono": "+54 11 9876-5432"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "nombre": "Distribuidora Actualizada",
    "direccion": "Nueva Direccion 456",
    "numeroTelefono": "+54 11 9876-5432"
}
```

### 6. Eliminar una distribuidora
**DELETE** `/api/distribuidoras/{id}`

**Ejemplo**: `/api/distribuidoras/1`

**Respuesta exitosa (204 No Content)**
**Respuesta si no existe (404 Not Found)**

## Ejemplos de uso con cURL

### Crear una distribuidora
```bash
curl -X POST http://localhost:8080/api/distribuidoras \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Distribuidora Test",
    "direccion": "Av. Corrientes 1234",
    "numeroTelefono": "+54 11 4444-5555"
  }'
```

### Obtener todas las distribuidoras
```bash
curl -X GET http://localhost:8080/api/distribuidoras
```

### Obtener una distribuidora específica
```bash
curl -X GET http://localhost:8080/api/distribuidoras/1
```

### Buscar distribuidoras por nombre
```bash
curl -X GET "http://localhost:8080/api/distribuidoras/buscar?nombre=Test"
```

### Actualizar una distribuidora
```bash
curl -X PUT http://localhost:8080/api/distribuidoras/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Nombre",
    "direccion": "Nueva Direccion",
    "numeroTelefono": "+54 11 9999-8888"
  }'
```

### Eliminar una distribuidora
```bash
curl -X DELETE http://localhost:8080/api/distribuidoras/1
```

## Validaciones
- El campo `nombre` es obligatorio y no puede estar vacío
- No se pueden crear dos distribuidoras con el mismo nombre (case insensitive)
- El ID se genera automáticamente al crear una distribuidora

## Códigos de Estado HTTP
- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Recurso eliminado exitosamente
- **400 Bad Request**: Datos inválidos en la solicitud
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Configuración de Base de Datos

### Instalación de MySQL
1. Descargar e instalar MySQL Server desde https://dev.mysql.com/downloads/mysql/
2. Durante la instalación, configurar la contraseña del usuario root
3. Asegurarse de que el servicio MySQL esté ejecutándose

### Configuración de la aplicación
Si necesitas cambiar la configuración de la base de datos, edita el archivo `src/main/resources/application.properties`:

```properties
# Configuración de la base de datos MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/buildland_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=America/Argentina/Buenos_Aires
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

## Ejecutar la aplicación
```bash
cd BackEnd
mvn spring-boot:run
```

La aplicación se ejecutará en `http://localhost:8080`

## Características de la Base de Datos
- ✅ **Persistencia**: Los datos se guardan permanentemente en MySQL
- ✅ **Auto-incremento**: Los IDs se generan automáticamente
- ✅ **Validaciones**: Nombres únicos, campos obligatorios
- ✅ **Búsquedas**: Búsqueda por nombre con coincidencias parciales
- ✅ **Codificación**: UTF-8 para caracteres especiales y acentos
- ✅ **Transacciones**: Operaciones atómicas garantizadas por Spring Transaction
