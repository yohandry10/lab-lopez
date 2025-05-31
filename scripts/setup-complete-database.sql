-- ============================================
-- SCRIPT COMPLETO PARA CONFIGURAR BASE DE DATOS
-- LABORATORIO LOPEZ - PRODUCCIÓN
-- ============================================

-- 1. CREAR TABLA PERFILES_BIENESTAR
CREATE TABLE IF NOT EXISTS public.perfiles_bienestar (
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

-- 2. INSERTAR DATOS PRINCIPALES (SI NO EXISTEN)
INSERT INTO public.perfiles_bienestar (slug, title, description, content, price, image, locations, sample_type, age_requirement, tests, conditions) 
VALUES
(
    'salud-sexual',
    'Salud Sexual',
    'Confianza, libertad y seguridad para elegir',
    'Servicios especializados en salud sexual para brindar confianza, libertad y seguridad en tus decisiones de salud íntima.',
    300.00,
    '/diabetes.jpg',
    ARRAY['Sede', 'Domicilio'],
    'Sangre',
    '18 años en adelante',
    ARRAY['HIV 1/2 anticuerpo antígeno', 'Hepatitis B', 'Hepatitis C anticuerpos', 'VDRL'],
    ARRAY['Los análisis en sangre NO requieren ayuno', 'Informar medicamentos durante la toma']
),
(
    'masculino-edad-oro',
    'Masculino Edad de Oro', 
    'Experiencia, sabiduría y plenitud',
    'Programa especializado para hombres en la etapa dorada de la vida, enfocado en mantener la salud y vitalidad.',
    690.00,
    '/viejitos.jpg',
    ARRAY['Sede', 'Domicilio'],
    'Sangre, Orina',
    '45 años en adelante',
    ARRAY['Hemograma', 'Glucosa', 'Colesterol', 'PSA', 'Vitamina D', 'Examen de orina'],
    ARRAY['Ayuno de 8-12 horas', 'Informar medicamentos']
),
(
    'diabetes-control',
    'Diabetes bajo control',
    'Estilo de vida, autocontrol, bienestar', 
    'Programa integral para el control y manejo de la diabetes, promoviendo un estilo de vida saludable.',
    120.00,
    '/perfil.jpg',
    ARRAY['Sede', 'Domicilio'],
    'Sangre',
    '18 años en adelante',
    ARRAY['Glucosa en ayunas', 'Hemoglobina glicosilada', 'Control lipídico', 'Función renal'],
    ARRAY['Ayuno de 8-12 horas', 'Tomar medicamentos según indicación médica']
)
ON CONFLICT (slug) DO NOTHING;

-- 3. HABILITAR RLS (Row Level Security)
ALTER TABLE public.perfiles_bienestar ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS DE SEGURIDAD
DROP POLICY IF EXISTS "Enable read access for all users" ON public.perfiles_bienestar;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.perfiles_bienestar;

CREATE POLICY "Enable read access for all users" ON public.perfiles_bienestar
    FOR SELECT USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON public.perfiles_bienestar
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. FUNCIÓN PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_perfiles_bienestar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. TRIGGER PARA updated_at
DROP TRIGGER IF EXISTS update_perfiles_bienestar_updated_at ON public.perfiles_bienestar;
CREATE TRIGGER update_perfiles_bienestar_updated_at 
    BEFORE UPDATE ON public.perfiles_bienestar
    FOR EACH ROW EXECUTE FUNCTION update_perfiles_bienestar_updated_at();

-- 7. ÍNDICES PARA RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_perfiles_bienestar_slug ON public.perfiles_bienestar(slug);
CREATE INDEX IF NOT EXISTS idx_perfiles_bienestar_is_active ON public.perfiles_bienestar(is_active);
CREATE INDEX IF NOT EXISTS idx_perfiles_bienestar_created_at ON public.perfiles_bienestar(created_at);

-- 8. HABILITAR TIEMPO REAL (REALTIME)
ALTER PUBLICATION supabase_realtime ADD TABLE public.perfiles_bienestar;

-- 9. VERIFICAR DATOS
SELECT 'Perfiles insertados:' as status, count(*) as total FROM public.perfiles_bienestar;
SELECT slug, title, is_active FROM public.perfiles_bienestar ORDER BY created_at; 