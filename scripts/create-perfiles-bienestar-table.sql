-- Crear tabla perfiles_bienestar en Supabase
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

-- Insertar datos iniciales basados en los perfiles existentes
INSERT INTO public.perfiles_bienestar (slug, title, description, content, price, image, locations, sample_type, age_requirement, tests, conditions) VALUES
(
    'prevencion-total',
    'Perfil Prevención total',
    'Una visión clara de lo que importa para poner tu salud en perspectiva. Este perfil te permitirá conocer de manera general cómo está tu organismo, para prevenir y/o tratar alguna enfermedad de forma oportuna. La salud es una relación entre tú y tu cuerpo, cuidarla depende de ti; pero permítenos acompañarte.',
    'Este perfil está diseñado para brindarte un panorama general de tu salud. Con exámenes clave, podrás identificar áreas de riesgo y tomar medidas preventivas a tiempo.',
    690.00,
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede', 'Domicilio'],
    'General',
    'Cualquier edad',
    ARRAY['HEMOGRAMA', 'GLUCOSA', 'UREA', 'CREATININA', 'COLESTEROL TOTAL', 'TRIGLICÉRIDOS', 'HDL', 'LDL', 'ÁCIDO ÚRICO', 'PROTEÍNAS TOTALES'],
    ARRAY['Ayuno de 8 horas', 'No realizar ejercicio intenso 24 horas antes', 'Informar sobre medicamentos en uso']
),
(
    'hombre-saludable',
    'Perfil Hombre saludable',
    'Este perfil proporciona una mirada a tu salud en general, abordando las dudas más comunes que pueden surgir en los hombres entre 18 y 45 años. Compuesto por 16 pruebas, te ayudará a cuidar tu bienestar.',
    'Pensado para hombres que desean un chequeo integral, este perfil evalúa indicadores clave para que tomes decisiones informadas sobre tu salud.',
    450.00,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede', 'Domicilio'],
    'General',
    '18-45 años',
    ARRAY['HEMOGRAMA', 'GLUCOSA', 'UREA', 'CREATININA', 'COLESTEROL TOTAL', 'TRIGLICÉRIDOS', 'HDL', 'LDL', 'PSA TOTAL', 'PSA LIBRE', 'TESTOSTERONA TOTAL', 'TESTOSTERONA LIBRE', 'CORTISOL', 'TSH', 'T4 LIBRE', 'T3'],
    ARRAY['Ayuno de 8 horas', 'No realizar ejercicio intenso 24 horas antes', 'Informar sobre medicamentos en uso', 'Para PSA: No tener relaciones sexuales 48 horas antes']
),
(
    'mujer-saludable',
    'Perfil Mujer saludable',
    'Este perfil es esencial para examinar tu salud, controlar tus niveles hormonales y conocer tu riesgo a desarrollar enfermedades crónicas antes de los 45 años.',
    'Diseñado especialmente para mujeres, este perfil te ayudará a mantener un control integral de tu salud, anticipando posibles complicaciones.',
    550.00,
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede', 'Domicilio'],
    'General',
    'Hasta 45 años',
    ARRAY['HEMOGRAMA', 'GLUCOSA', 'UREA', 'CREATININA', 'COLESTEROL TOTAL', 'TRIGLICÉRIDOS', 'HDL', 'LDL', 'TSH', 'T4 LIBRE', 'T3', 'FSH', 'LH', 'ESTRADIOL', 'PROGESTERONA', 'PROLACTINA'],
    ARRAY['Ayuno de 8 horas', 'No realizar ejercicio intenso 24 horas antes', 'Informar sobre medicamentos en uso', 'Para hormonas: Tomar la muestra en los primeros días del ciclo menstrual']
),
(
    'preoperatorio',
    'Perfil Preoperatorio',
    'Si tu médico te ha solicitado exámenes preoperatorios, conoce las pruebas que integran nuestro perfil preoperatorio.',
    'Este perfil reúne las pruebas necesarias para garantizar que estés en óptimas condiciones antes de una cirugía.',
    0.00,
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede'],
    'General',
    'Mayor de 18',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[]
),
(
    'salud-sexual',
    'Perfil Salud sexual',
    'La salud sexual requiere un enfoque positivo y respetuoso, con experiencias seguras y libres de temores. Con información oportuna, adquiere hábitos saludables.',
    'Este perfil te permite evaluar tu salud sexual mediante exámenes específicos, garantizando una atención integral y preventiva.',
    300.00,
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede', 'Domicilio'],
    'Sangre',
    '18 años en adelante',
    ARRAY['HIV 1/2 anticuerpo antígeno', 'Hepatitis B, antígeno australiano (HBsAg)', 'Hepatitis B, anticore total (anti-HBcAg)', 'Hepatitis C anticuerpos', 'VDRL'],
    ARRAY['Los análisis en sangre NO requieren ayuno.', 'Informa sobre medicamentos o tratamientos durante la toma de muestra.']
),
(
    'salud-metabolica',
    'Perfil Salud metabólica',
    'Evalúa cómo trabaja tu metabolismo para transformar lo que comes en energía y detectar desbalances que puedan afectar tu bienestar.',
    'Este perfil analiza los procesos metabólicos para brindarte una imagen clara de cómo funciona tu organismo.',
    0.00,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede', 'Domicilio'],
    'General',
    'Cualquier edad',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[]
),
(
    'masculino-edad-oro',
    'Perfil masculino Edad de oro',
    'Conoce los cambios normales y aquellos que pueden ser señal de un problema de salud. Este perfil te ayuda a entender y monitorear tu organismo con el paso de los años.',
    'Especialmente diseñado para hombres mayores de 45, este perfil integra diversas pruebas para evaluar tu salud integral y anticipar posibles complicaciones.',
    690.00,
    'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede', 'Domicilio'],
    'Sangre, Orina',
    '45 años en adelante',
    ARRAY['Hemograma', 'Ácido fólico', 'Glucosa', 'Colesterol total', 'Colesterol HDL', 'Colesterol LDL', 'Colesterol VLDL', 'Triglicéridos', 'Creatinina', 'Urea', 'Ácido úrico', 'Transaminasa oxalacética TGO', 'Transaminasa pirúvica TGP', 'Vitamina B12', 'Vitamina D', 'TSH', 'PRO - BNP', 'PSA', 'Examen completo de orina'],
    ARRAY['Los análisis en sangre requieren ayuno mínimo de 8 horas y máximo de 12 horas.', 'Si tomas medicamentos o sigues un tratamiento, infórmalo al momento de la toma de muestra.']
),
(
    'diabetes-control',
    'Perfil Diabetes bajo control',
    'Monitorea tus niveles de azúcar para detectar indicios de prediabetes o diabetes a tiempo.',
    'A través de exámenes específicos, este perfil evalúa tus niveles de glucosa y otros indicadores críticos, permitiéndote tomar medidas preventivas.',
    120.00,
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ARRAY['Sede', 'Domicilio'],
    'Sangre',
    '18 años en adelante',
    ARRAY['Glucosa', 'Insulina basal', 'Hemoglobina glicosilada'],
    ARRAY['Los análisis en sangre requieren ayuno mínimo de 8 horas y máximo de 12 horas.', 'Si tomas medicamentos o sigues un tratamiento, infórmalo al momento de la toma de muestra.']
);

