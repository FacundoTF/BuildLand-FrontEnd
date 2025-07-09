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

-- CREATE TABLE IF NOT EXISTS DISTRIBUIDORAS (
--     CuitDistribuidora VARCHAR(8) NOT NULL,
--     Nombre VARCHAR(100) NOT NULL,
--     Direccion VARCHAR(200),
--     NumeroTelefono VARCHAR(20),
--     Descripcion VARCHAR(120),
--     CodigoPostal VARCHAR(4),
--     PRIMARY KEY (CuitDistribuidora),
--     UNIQUE KEY uk_distribuidoras_nombre (Nombre)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de prueba (opcional)
-- INSERT INTO DISTRIBUIDORAS (CuitDistribuidora, Nombre, Direccion, NumeroTelefono, Descripcion, CodigoPostal) VALUES
-- ('12345678', 'Distribuidora Norte', 'Av. Libertador 1234, CABA', '+54 11 4567-8901', 'Distribuidora especializada en materiales de construcción del norte de la ciudad', '1425'),
-- ('87654321', 'Constructora del Sur', 'Calle San Martín 567, La Plata', '+54 221 234-5678', 'Empresa constructora con más de 20 años de experiencia en el mercado', '1900'),
-- ('11223344', 'Materiales Express', 'Ruta 9 Km 45, Pilar', '+54 11 3456-7890', 'Distribución rápida de materiales para construcción y reforma', '1629');
