-- Script de migración para agregar las columnas Descripcion y CodigoPostal
-- a la tabla distribuidoras existente

USE buildland_db;

-- Agregar las nuevas columnas si no existen
ALTER TABLE DISTRIBUIDORAS 
ADD COLUMN IF NOT EXISTS Descripcion VARCHAR(120),
ADD COLUMN IF NOT EXISTS CodigoPostal VARCHAR(4);

-- Verificar que las columnas se agregaron correctamente
-- SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = 'buildland_db' 
-- AND TABLE_NAME = 'DISTRIBUIDORAS' 
-- AND COLUMN_NAME IN ('Descripcion', 'CodigoPostal');

-- Opcional: Actualizar registros existentes con datos de ejemplo
-- UPDATE DISTRIBUIDORAS SET 
--     Descripcion = 'Distribuidora de materiales de construcción',
--     CodigoPostal = '1000'
-- WHERE Descripcion IS NULL;

COMMIT;
