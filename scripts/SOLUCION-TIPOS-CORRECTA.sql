-- ====================================================================
-- SOLUCIÓN CORRECTA - CONVERSIÓN DE TIPOS UUID/INTEGER
-- ====================================================================

-- 1. VER ESTRUCTURA DE TABLAS
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'analyses' AND column_name = 'id';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tariff_prices' AND column_name = 'exam_id';

-- 2. MIGRACIÓN CON CONVERSIÓN CORRECTA
INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  (SELECT id FROM tariffs WHERE name = 'Base'),
  analyses.id::uuid,  -- CONVERSIÓN A UUID
  analyses.price
FROM analyses 
WHERE analyses.price > 0
ON CONFLICT DO NOTHING;

-- 3. MIGRACIÓN EMPRESARIAL
INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  (SELECT id FROM tariffs WHERE name = 'Referencial con IGV'),
  analyses.id::uuid,  -- CONVERSIÓN A UUID
  COALESCE(analyses.reference_price, analyses.price * 0.8)
FROM analyses 
WHERE analyses.price > 0
ON CONFLICT DO NOTHING;

-- 4. VERIFICAR RESULTADOS
SELECT COUNT(*) FROM tariff_prices; 