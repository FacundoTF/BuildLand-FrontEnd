# BuildLand Frontend

Frontend desarrollado con Fresh (Deno) para la gestión completa de distribuidoras.

## Funcionalidades Implementadas

### 🏗️ Estructura del Proyecto
- **Framework**: Fresh (Deno)
- **Estilos**: Tailwind CSS
- **Arquitectura**: Basada en componentes e islas de interactividad

### 📋 Gestión de Distribuidoras
- ✅ **Agregar Distribuidoras**: Formulario interactivo con validaciones en tiempo real
- ✅ **Remover Distribuidoras**: Búsqueda y eliminación con doble confirmación
- ✅ **Modificar Distribuidoras**: Búsqueda, edición y actualización completa
- **Listar Distribuidoras**: Funcionalidad disponible (no expuesta en UI por decisión de diseño)

### 🎨 Interfaz de Usuario
- **Barra lateral interactiva** con menús desplegables
- **Formularios validados** con feedback visual en tiempo real
- **Diseño responsivo** y moderno
- **Animaciones suaves** y transiciones
- **Indicadores de estado** (carga, éxito, error)
- **Experiencia de usuario optimizada** con validaciones client-side

## Estructura de Archivos

```
FrontEnd/
├── components/
│   └── Layout.tsx           # Layout principal con sidebar
├── islands/
│   ├── Sidebar.tsx          # Barra lateral interactiva
│   ├── FormularioAgregarDistribuidora.tsx    # Formulario agregar
│   ├── FormularioRemoverDistribuidora.tsx    # Formulario remover
│   └── FormularioModificarDistribuidora.tsx  # Formulario modificar
├── routes/
│   ├── index.tsx            # Página principal
│   └── distribuidoras/
│       ├── agregar.tsx      # Página agregar
│       ├── remover.tsx      # Página remover
│       └── modificar.tsx    # Página modificar
├── services/
│   └── distribuidoraService.ts   # Servicio API y validaciones
├── types/
│   └── distribuidora.ts     # Tipos TypeScript
└── static/
    └── styles.css           # Estilos Tailwind CSS personalizados
```

## Comandos Disponibles

```bash
# Instalar dependencias (si es necesario)
deno cache main.ts

# Ejecutar en modo desarrollo
deno task start

# Regenerar manifest (necesario después de crear/modificar islas)
deno task manifest

# Buildear para producción
deno task build
```

## Integración con Backend

El frontend se conecta con el backend Spring Boot en `http://localhost:8080/api/distribuidoras`.

### Endpoints utilizados:
- `GET /api/distribuidoras` - Listar todas las distribuidoras
- `GET /api/distribuidoras/{cuit}` - Obtener distribuidora por CUIT
- `POST /api/distribuidoras` - Crear nueva distribuidora
- `PUT /api/distribuidoras/{cuit}` - Actualizar distribuidora existente
- `DELETE /api/distribuidoras/{cuit}` - Eliminar distribuidora
- `GET /api/distribuidoras/buscar?nombre={nombre}` - Buscar distribuidoras por nombre

### Manejo de Errores
- Validaciones client-side antes de enviar al servidor
- Manejo robusto de errores HTTP
- Mensajes de error específicos y comprensibles
- Feedback visual inmediato

## Validaciones Implementadas

### Cliente (Frontend)
- **CUIT**: Exactamente 8 dígitos numéricos
- **Nombre**: Obligatorio, máximo 100 caracteres
- **Dirección**: Opcional, máximo 200 caracteres
- **Teléfono**: Opcional, máximo 20 caracteres
- **Descripción**: Opcional, máximo 120 caracteres
- **Código Postal**: Opcional, exactamente 4 dígitos

### Funcionalidades Especiales

#### Agregar Distribuidoras
- Validación en tiempo real mientras se escribe
- Verificación de CUIT único
- Feedback visual inmediato
- Reset automático del formulario tras éxito

#### Remover Distribuidoras
- Búsqueda por CUIT o nombre
- Doble confirmación antes de eliminar
- Validación de existencia
- Feedback de confirmación

#### Modificar Distribuidoras
- Búsqueda flexible por CUIT o nombre
- Carga automática de datos existentes
- Detección de cambios en tiempo real
- Solo permite guardar si hay modificaciones
- Actualización optimista de datos

## Tecnologías y Librerías

- **Fresh 1.6+**: Framework full-stack para Deno
- **Preact**: Biblioteca de componentes ligera compatible con React
- **TypeScript**: Tipado estático para mejor desarrollo
- **Tailwind CSS**: Framework de estilos utilitarios
- **Deno**: Runtime moderno para JavaScript/TypeScript

## Patrones de Diseño Utilizados

- **Islas de Interactividad**: Solo se hidrata JavaScript donde es necesario
- **Componentes Funcionales**: Uso de hooks de Preact para estado
- **Separación de Responsabilidades**: Servicios, tipos y validaciones separados
- **Error Boundaries**: Manejo robusto de errores en formularios
- **Optimistic Updates**: Actualización inmediata de UI con rollback en errores

## Componentes Principales

### Layout.tsx
Proporciona la estructura base de la aplicación con:
- Barra lateral fija
- Header con título
- Área de contenido principal

### Sidebar.tsx
Barra lateral de navegación que incluye:
- Botón desplegable "Gestionar distribuidoras"
- Enlaces a las diferentes funcionalidades
- Animaciones suaves
- Estados activos

### Páginas de Distribuidoras

1. **Lista (`/distribuidoras`)**:
   - Tabla con todas las distribuidoras
   - Buscador integrado
   - Acciones rápidas (editar, eliminar)

2. **Agregar (`/distribuidoras/agregar`)**:
   - Formulario completo de creación
   - Validaciones en tiempo real
   - Campos obligatorios marcados

3. **Modificar (`/distribuidoras/modificar`)**:
   - Búsqueda por CUIT o nombre
   - Formulario pre-cargado con datos existentes
   - CUIT de solo lectura

4. **Remover (`/distribuidoras/remover`)**:
   - Búsqueda de distribuidora
   - Confirmación doble para eliminación
   - Información completa antes de eliminar

## Validaciones

El sistema incluye validaciones tanto en frontend como backend:

- **CUIT**: Exactamente 8 dígitos
- **Nombre**: Obligatorio, máximo 100 caracteres
- **Dirección**: Máximo 200 caracteres
- **Teléfono**: Máximo 20 caracteres
- **Descripción**: Máximo 120 caracteres
- **Código Postal**: Exactamente 4 dígitos

## Estilos

Los estilos están implementados con clases tipo Tailwind CSS personalizadas en `static/styles.css`, incluyendo:

- Sistema de colores consistente
- Espaciado y tipografía
- Estados hover y focus
- Transiciones suaves
- Diseño responsivo

## Integración con Backend

El frontend se comunica con el backend Spring Boot a través de:

- **GET** `/api/distribuidoras` - Listar todas
- **GET** `/api/distribuidoras/{cuit}` - Obtener por CUIT
- **POST** `/api/distribuidoras` - Crear nueva
- **PUT** `/api/distribuidoras/{cuit}` - Actualizar
- **DELETE** `/api/distribuidoras/{cuit}` - Eliminar
- **GET** `/api/distribuidoras/buscar?nombre={nombre}` - Buscar por nombre

## Desarrollo

Para desarrollo local:

1. Asegúrate de que el backend esté ejecutándose en `localhost:8080`
2. Inicia el frontend con `deno task start`
3. Los cambios se recargan automáticamente
4. Usa las herramientas de desarrollo del navegador para debugging
