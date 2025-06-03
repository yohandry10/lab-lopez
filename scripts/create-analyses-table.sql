-- Crear tabla analyses en Supabase
CREATE TABLE IF NOT EXISTS public.analyses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    conditions TEXT DEFAULT '',
    sample TEXT DEFAULT '',
    protocol TEXT DEFAULT '',
    suggestions TEXT DEFAULT '',
    comments TEXT DEFAULT '',
    category TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar datos iniciales
INSERT INTO public.analyses (id, name, price, conditions, sample, protocol, suggestions, comments, category) VALUES
(1, 'ÁCIDO FÓLICO', 120.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Hematología'),
(2, 'ÁCIDO ÚRICO', 80.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(3, 'ALANINA AMINOTRANSFERASA (ALT/TGP)', 90.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(4, 'ALBÚMINA', 85.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(5, 'ALDOLASA', 150.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(6, 'ALFA 1 ANTITRIPSINA', 180.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Inmunología'),
(7, 'ALFA FETOPROTEÍNA (AFP)', 200.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Marcadores Tumorales'),
(8, 'AMILASA', 110.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(9, 'ANDROSTENEDIONA', 220.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Hormonas'),
(10, 'BILIRRUBINA DIRECTA', 90.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(11, 'BILIRRUBINA TOTAL', 90.00, 'Sí', 'Suero', '5 mL Subo Tapón Rojo', '', '', 'Bioquímica'),
(12, 'BETA HCG CUANTITATIVA', 150.00, 'No', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Hormonas'),
(13, 'CALCIO', 85.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(14, 'COLESTEROL HDL', 100.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(15, 'COLESTEROL LDL', 100.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(16, 'COLESTEROL TOTAL', 90.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(17, 'CORTISOL', 130.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Hormonas'),
(18, 'CREATININA', 80.00, 'Sí', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Bioquímica'),
(19, 'DENGUE, ANTICUERPOS IGG E IGM', 250.00, 'No', 'Suero', '5 mL Suero en Tubo Tapón Rojo', '', '', 'Inmunología'),
(20, 'DÍMERO D', 280.00, 'No', 'Plasma', '5 mL Plasma en Tubo Tapón Azul', '', '', 'Coagulación');

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Crear política que permite todo a usuarios autenticados
CREATE POLICY "Enable all operations for authenticated users" ON public.analyses
    FOR ALL USING (true);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON public.analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 