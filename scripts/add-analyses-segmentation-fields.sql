-- Script completo para agregar campos de segmentación a la tabla analyses
-- Ejecutar en Supabase para habilitar la funcionalidad de precios diferenciados

-- 1. Agregar columna para precios referenciales (para empresas y médicos)
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS reference_price DECIMAL(10,2) DEFAULT 0.00;

-- 2. Agregar columna para controlar si el análisis es visible al público
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS show_public BOOLEAN DEFAULT FALSE;

-- 3. Agregar comentarios explicativos
COMMENT ON COLUMN analyses.reference_price IS 'Precio especial para empresas y médicos (diferente al precio público)';
COMMENT ON COLUMN analyses.show_public IS 'Define si el análisis es visible para usuarios no autenticados y pacientes';

-- 4. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_analyses_show_public ON analyses(show_public);
CREATE INDEX IF NOT EXISTS idx_analyses_category_public ON analyses(category, show_public);

-- 5. Actualizar precios referenciales (20% menos que precio público como ejemplo)
UPDATE analyses SET reference_price = ROUND(price * 0.8, 2) WHERE reference_price = 0.00;

-- 6. Configurar algunos análisis como públicos por defecto (análisis básicos)
UPDATE analyses SET show_public = TRUE 
WHERE name ILIKE ANY (ARRAY[
  '%HEMOGRAMA%',
  '%GLUCOSA%',
  '%COLESTEROL%',
  '%TRIGLICÉRIDOS%',
  '%UREA%',
  '%CREATININA%',
  '%ÁCIDO ÚRICO%',
  '%PERFIL%'
]);

-- 7. Verificar que se aplicaron los cambios
SELECT 
    name, 
    price as precio_publico, 
    reference_price as precio_referencial,
    show_public as visible_publico,
    category
FROM analyses 
WHERE show_public = true
ORDER BY category, name 
LIMIT 20;

-- 8. Mostrar estadísticas de la segmentación
SELECT 
    'Total análisis' as tipo,
    COUNT(*) as cantidad
FROM analyses
UNION ALL
SELECT 
    'Análisis públicos' as tipo,
    COUNT(*) as cantidad
FROM analyses WHERE show_public = true
UNION ALL
SELECT 
    'Análisis empresariales' as tipo,
    COUNT(*) as cantidad
FROM analyses WHERE show_public = false; 