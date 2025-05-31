-- Agregar columnas faltantes a la tabla biblioteca_digital
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna contenido si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'contenido') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN contenido TEXT DEFAULT '';
        RAISE NOTICE 'Columna contenido agregada';
    ELSE
        RAISE NOTICE 'Columna contenido ya existe';
    END IF;
END $$;

-- Agregar columna categoria si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'categoria') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN categoria TEXT DEFAULT 'Análisis clínicos';
        RAISE NOTICE 'Columna categoria agregada';
    ELSE
        RAISE NOTICE 'Columna categoria ya existe';
    END IF;
END $$;

-- Verificar que todas las columnas existen
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'biblioteca_digital'
ORDER BY ordinal_position; 