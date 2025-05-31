-- SCRIPT CORREGIDO SIN ERRORES DE SINTAXIS
-- EJECUTAR ESTE SCRIPT COMPLETO EN SUPABASE

-- 1. Crear la tabla configuracion_secciones
CREATE TABLE IF NOT EXISTS configuracion_secciones (
    id SERIAL PRIMARY KEY,
    seccion TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insertar datos iniciales
INSERT INTO configuracion_secciones (seccion, titulo) VALUES
('perfiles_bienestar', 'Perfiles de bienestar')
ON CONFLICT (seccion) DO NOTHING;

-- 3. DESHABILITAR RLS PARA TESTING
ALTER TABLE configuracion_secciones DISABLE ROW LEVEL SECURITY;

-- 4. Verificar que se creó correctamente
SELECT 'configuracion_secciones creada' as resultado, * FROM configuracion_secciones;

-- 5. Arreglar biblioteca_digital
DO $$ 
BEGIN
    -- Agregar contenido si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'contenido') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN contenido TEXT DEFAULT '';
        RAISE NOTICE 'Columna contenido agregada a biblioteca_digital';
    END IF;

    -- Agregar categoria si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'categoria') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN categoria TEXT DEFAULT 'Análisis clínicos';
        RAISE NOTICE 'Columna categoria agregada a biblioteca_digital';
    END IF;
END $$;

-- 6. Deshabilitar RLS en biblioteca_digital también
ALTER TABLE biblioteca_digital DISABLE ROW LEVEL SECURITY;

-- 7. Verificar estructura de biblioteca_digital
SELECT 'biblioteca_digital - columnas' as info, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'biblioteca_digital' 
ORDER BY ordinal_position;

-- 8. Crear/recrear tabla perfiles_bienestar
DROP TABLE IF EXISTS perfiles_bienestar CASCADE;

CREATE TABLE perfiles_bienestar (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT DEFAULT '',
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    image TEXT DEFAULT '',
    locations TEXT[] DEFAULT ARRAY['Sede'],
    sample_type TEXT DEFAULT 'General',
    age_requirement TEXT DEFAULT 'Cualquier edad',
    tests TEXT[] DEFAULT ARRAY[]::TEXT[],
    conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Insertar datos en perfiles_bienestar
INSERT INTO perfiles_bienestar (slug, title, description, content, price, image, locations, sample_type, age_requirement, tests, conditions) VALUES
('salud-sexual', 'Salud Sexual', 'Confianza, libertad y seguridad para elegir', 'La salud sexual requiere un enfoque positivo', 300.00, '/diabetes.jpg', ARRAY['Sede', 'Domicilio'], 'Sangre', '18 años en adelante', ARRAY['HIV 1/2', 'Hepatitis B'], ARRAY['No requiere ayuno']),
('masculino-edad-oro', 'Masculino Edad de Oro', 'Experiencia, sabiduría y plenitud', 'Conoce los cambios normales', 690.00, '/viejitos.jpg', ARRAY['Sede', 'Domicilio'], 'Sangre', '45 años en adelante', ARRAY['Hemograma', 'PSA'], ARRAY['Ayuno de 8 horas']),
('diabetes-control', 'Diabetes bajo control', 'Estilo de vida, autocontrol, bienestar', 'Monitorea tus niveles de azúcar', 120.00, '/perfil.jpg', ARRAY['Sede', 'Domicilio'], 'Sangre', '18 años en adelante', ARRAY['Glucosa'], ARRAY['Ayuno de 8 horas']);

-- 10. Deshabilitar RLS en perfiles_bienestar
ALTER TABLE perfiles_bienestar DISABLE ROW LEVEL SECURITY;

-- 11. Verificar que todo está correcto
SELECT 'perfiles_bienestar creado' as resultado, count(*) as total_perfiles FROM perfiles_bienestar;

-- 12. VERIFICACIÓN FINAL
SELECT 'TABLAS VERIFICADAS' as estado;
SELECT 'configuracion_secciones' as tabla, count(*) as registros FROM configuracion_secciones
UNION ALL
SELECT 'biblioteca_digital' as tabla, count(*) as registros FROM biblioteca_digital  
UNION ALL
SELECT 'perfiles_bienestar' as tabla, count(*) as registros FROM perfiles_bienestar; 