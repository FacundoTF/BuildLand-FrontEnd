# BuildLand - FrontEnd

Aplicación web de gestión empresarial para **BuildLand**, desarrollada con Angular 21 y Angular Material. Permite administrar distribuidoras, personas físicas, usuarios, grupos de permisos, presupuestos, cotizaciones y reportes.

## Tecnologías

| Tecnología       | Versión  |
| ---------------- | -------- |
| Angular          | 21       |
| Angular Material | 21       |
| TypeScript       | 5.9      |
| RxJS             | 7.8      |
| Chart.js         | 4.5      |
| SCSS             | Sass 1.x |

## Requisitos previos

- [Node.js](https://nodejs.org/) v20 o superior
- [Angular CLI](https://angular.dev/tools/cli) v21+

## Instalación

```bash
npm install
```

## Servidor de desarrollo

```bash
ng serve
```

Navegar a `http://localhost:4200/`. La aplicación se recarga automáticamente ante cambios en el código fuente.

El frontend se conecta a un servidor backend en `http://localhost:8080` en el entorno de desarrollo.

## Build de producción

```bash
ng build
```

Los artefactos se generan en el directorio `dist/`.


## Ejecución de tests

```bash
ng test
```

Ejecuta los tests unitarios con [Karma](https://karma-runner.github.io) y [Jasmine](https://jasmine.github.io/).

## Estructura del proyecto

```
src/
├── app/
│   ├── core/                  # Componentes principales y transversales
│   │   ├── base-page/         # Layout base con navegación
│   │   ├── home-page/         # Página de inicio
│   │   ├── inicio-sesion/     # Inicio de sesión
│   │   ├── restore-password/  # Recuperación de contraseña
│   │   ├── not-found-page/    # Página 404
│   │   ├── entities/          # Modelos e interfaces del dominio
│   │   ├── interceptors/      # Interceptor de autenticación
│   │   └── response-type/     # Tipos de respuesta del backend
│   ├── features/              # Módulos funcionales
│   │   ├── cotizacion/        # Realizar y recibir cotizaciones
│   │   ├── distribuidora/     # ABM de distribuidoras
│   │   ├── grupo/             # ABM de grupos de permisos
│   │   ├── persona-fisica/    # ABM de personas físicas
│   │   ├── presupuesto/       # Realizar y recibir presupuestos
│   │   ├── reportes/          # Reportes y trazabilidad
│   │   └── usuario/           # ABM de usuarios
│   └── shared/                # Componentes y servicios reutilizables
├── environments/              # Configuración por entorno
├── styles/                    # Estilos globales
└── custom-theme.scss          # Tema personalizado de Angular Material
```

## Convenciones de código

- **Componentes standalone** (por defecto en Angular 21)
- **Signals** para manejo de estado local
- **Reactive Forms** en formularios
- **Control flow nativo** (`@if`, `@for`, `@switch`) en templates
- **OnPush** como estrategia de detección de cambios
- **`inject()`** en lugar de inyección por constructor
- **Prettier** como formateador de código
