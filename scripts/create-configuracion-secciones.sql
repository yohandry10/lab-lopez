-- Crear tabla configuracion_secciones si no existe
-- Ejecutar este script en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS configuracion_secciones (
    id SERIAL PRIMARY KEY,
    seccion TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar datos iniciales
INSERT INTO configuracion_secciones (seccion, titulo) VALUES
('perfiles_bienestar', 'Perfiles de bienestar')
ON CONFLICT (seccion) DO NOTHING;

-- Verificar que se creó correctamente
SELECT * FROM configuracion_secciones; 