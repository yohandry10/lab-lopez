-- VERIFICAR SI TODAS LAS TABLAS EXISTEN Y TIENEN DATOS
-- EJECUTAR ESTE SCRIPT PARA DIAGNOSTICAR EL PROBLEMA

-- 1. Verificar si configuracion_secciones existe
SELECT 'configuracion_secciones' as tabla, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'configuracion_secciones') 
            THEN 'EXISTE' 
            ELSE 'NO EXISTE' 
       END as estado;

-- 2. Si existe, mostrar datos
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'configuracion_secciones') THEN
        RAISE NOTICE 'Datos en configuracion_secciones:';
        FOR rec IN SELECT * FROM configuracion_secciones LOOP
            RAISE NOTICE 'ID: %, Seccion: %, Titulo: %', rec.id, rec.seccion, rec.titulo;
        END LOOP;
    ELSE
        RAISE NOTICE 'La tabla configuracion_secciones NO EXISTE';
    END IF;
END $$;

-- 3. Verificar políticas de configuracion_secciones
SELECT 'Políticas configuracion_secciones' as info, 
       schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'configuracion_secciones';

-- 4. Crear la tabla configuracion_secciones si no existe
CREATE TABLE IF NOT EXISTS configuracion_secciones (
    id SERIAL PRIMARY KEY,
    seccion TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Insertar datos si no existen
INSERT INTO configuracion_secciones (seccion, titulo) VALUES
('perfiles_bienestar', 'Perfiles de bienestar')
ON CONFLICT (seccion) DO NOTHING;

-- 6. DESHABILITAR RLS TEMPORALMENTE PARA TESTING
ALTER TABLE configuracion_secciones DISABLE ROW LEVEL SECURITY;

-- 7. Verificar datos finales
SELECT * FROM configuracion_secciones; 