-- ===========================================
-- SCRIPT COMPLETO PARA ARREGLAR TODO
-- EJECUTAR ESTE SCRIPT COMPLETO EN SUPABASE
-- ===========================================

-- 1. CREAR TABLA configuracion_secciones
DROP TABLE IF EXISTS configuracion_secciones CASCADE;
CREATE TABLE configuracion_secciones (
    id SERIAL PRIMARY KEY,
    seccion TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar datos iniciales
INSERT INTO configuracion_secciones (seccion, titulo) VALUES
('perfiles_bienestar', 'Perfiles de bienestar');

-- 2. ARREGLAR TABLA biblioteca_digital
DO $$ 
BEGIN
    -- Agregar contenido si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'contenido') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN contenido TEXT DEFAULT '';
    END IF;

    -- Agregar categoria si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'categoria') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN categoria TEXT DEFAULT 'Análisis clínicos';
    END IF;
END $$;

-- 3. CREAR TABLA perfiles_bienestar (COMPLETA)
DO $$
BEGIN
    -- Eliminar tabla si existe para recrearla limpia
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
    
    -- Insertar datos iniciales
    INSERT INTO perfiles_bienestar (slug, title, description, content, price, image, locations, sample_type, age_requirement, tests, conditions) VALUES
    ('salud-sexual', 'Salud Sexual', 'Confianza, libertad y seguridad para elegir', 'La salud sexual requiere un enfoque positivo y respetuoso, con experiencias seguras y libres de temores. Con información oportuna, adquiere hábitos saludables.', 300.00, '/diabetes.jpg', ARRAY['Sede', 'Domicilio'], 'Sangre', '18 años en adelante', ARRAY['HIV 1/2 anticuerpo antígeno', 'Hepatitis B, antígeno australiano (HBsAg)', 'Hepatitis B, anticore total (anti-HBcAg)', 'Hepatitis C anticuerpos', 'VDRL'], ARRAY['Los análisis en sangre NO requieren ayuno.', 'Informa sobre medicamentos o tratamientos durante la toma de muestra.']),
    ('masculino-edad-oro', 'Masculino Edad de Oro', 'Experiencia, sabiduría y plenitud', 'Conoce los cambios normales y aquellos que pueden ser señal de un problema de salud. Este perfil te ayuda a entender y monitorear tu organismo con el paso de los años.', 690.00, '/viejitos.jpg', ARRAY['Sede', 'Domicilio'], 'Sangre y Orina', '45 años en adelante', ARRAY['Hemograma completo', 'PSA total y libre', 'Testosterona total', 'Análisis bioquímicos', 'Glucosa'], ARRAY['Ayuno de 8 horas', 'No realizar ejercicio intenso 24 horas antes', 'Para PSA: No tener relaciones sexuales 48 horas antes']),
    ('diabetes-control', 'Diabetes bajo control', 'Estilo de vida, autocontrol, bienestar', 'Monitorea tus niveles de azúcar para detectar indicios de prediabetes o diabetes a tiempo. A través de exámenes específicos, este perfil evalúa tus niveles de glucosa y otros indicadores críticos.', 120.00, '/perfil.jpg', ARRAY['Sede', 'Domicilio'], 'Sangre', '18 años en adelante', ARRAY['Glucosa en ayunas', 'Hemoglobina glicosilada (HbA1c)', 'Tolerancia a la glucosa'], ARRAY['Ayuno de 8 horas', 'No consumir alcohol 24 horas antes']);
END $$;

-- 4. HABILITAR RLS Y CREAR POLÍTICAS
-- Para configuracion_secciones
ALTER TABLE configuracion_secciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read configuracion_secciones" ON configuracion_secciones;
DROP POLICY IF EXISTS "Allow write configuracion_secciones" ON configuracion_secciones;
CREATE POLICY "Allow read configuracion_secciones" ON configuracion_secciones FOR SELECT USING (true);
CREATE POLICY "Allow write configuracion_secciones" ON configuracion_secciones FOR ALL USING (true);

-- Para biblioteca_digital
ALTER TABLE biblioteca_digital ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read biblioteca_digital" ON biblioteca_digital;
DROP POLICY IF EXISTS "Allow write biblioteca_digital" ON biblioteca_digital;
CREATE POLICY "Allow read biblioteca_digital" ON biblioteca_digital FOR SELECT USING (true);
CREATE POLICY "Allow write biblioteca_digital" ON biblioteca_digital FOR ALL USING (true);

-- Para perfiles_bienestar
ALTER TABLE perfiles_bienestar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read perfiles_bienestar" ON perfiles_bienestar;
DROP POLICY IF EXISTS "Allow write perfiles_bienestar" ON perfiles_bienestar;
CREATE POLICY "Allow read perfiles_bienestar" ON perfiles_bienestar FOR SELECT USING (true);
CREATE POLICY "Allow write perfiles_bienestar" ON perfiles_bienestar FOR ALL USING (true);

-- 5. VERIFICAR QUE TODO ESTÉ CORRECTO
SELECT 'configuracion_secciones' as tabla, count(*) as registros FROM configuracion_secciones
UNION ALL
SELECT 'biblioteca_digital' as tabla, count(*) as registros FROM biblioteca_digital
UNION ALL
SELECT 'perfiles_bienestar' as tabla, count(*) as registros FROM perfiles_bienestar;

-- MENSAJE FINAL
SELECT '🎉 ¡TODAS LAS TABLAS CREADAS CORRECTAMENTE! 🎉' as resultado; 