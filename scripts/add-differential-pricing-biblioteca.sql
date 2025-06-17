-- Script para agregar campos de precios diferenciados y audiencia objetivo
-- Tabla: biblioteca_digital

-- Agregar columna para precio de referencia (médicos/empresas)
ALTER TABLE biblioteca_digital
ADD COLUMN precio_referencia DECIMAL(10,2);

-- Agregar columna para audiencia objetivo
ALTER TABLE biblioteca_digital
ADD COLUMN audiencia_objetivo VARCHAR(20) DEFAULT 'publico';

-- Agregar comentarios para documentar las columnas
COMMENT ON COLUMN biblioteca_digital.precio_referencia IS 'Precio para médicos y empresas (cuando aplique)';
COMMENT ON COLUMN biblioteca_digital.audiencia_objetivo IS 'Audiencia objetivo: publico o medicos_empresas';

-- Crear índice para mejorar consultas por audiencia
CREATE INDEX idx_biblioteca_digital_audiencia ON biblioteca_digital(audiencia_objetivo);

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'biblioteca_digital' 
AND column_name IN ('precio_referencia', 'audiencia_objetivo'); 