-- Script para corregir incompatibilidad de tipos ID entre analyses y tariff_prices
-- analyses.id es SERIAL (integer) pero tariff_prices.exam_id es UUID

-- 1. Verificar el problema actual
SELECT 
  'analyses' as tabla,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name = 'analyses' AND column_name = 'id'
UNION ALL
SELECT 
  'tariff_prices' as tabla,
  column_name,
  data_type 
FROM information_schema.columns 
WHERE table_name = 'tariff_prices' AND column_name = 'exam_id';

-- 2. Hacer backup de datos existentes si los hay
CREATE TABLE IF NOT EXISTS tariff_prices_backup AS 
SELECT * FROM tariff_prices;

-- 3. Eliminar la tabla tariff_prices (recrearla con tipo correcto)
DROP TABLE IF EXISTS tariff_prices CASCADE;

-- 4. Recrear tabla tariff_prices con exam_id como INTEGER
CREATE TABLE public.tariff_prices (
  id         uuid primary key default gen_random_uuid(),
  tariff_id  uuid not null references public.tariffs(id) on delete cascade,
  exam_id    integer not null references public.analyses(id) on delete cascade,  -- ← CORREGIDO: integer en vez de uuid
  price      numeric(12,2) not null check (price >= 0),
  updated_at timestamptz   not null default now(),
  unique (tariff_id, exam_id)
);

-- 5. Crear índices
CREATE INDEX idx_tariff_prices_exam ON public.tariff_prices (exam_id);
CREATE INDEX idx_tariff_prices_tariff ON public.tariff_prices (tariff_id);

-- 6. Habilitar RLS
ALTER TABLE public.tariff_prices ENABLE ROW LEVEL SECURITY;

-- 7. Recrear políticas RLS
CREATE POLICY tariff_prices_read_auth
  ON public.tariff_prices
  FOR select using (auth.uid() is not null);

CREATE POLICY tariff_prices_admin_all
  ON public.tariff_prices
  FOR all
  using ((SELECT user_type FROM users WHERE id = auth.uid()) = 'admin')
  with check ((SELECT user_type FROM users WHERE id = auth.uid()) = 'admin');

-- 8. Recrear trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_timestamp_tariff_prices
  BEFORE UPDATE ON public.tariff_prices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 9. Grants
GRANT SELECT ON public.tariff_prices TO authenticated;

-- 10. Verificar que la corrección funcionó
SELECT 
  'RESULTADO' as status,
  'analyses.id' as campo,
  data_type as tipo_correcto
FROM information_schema.columns 
WHERE table_name = 'analyses' AND column_name = 'id'
UNION ALL
SELECT 
  'RESULTADO' as status,
  'tariff_prices.exam_id' as campo,
  data_type as tipo_correcto
FROM information_schema.columns 
WHERE table_name = 'tariff_prices' AND column_name = 'exam_id';

-- 11. Ahora ejecutar migración de precios
INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  (SELECT id FROM tariffs WHERE name = 'Base' LIMIT 1) as tariff_id,
  a.id as exam_id,  -- ← Ahora no necesita conversión
  a.price
FROM analyses a
WHERE a.price > 0;

INSERT INTO tariff_prices (tariff_id, exam_id, price)
SELECT 
  (SELECT id FROM tariffs WHERE name = 'Referencial con IGV' LIMIT 1) as tariff_id,
  a.id as exam_id,  -- ← Ahora no necesita conversión
  COALESCE(a.reference_price, a.price * 0.8)
FROM analyses a
WHERE a.price > 0;

-- 12. Estadísticas finales
SELECT 
  COUNT(*) as total_precios_migrados,
  COUNT(DISTINCT exam_id) as analisis_con_precios,
  COUNT(DISTINCT tariff_id) as tarifas_utilizadas
FROM tariff_prices;

-- 13. Mensaje de éxito
SELECT '✅ CORRECCIÓN COMPLETADA - ID types now match' as resultado; 