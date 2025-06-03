-- Agregar columna precio a la tabla biblioteca_digital
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna precio si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'precio') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN precio DECIMAL(10,2) DEFAULT 150.00;
        RAISE NOTICE 'Columna precio agregada';
    ELSE
        RAISE NOTICE 'Columna precio ya existe';
    END IF;
END $$;

-- Actualizar algunos registros con precios de ejemplo (opcional)
UPDATE biblioteca_digital SET precio = 250.00 WHERE titulo ILIKE '%oncológico%';
UPDATE biblioteca_digital SET precio = 180.00 WHERE titulo ILIKE '%antifosfolípidos%';
UPDATE biblioteca_digital SET precio = 220.00 WHERE titulo ILIKE '%zuma%';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'biblioteca_digital' AND column_name = 'precio';

-- Mostrar registros actualizados
SELECT id, titulo, precio FROM biblioteca_digital LIMIT 5; 