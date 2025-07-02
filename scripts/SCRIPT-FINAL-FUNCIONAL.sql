-- ====================================================================
-- SCRIPT FINAL FUNCIONAL - BASADO EN TU BASE DE DATOS REAL
-- ====================================================================

-- 1. VERIFICAR QUE EXISTEN LAS TARIFAS NECESARIAS
SELECT id, name FROM tariffs WHERE name IN ('Base', 'Referencial con IGV');

-- 2. VER LOS ANÁLISIS EXISTENTES CON SUS PRECIOS
SELECT id, name, price, reference_price FROM analyses;

-- 3. VER ESTRUCTURA DE tariff_prices (para saber tipos de datos)
\d tariff_prices;

-- 4. INSERTAR PRECIOS PARA TARIFA "Base" (usando los IDs reales)
INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  t.id as tariff_id,
  a.id as exam_id,
  a.price
FROM analyses a
CROSS JOIN tariffs t
WHERE t.name = 'Base' 
  AND a.price IS NOT NULL 
  AND a.price > 0;

-- 5. INSERTAR PRECIOS PARA TARIFA "Referencial con IGV"
INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  t.id as tariff_id,
  a.id as exam_id,
  CASE 
    WHEN a.reference_price IS NOT NULL AND a.reference_price > 0 
    THEN a.reference_price
    ELSE a.price * 0.8
  END as price
FROM analyses a
CROSS JOIN tariffs t
WHERE t.name = 'Referencial con IGV' 
  AND a.price IS NOT NULL 
  AND a.price > 0;

-- 6. VERIFICAR RESULTADOS
SELECT COUNT(*) as total_precios_insertados FROM tariff_prices;

-- 7. VER ALGUNOS EJEMPLOS
SELECT 
  a.name as analisis,
  t.name as tarifa,
  tp.price as precio
FROM tariff_prices tp
JOIN analyses a ON tp.exam_id = a.id
JOIN tariffs t ON tp.tariff_id = t.id
ORDER BY a.name, t.name; 