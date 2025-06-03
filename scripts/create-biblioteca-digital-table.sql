-- Crear tabla biblioteca_digital en Supabase con todas las columnas necesarias
-- Ejecutar este script en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS public.biblioteca_digital (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    contenido TEXT DEFAULT '',
    imagen_url TEXT DEFAULT '/placeholder.svg',
    categoria TEXT DEFAULT 'Análisis clínicos',
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Verificar si las columnas existen y agregarlas si no
DO $$ 
BEGIN
    -- Agregar contenido si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'contenido') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN contenido TEXT DEFAULT '';
        RAISE NOTICE 'Columna contenido agregada';
    END IF;

    -- Agregar imagen_url si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'imagen_url') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN imagen_url TEXT DEFAULT '/placeholder.svg';
        RAISE NOTICE 'Columna imagen_url agregada';
    END IF;

    -- Agregar categoria si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'categoria') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN categoria TEXT DEFAULT 'Análisis clínicos';
        RAISE NOTICE 'Columna categoria agregada';
    END IF;

    -- Agregar activo si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'activo') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN activo BOOLEAN DEFAULT true;
        RAISE NOTICE 'Columna activo agregada';
    END IF;

    -- Agregar orden si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'biblioteca_digital' AND column_name = 'orden') THEN
        ALTER TABLE biblioteca_digital ADD COLUMN orden INTEGER DEFAULT 1;
        RAISE NOTICE 'Columna orden agregada';
    END IF;
END $$;

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.biblioteca_digital ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir SELECT a todos
CREATE POLICY "Allow read biblioteca_digital" ON public.biblioteca_digital
    FOR SELECT USING (true);

-- Crear política para permitir INSERT/UPDATE/DELETE solo a usuarios autenticados
CREATE POLICY "Allow write biblioteca_digital" ON public.biblioteca_digital
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_biblioteca_digital_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_biblioteca_digital_updated_at ON biblioteca_digital;
CREATE TRIGGER trigger_update_biblioteca_digital_updated_at
    BEFORE UPDATE ON biblioteca_digital
    FOR EACH ROW
    EXECUTE FUNCTION update_biblioteca_digital_updated_at(); 