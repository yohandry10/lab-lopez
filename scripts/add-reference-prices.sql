-- Agregar columna para precios referenciales (para empresas y médicos)
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS reference_price DECIMAL(10,2) DEFAULT 0.00;

-- Comentario explicativo
COMMENT ON COLUMN analyses.reference_price IS 'Precio especial para empresas y médicos (diferente al precio público)';

-- Actualizar precios referenciales (20% menos que precio público como ejemplo)
UPDATE analyses SET reference_price = ROUND(price * 0.8, 2) WHERE reference_price = 0.00;

-- Verificar que se aplicaron los cambios
SELECT name, price as precio_publico, reference_price as precio_referencial 
FROM analyses 
ORDER BY name 
LIMIT 10; 