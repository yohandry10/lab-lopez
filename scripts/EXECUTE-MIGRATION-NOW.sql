-- ====================================================================
-- MIGRACIÓN INMEDIATA DE TARIFAS - EJECUTAR EN SUPABASE SQL EDITOR
-- ====================================================================

-- 1. VERIFICAR TABLAS EXISTENTES
SELECT 'VERIFICANDO TABLAS' as status;
SELECT COUNT(*) as tariffs_count FROM tariffs;
SELECT COUNT(*) as references_count FROM references;
SELECT COUNT(*) as tariff_prices_count FROM tariff_prices;

-- 2. POBLAR TARIFAS SI ESTÁN VACÍAS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tariffs LIMIT 1) THEN
        INSERT INTO tariffs (name, type, is_taxable) VALUES
        ('Base', 'sale', true),
        ('Exonerado', 'sale', false),
        ('Particular San Juan', 'sale', true),
        ('Particular Santa Anita', 'sale', true),
        ('Referencial con IGV', 'sale', true),
        ('Referencial sin IGV', 'sale', false),
        ('Costo', 'cost', false);
        
        RAISE NOTICE '✅ Tarifas creadas';
    ELSE
        RAISE NOTICE '⚠️ Las tarifas ya existen';
    END IF;
END $$;

-- 3. POBLAR REFERENCIAS SI ESTÁN VACÍAS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM references LIMIT 1) THEN
        INSERT INTO references (name, business_name, active) VALUES
        ('Público General', 'Público General', true),
        ('Médicos', 'Médicos', true),
        ('Empresas', 'Empresas', true),
        ('Centro de Salud Calcuta', 'Centro de Salud Calcuta', true),
        ('Clínica Solidaria La Campiña', 'Clínica Solidaria La Campiña E.I.R.L', true),
        ('Clínica Vista Alegre', 'Clínica Vista Alegre', true),
        ('Laboratorio Clínico López', 'Laboratorio Clínico López', true);
        
        RAISE NOTICE '✅ Referencias creadas';
    ELSE
        RAISE NOTICE '⚠️ Las referencias ya existen';
    END IF;
END $$;

-- 4. MIGRAR PRECIOS DE ANÁLISIS EXISTENTES
DO $$
DECLARE
    tariff_base_id uuid;
    tariff_ref_id uuid;
    analysis_record record;
    count_migrated integer := 0;
BEGIN
    -- Verificar que no hay precios ya migrados
    IF EXISTS (SELECT 1 FROM tariff_prices LIMIT 1) THEN
        RAISE NOTICE '⚠️ Los precios ya están migrados';
        RETURN;
    END IF;

    -- Obtener IDs de tarifas
    SELECT id INTO tariff_base_id FROM tariffs WHERE name = 'Base' LIMIT 1;
    SELECT id INTO tariff_ref_id FROM tariffs WHERE name = 'Referencial con IGV' LIMIT 1;
    
    IF tariff_base_id IS NULL OR tariff_ref_id IS NULL THEN
        RAISE EXCEPTION 'No se encontraron las tarifas necesarias';
    END IF;
    
    -- Migrar precios
    FOR analysis_record IN 
        SELECT id, name, price, reference_price 
        FROM analyses 
        WHERE price IS NOT NULL AND price > 0
    LOOP
        -- Precio base (público)
        INSERT INTO tariff_prices (tariff_id, exam_id, price) 
        VALUES (tariff_base_id, analysis_record.id, analysis_record.price);
        
        -- Precio referencial (empresarial)
        INSERT INTO tariff_prices (tariff_id, exam_id, price) 
        VALUES (tariff_ref_id, analysis_record.id, 
                COALESCE(analysis_record.reference_price, analysis_record.price * 0.8));
        
        count_migrated := count_migrated + 1;
        
        -- Log cada 50 análisis
        IF count_migrated % 50 = 0 THEN
            RAISE NOTICE 'Migrados % análisis...', count_migrated;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✅ Migrados % análisis', count_migrated;
END $$;

-- 5. CONFIGURAR REFERENCIAS CON TARIFAS POR DEFECTO
UPDATE references 
SET default_tariff_id = (SELECT id FROM tariffs WHERE name = 'Base' LIMIT 1)
WHERE name = 'Público General';

UPDATE references 
SET default_tariff_id = (SELECT id FROM tariffs WHERE name = 'Referencial con IGV' LIMIT 1)
WHERE name IN ('Empresas', 'Médicos');

-- 6. VERIFICAR RESULTADOS FINALES
SELECT 'MIGRACIÓN COMPLETADA' as status;
SELECT COUNT(*) as total_tarifas FROM tariffs;
SELECT COUNT(*) as total_referencias FROM references;
SELECT COUNT(*) as total_precios_migrados FROM tariff_prices;

-- 7. MOSTRAR ALGUNOS EJEMPLOS
SELECT 
  a.name as analisis,
  t.name as tarifa,
  tp.price as precio
FROM tariff_prices tp
JOIN analyses a ON tp.exam_id = a.id
JOIN tariffs t ON tp.tariff_id = t.id
ORDER BY a.name, t.name
LIMIT 10;

-- 8. VERIFICAR REFERENCIAS CONFIGURADAS
SELECT 
  r.name as referencia,
  t.name as tarifa_por_defecto
FROM references r
LEFT JOIN tariffs t ON r.default_tariff_id = t.id
WHERE r.active = true; 