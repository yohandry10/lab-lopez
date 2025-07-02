/*=====================================================================
  MIGRACIÓN DE PRECIOS EXISTENTES AL SISTEMA DE TARIFAS
  
  Este script migra los precios actuales de la tabla 'analyses' 
  al nuevo sistema de tarifas, creando entradas en 'tariff_prices'
  
  EJECUTAR UNA SOLA VEZ DESPUÉS DE IMPLEMENTAR EL SISTEMA DE TARIFAS
=====================================================================*/

-- 1. Verificar que existen las tablas necesarias
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tariffs') THEN
        RAISE EXCEPTION 'La tabla tariffs no existe. Ejecutar primero create-tariffs-system.sql';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tariff_prices') THEN
        RAISE EXCEPTION 'La tabla tariff_prices no existe. Ejecutar primero create-tariffs-system.sql';
    END IF;
    
    RAISE NOTICE 'Tablas de tarifas verificadas correctamente';
END $$;

-- 2. Obtener IDs de tarifas base (se crean automáticamente en create-tariffs-system.sql)
DO $$
DECLARE
    tariff_base_id uuid;
    tariff_referencial_id uuid;
    analysis_record record;
    insert_count integer := 0;
BEGIN
    -- Obtener ID de tarifa Base (para precios públicos)
    SELECT id INTO tariff_base_id 
    FROM public.tariffs 
    WHERE name = 'Base' AND type = 'sale' 
    LIMIT 1;
    
    -- Obtener ID de tarifa Referencial (para precios empresariales)
    SELECT id INTO tariff_referencial_id 
    FROM public.tariffs 
    WHERE name = 'Referencial con IGV' AND type = 'sale' 
    LIMIT 1;
    
    IF tariff_base_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró la tarifa Base. Verificar que se ejecutó create-tariffs-system.sql';
    END IF;
    
    IF tariff_referencial_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró la tarifa Referencial con IGV. Verificar que se ejecutó create-tariffs-system.sql';
    END IF;
    
    RAISE NOTICE 'Tarifa Base ID: %', tariff_base_id;
    RAISE NOTICE 'Tarifa Referencial ID: %', tariff_referencial_id;
    
    -- 3. Migrar precios de análisis existentes
    FOR analysis_record IN 
        SELECT id, name, price, reference_price 
        FROM public.analyses 
        WHERE price IS NOT NULL AND price > 0
    LOOP
        -- Insertar precio público (Base)
        INSERT INTO public.tariff_prices (tariff_id, exam_id, price)
        VALUES (tariff_base_id, analysis_record.id, analysis_record.price)
        ON CONFLICT (tariff_id, exam_id) DO UPDATE SET
            price = EXCLUDED.price,
            updated_at = now();
            
        insert_count := insert_count + 1;
        
        -- Insertar precio referencial si existe
        IF analysis_record.reference_price IS NOT NULL AND analysis_record.reference_price > 0 THEN
            INSERT INTO public.tariff_prices (tariff_id, exam_id, price)
            VALUES (tariff_referencial_id, analysis_record.id, analysis_record.reference_price)
            ON CONFLICT (tariff_id, exam_id) DO UPDATE SET
                price = EXCLUDED.price,
                updated_at = now();
                
            insert_count := insert_count + 1;
        ELSE
            -- Si no hay precio referencial, usar precio base con 20% descuento
            INSERT INTO public.tariff_prices (tariff_id, exam_id, price)
            VALUES (tariff_referencial_id, analysis_record.id, ROUND(analysis_record.price * 0.8, 2))
            ON CONFLICT (tariff_id, exam_id) DO UPDATE SET
                price = EXCLUDED.price,
                updated_at = now();
                
            insert_count := insert_count + 1;
        END IF;
        
        IF insert_count % 50 = 0 THEN
            RAISE NOTICE 'Migrados % análisis...', insert_count / 2;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✅ Migración completada. Total entradas creadas: %', insert_count;
END $$;

-- 4. Configurar referencia pública para usar tarifa Base
DO $$
DECLARE
    public_ref_id uuid;
    tariff_base_id uuid;
BEGIN
    -- Obtener ID de referencia pública
    SELECT id INTO public_ref_id 
    FROM public.references 
    WHERE name = 'Público General' 
    LIMIT 1;
    
    -- Obtener ID de tarifa Base
    SELECT id INTO tariff_base_id 
    FROM public.tariffs 
    WHERE name = 'Base' AND type = 'sale' 
    LIMIT 1;
    
    IF public_ref_id IS NOT NULL AND tariff_base_id IS NOT NULL THEN
        UPDATE public.references 
        SET default_tariff_id = tariff_base_id 
        WHERE id = public_ref_id;
        
        RAISE NOTICE '✅ Referencia Público General configurada con tarifa Base';
    END IF;
END $$;

-- 5. Configurar referencia de médicos para usar tarifa referencial
DO $$
DECLARE
    doctors_ref_id uuid;
    tariff_ref_id uuid;
BEGIN
    -- Obtener ID de referencia de médicos
    SELECT id INTO doctors_ref_id 
    FROM public.references 
    WHERE name = 'Médicos' 
    LIMIT 1;
    
    -- Obtener ID de tarifa referencial
    SELECT id INTO tariff_ref_id 
    FROM public.tariffs 
    WHERE name = 'Referencial con IGV' AND type = 'sale' 
    LIMIT 1;
    
    IF doctors_ref_id IS NOT NULL AND tariff_ref_id IS NOT NULL THEN
        UPDATE public.references 
        SET default_tariff_id = tariff_ref_id 
        WHERE id = doctors_ref_id;
        
        RAISE NOTICE '✅ Referencia Médicos configurada con tarifa Referencial';
    END IF;
END $$;

-- 6. Configurar referencia de empresas para usar tarifa referencial
DO $$
DECLARE
    companies_ref_id uuid;
    tariff_ref_id uuid;
BEGIN
    -- Obtener ID de referencia de empresas
    SELECT id INTO companies_ref_id 
    FROM public.references 
    WHERE name = 'Empresas' 
    LIMIT 1;
    
    -- Obtener ID de tarifa referencial
    SELECT id INTO tariff_ref_id 
    FROM public.tariffs 
    WHERE name = 'Referencial con IGV' AND type = 'sale' 
    LIMIT 1;
    
    IF companies_ref_id IS NOT NULL AND tariff_ref_id IS NOT NULL THEN
        UPDATE public.references 
        SET default_tariff_id = tariff_ref_id 
        WHERE id = companies_ref_id;
        
        RAISE NOTICE '✅ Referencia Empresas configurada con tarifa Referencial';
    END IF;
END $$;

-- 7. Estadísticas finales
SELECT 
    'RESUMEN DE MIGRACIÓN' as titulo,
    (SELECT count(*) FROM public.analyses WHERE price > 0) as total_analyses,
    (SELECT count(*) FROM public.tariff_prices) as total_precios_migrados,
    (SELECT count(DISTINCT tariff_id) FROM public.tariff_prices) as tarifas_utilizadas,
    (SELECT count(*) FROM public.references WHERE default_tariff_id IS NOT NULL) as referencias_configuradas;

RAISE NOTICE '🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE';
RAISE NOTICE '📊 Revisar estadísticas en la consulta final';
RAISE NOTICE '⚠️  IMPORTANTE: Verificar que el sistema de precios dinámicos funciona correctamente'; 