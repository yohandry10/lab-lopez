-- ====================================================================
-- SCRIPT ULTRA SIMPLE - SIN ERRORES DE TIPOS
-- ====================================================================

-- 1. VER CUÁNTOS PRECIOS HAY
SELECT COUNT(*) FROM tariff_prices;

-- 2. MIGRAR PRECIOS PÚBLICOS (SIN VALIDACIONES COMPLEJAS)
INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  (SELECT id FROM tariffs WHERE name = 'Base'),
  analyses.id,
  analyses.price
FROM analyses 
WHERE analyses.price > 0;

-- 3. MIGRAR PRECIOS EMPRESARIALES 
INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  (SELECT id FROM tariffs WHERE name = 'Referencial con IGV'),
  analyses.id,
  CASE 
    WHEN analyses.reference_price > 0 THEN analyses.reference_price
    ELSE analyses.price * 0.8
  END
FROM analyses 
WHERE analyses.price > 0;

-- 4. VER RESULTADOS
SELECT COUNT(*) as total_migrado FROM tariff_prices;

-- 5. VER ALGUNOS EJEMPLOS
SELECT 
  a.name, 
  t.name as tarifa, 
  tp.price
FROM tariff_prices tp
JOIN analyses a ON tp.exam_id = a.id  
JOIN tariffs t ON tp.tariff_id = t.id
LIMIT 5; 