-- Insertar los perfiles básicos de la página principal
INSERT INTO perfiles_bienestar (
    slug, title, description, content, price, image, locations, sample_type, age_requirement, tests, conditions
) VALUES
(
    'salud-sexual',
    'Salud Sexual',
    'Confianza, libertad y seguridad para elegir',
    'Servicios especializados en salud sexual para brindar confianza, libertad y seguridad en tus decisiones de salud íntima.',
    0.00,
    '/diabetes.jpg',
    ARRAY['Sede', 'Domicilio'],
    'General',
    'Cualquier edad',
    ARRAY['Consulta especializada', 'Exámenes de rutina', 'Orientación preventiva'],
    ARRAY['Consulta médica previa recomendada']
),
(
    'masculino-edad-oro',
    'Masculino Edad de Oro',
    'Experiencia, sabiduría y plenitud',
    'Programa especializado para hombres en la etapa dorada de la vida, enfocado en mantener la salud y vitalidad.',
    0.00,
    '/viejitos.jpg',
    ARRAY['Sede', 'Domicilio'],
    'General',
    'Mayores de 50 años',
    ARRAY['Chequeo geriátrico', 'Evaluación prostática', 'Control cardiovascular'],
    ARRAY['Ayuno de 8 horas para algunos exámenes']
),
(
    'diabetes-control',
    'Diabetes bajo control',
    'Estilo de vida, autocontrol, bienestar',
    'Programa integral para el control y manejo de la diabetes, promoviendo un estilo de vida saludable y el autocontrol.',
    0.00,
    '/perfil.jpg',
    ARRAY['Sede', 'Domicilio'],
    'Sangre',
    'Cualquier edad',
    ARRAY['Glucosa en ayunas', 'Hemoglobina glicosilada', 'Control lipídico', 'Función renal'],
    ARRAY['Ayuno de 8 horas', 'Tomar medicamentos según indicación médica']
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.perfiles_bienestar ENABLE ROW LEVEL SECURITY;

-- Crear política que permite lectura a todos y escritura solo a usuarios autenticados
CREATE POLICY "Enable read access for all users" ON public.perfiles_bienestar
    FOR SELECT USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON public.perfiles_bienestar
    FOR ALL USING (auth.role() = 'authenticated');

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_perfiles_bienestar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_perfiles_bienestar_updated_at 
    BEFORE UPDATE ON public.perfiles_bienestar
    FOR EACH ROW EXECUTE FUNCTION update_perfiles_bienestar_updated_at();

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_perfiles_bienestar_slug ON public.perfiles_bienestar(slug);
CREATE INDEX IF NOT EXISTS idx_perfiles_bienestar_is_active ON public.perfiles_bienestar(is_active);
CREATE INDEX IF NOT EXISTS idx_perfiles_bienestar_created_at ON public.perfiles_bienestar(created_at); 