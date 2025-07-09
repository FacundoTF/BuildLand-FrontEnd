-- Script de migración para actualizar la estructura de la tabla distribuidoras
-- Ejecutar este script si ya tienes una base de datos existente con la estructura anterior

USE buildland_db;

-- Si la tabla ya existe con la estructura anterior, necesitas migrar los datos
-- IMPORTANTE: Hacer backup antes de ejecutar este script

-- Verificar si la tabla existe con la estructura anterior
-- SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = 'buildland_db' AND TABLE_NAME = 'DISTRIBUIDORAS';

-- Opción 1: Recrear la tabla (PERDERÁS LOS DATOS EXISTENTES)
-- DROP TABLE IF EXISTS DISTRIBUIDORAS;
-- 
-- CREATE TABLE DISTRIBUIDORAS (
--     CuitDistribuidora VARCHAR(8) NOT NULL,
--     Nombre VARCHAR(100) NOT NULL,
--     Direccion VARCHAR(200),
--     NumeroTelefono VARCHAR(20),
--     Descripcion VARCHAR(120),
--     CodigoPostal VARCHAR(4),
--     PRIMARY KEY (CuitDistribuidora),
--     UNIQUE KEY uk_distribuidoras_nombre (Nombre)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Opción 2: Migrar datos existentes (CONSERVA LOS DATOS)
-- Si tienes datos existentes, usa estos comandos:

-- 1. Crear tabla temporal con nueva estructura
-- CREATE TABLE DISTRIBUIDORAS_NEW (
--     CuitDistribuidora VARCHAR(8) NOT NULL,
--     Nombre VARCHAR(100) NOT NULL,
--     Direccion VARCHAR(200),
--     NumeroTelefono VARCHAR(20),
--     Descripcion VARCHAR(120),
--     CodigoPostal VARCHAR(4),
--     PRIMARY KEY (CuitDistribuidora),
--     UNIQUE KEY uk_distribuidoras_nombre (Nombre)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Migrar datos de la tabla anterior (ajustar según tu estructura anterior)
-- INSERT INTO DISTRIBUIDORAS_NEW (CuitDistribuidora, Nombre, Direccion, NumeroTelefono, Descripcion, CodigoPostal)
-- SELECT id, nombre, direccion, numero_telefono, descripcion, codigo_postal FROM DISTRIBUIDORAS;

-- 3. Renombrar tablas
-- DROP TABLE DISTRIBUIDORAS;
-- RENAME TABLE DISTRIBUIDORAS_NEW TO DISTRIBUIDORAS;

-- Nota: Si usas spring.jpa.hibernate.ddl-auto=update, 
-- Hibernate intentará actualizar la estructura automáticamente.
