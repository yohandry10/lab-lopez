-- Script para agregar campo "cantidad de muestra" a la tabla analyses
-- Este campo es requerido según los errores identificados en el PDF

-- 1. Agregar columna para cantidad de muestra
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS sample_quantity TEXT DEFAULT '';

-- 2. Agregar comentario explicativo
COMMENT ON COLUMN analyses.sample_quantity IS 'Cantidad de muestra requerida para el análisis (ej: 5 mL, 10 mL, etc.)';

-- 3. Actualizar algunos registros existentes con valores ejemplo
UPDATE analyses SET sample_quantity = '5 mL' WHERE sample_quantity = '' AND protocol LIKE '%5 mL%';
UPDATE analyses SET sample_quantity = '10 mL' WHERE sample_quantity = '' AND protocol LIKE '%10 mL%';
UPDATE analyses SET sample_quantity = '3 mL' WHERE sample_quantity = '' AND protocol LIKE '%3 mL%';

-- 4. Para el resto que no tenga cantidad específica, usar un valor por defecto
UPDATE analyses SET sample_quantity = '5 mL' WHERE sample_quantity = '';

-- 5. Verificar que se aplicaron los cambios
SELECT name, sample_quantity, protocol, sample 
FROM analyses 
ORDER BY name 
LIMIT 10; 