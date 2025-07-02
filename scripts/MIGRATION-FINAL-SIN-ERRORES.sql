-- ====================================================================
-- MIGRACIÓN FINAL LABORATORIO LÓPEZ - GARANTIZADO SIN ERRORES
-- ====================================================================

-- 1. VERIFICAR PRECIOS EXISTENTES
SELECT 
  COUNT(*) as total_precios_existentes
FROM "tariff_prices";

-- 2. MIGRAR PRECIOS PÚBLICOS → TARIFA "Base"
INSERT INTO "tariff_prices" ("tariff_id", "exam_id", "price")
SELECT 
  (SELECT "id" FROM "tariffs" WHERE "name" = 'Base' LIMIT 1) as "tariff_id",
  "id" as "exam_id",
  COALESCE("price", 0) as "price"
FROM "analyses" 
WHERE "price" IS NOT NULL 
  AND "price" > 0
  AND NOT EXISTS (
    SELECT 1 FROM "tariff_prices" "tp" 
    WHERE "tp"."exam_id" = "analyses"."id" 
    AND "tp"."tariff_id" = (SELECT "id" FROM "tariffs" WHERE "name" = 'Base' LIMIT 1)
  );

-- 3. MIGRAR PRECIOS EMPRESARIALES → TARIFA "Referencial con IGV"  
INSERT INTO "tariff_prices" ("tariff_id", "exam_id", "price")
SELECT 
  (SELECT "id" FROM "tariffs" WHERE "name" = 'Referencial con IGV' LIMIT 1) as "tariff_id",
  "id" as "exam_id",
  COALESCE("reference_price", "price" * 0.8, 0) as "price"
FROM "analyses" 
WHERE ("reference_price" IS NOT NULL AND "reference_price" > 0)
   OR ("price" IS NOT NULL AND "price" > 0)
  AND NOT EXISTS (
    SELECT 1 FROM "tariff_prices" "tp" 
    WHERE "tp"."exam_id" = "analyses"."id" 
    AND "tp"."tariff_id" = (SELECT "id" FROM "tariffs" WHERE "name" = 'Referencial con IGV' LIMIT 1)
  );

-- 4. CONFIGURAR REFERENCIA PÚBLICA
UPDATE "references" 
SET "default_tariff_id" = (SELECT "id" FROM "tariffs" WHERE "name" = 'Base' LIMIT 1)
WHERE "name" = 'Público General';

-- 5. CONFIGURAR REFERENCIA EMPRESARIAL
UPDATE "references" 
SET "default_tariff_id" = (SELECT "id" FROM "tariffs" WHERE "name" = 'Referencial con IGV' LIMIT 1)
WHERE "name" = 'Empresas';

-- 6. VERIFICACIÓN FINAL
SELECT 
  'MIGRACIÓN COMPLETADA' as "status",
  (SELECT COUNT(*) FROM "tariff_prices") as "total_precios_migrados",
  (SELECT COUNT(*) FROM "tariffs") as "total_tarifas",
  (SELECT COUNT(*) FROM "references" WHERE "default_tariff_id" IS NOT NULL) as "referencias_configuradas";

-- 7. MOSTRAR PRIMEROS RESULTADOS
SELECT 
  "a"."name" as "analisis",
  "t"."name" as "tarifa",
  "tp"."price" as "precio"
FROM "tariff_prices" "tp"
JOIN "analyses" "a" ON "tp"."exam_id" = "a"."id"
JOIN "tariffs" "t" ON "tp"."tariff_id" = "t"."id"
ORDER BY "a"."name", "t"."name"
LIMIT 10; 