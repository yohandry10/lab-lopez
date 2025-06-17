-- Script para agregar configuración de mostrar precios en promociones
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna para controlar si mostrar precios en biblioteca_digital
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'configuracion_secciones' AND column_name = 'mostrar_precios') THEN
        ALTER TABLE configuracion_secciones ADD COLUMN mostrar_precios BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna mostrar_precios agregada';
    ELSE
        RAISE NOTICE 'Columna mostrar_precios ya existe';
    END IF;
END $$;

-- Actualizar configuración de biblioteca digital para no mostrar precios por defecto
UPDATE configuracion_secciones 
SET mostrar_precios = FALSE 
WHERE seccion = 'biblioteca_digital';

-- Si no existe la configuración de biblioteca_digital, crearla
INSERT INTO configuracion_secciones (seccion, titulo, mostrar_precios) 
VALUES ('biblioteca_digital', 'Promociones Disponibles', FALSE)
ON CONFLICT (seccion) 
DO UPDATE SET 
    mostrar_precios = FALSE,
    updated_at = NOW();

-- Verificar que se aplicaron los cambios
SELECT seccion, titulo, mostrar_precios 
FROM configuracion_secciones 
WHERE seccion = 'biblioteca_digital'; 