-- Script de migración para renombrar la tabla de 'distribuidoras' a 'DISTRIBUIDORAS'
-- Ejecutar este script si ya tienes una tabla existente con nombre en minúscula

USE buildland_db;

-- Verificar si existe la tabla en minúscula
-- SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
-- WHERE TABLE_SCHEMA = 'buildland_db' 
-- AND TABLE_NAME IN ('distribuidoras', 'DISTRIBUIDORAS');

-- Renombrar la tabla de minúscula a mayúscula
-- IMPORTANTE: Hacer backup antes de ejecutar
RENAME TABLE distribuidoras TO DISTRIBUIDORAS;

-- Verificar que el cambio se aplicó correctamente
-- SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
-- WHERE TABLE_SCHEMA = 'buildland_db' 
-- AND TABLE_NAME = 'DISTRIBUIDORAS';

-- Verificar la estructura de la tabla renombrada
-- DESCRIBE DISTRIBUIDORAS;

COMMIT;
