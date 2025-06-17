-- Script para actualizar títulos de secciones según requerimientos del PDF
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Actualizar título de "Perfiles de bienestar" a "Perfiles Preventivos"
INSERT INTO configuracion_secciones (seccion, titulo) VALUES
('perfiles_bienestar', 'Perfiles Preventivos')
ON CONFLICT (seccion) 
DO UPDATE SET 
    titulo = EXCLUDED.titulo,
    updated_at = NOW();

-- 2. Agregar configuración para "Biblioteca Digital" -> "Promociones Disponibles"
INSERT INTO configuracion_secciones (seccion, titulo) VALUES
('biblioteca_digital', 'Promociones Disponibles')
ON CONFLICT (seccion) 
DO UPDATE SET 
    titulo = EXCLUDED.titulo,
    updated_at = NOW();

-- Verificar cambios
SELECT * FROM configuracion_secciones ORDER BY seccion; 