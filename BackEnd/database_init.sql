-- Script SQL para inicializar la base de datos BuildLand
-- Ejecutar este script en MySQL antes de ejecutar la aplicación

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS buildland_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE buildland_db;

-- La tabla se creará automáticamente por Hibernate con la configuración spring.jpa.hibernate.ddl-auto=update
-- Pero aquí está el script por si quieres crearla manualmente:

-- CREATE TABLE IF NOT EXISTS distribuidoras (
--     id BIGINT NOT NULL AUTO_INCREMENT,
--     nombre VARCHAR(100) NOT NULL,
--     direccion VARCHAR(200),
--     numero_telefono VARCHAR(20),
--     PRIMARY KEY (id),
--     UNIQUE KEY uk_distribuidoras_nombre (nombre)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de prueba (opcional)
-- INSERT INTO distribuidoras (nombre, direccion, numero_telefono) VALUES
-- ('Distribuidora Norte', 'Av. Libertador 1234, CABA', '+54 11 4567-8901'),
-- ('Constructora del Sur', 'Calle San Martín 567, La Plata', '+54 221 234-5678'),
-- ('Materiales Express', 'Ruta 9 Km 45, Pilar', '+54 11 3456-7890');
