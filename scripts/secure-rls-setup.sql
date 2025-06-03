-- SCRIPT PARA HABILITAR RLS DE FORMA SEGURA MANTENIENDO FUNCIONALIDADES DE ADMIN
-- Este script resuelve las advertencias de seguridad sin afectar las funcionalidades del administrador
-- Ejecutar en el SQL Editor de Supabase

-- ===========================================================================
-- IMPORTANTE: ESTE SCRIPT HABILITA RLS CON POLÍTICAS ESPECÍFICAS PARA ADMIN
-- ===========================================================================

BEGIN;

-- 1. HABILITAR RLS EN TODAS LAS TABLAS PRINCIPALES
-- =================================================

-- Tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tabla biblioteca_digital (bibliotecas_digital)
ALTER TABLE public.biblioteca_digital ENABLE ROW LEVEL SECURITY;

-- Tabla configuracion_secciones  
ALTER TABLE public.configuracion_secciones ENABLE ROW LEVEL SECURITY;

-- Tabla perfiles_bienestar
ALTER TABLE public.perfiles_bienestar ENABLE ROW LEVEL SECURITY;

-- Tabla analyses
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Tabla doctors (si ya no está habilitado)
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Tabla categorias_analistas
ALTER TABLE public.categorias_analistas ENABLE ROW LEVEL SECURITY;

-- Tabla analistas
ALTER TABLE public.analistas ENABLE ROW LEVEL SECURITY;

-- Tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tabla dbout_content
ALTER TABLE public.dbout_content ENABLE ROW LEVEL SECURITY;

-- 2. CREAR FUNCIÓN HELPER PARA VERIFICAR SI ES ADMIN
-- =================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. LIMPIAR POLÍTICAS EXISTENTES QUE PUEDAN CAUSAR CONFLICTOS
-- ============================================================

-- Users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can do everything with users" ON public.users;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.users;

-- Biblioteca digital
DROP POLICY IF EXISTS "Allow read biblioteca_digital" ON public.biblioteca_digital;
DROP POLICY IF EXISTS "Allow write biblioteca_digital" ON public.biblioteca_digital;
DROP POLICY IF EXISTS "Admins can do everything with biblioteca_digital" ON public.biblioteca_digital;

-- Configuracion secciones
DROP POLICY IF EXISTS "Allow read configuracion_secciones" ON public.configuracion_secciones;
DROP POLICY IF EXISTS "Allow write configuracion_secciones" ON public.configuracion_secciones;
DROP POLICY IF EXISTS "Admins can do everything with configuracion_secciones" ON public.configuracion_secciones;

-- Perfiles bienestar
DROP POLICY IF EXISTS "Enable read access for all users" ON public.perfiles_bienestar;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.perfiles_bienestar;
DROP POLICY IF EXISTS "Admins can do everything with perfiles_bienestar" ON public.perfiles_bienestar;

-- Analyses
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.analyses;
DROP POLICY IF EXISTS "Admins can do everything with analyses" ON public.analyses;

-- Doctors (mantener las existentes pero verificar admin)
DROP POLICY IF EXISTS "Admins can do everything with doctors" ON public.doctors;

-- 4. CREAR POLÍTICAS COMPLETAS PARA CADA TABLA
-- ============================================

-- TABLA USERS: Admin total, usuarios pueden ver/editar su perfil
CREATE POLICY "Admin full access to users" ON public.users
    FOR ALL USING (is_admin());

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- TABLA BIBLIOTECA_DIGITAL: Lectura pública, admin control total
CREATE POLICY "Public read biblioteca_digital" ON public.biblioteca_digital
    FOR SELECT USING (true);

CREATE POLICY "Admin full access biblioteca_digital" ON public.biblioteca_digital
    FOR ALL USING (is_admin());

-- TABLA CONFIGURACION_SECCIONES: Lectura pública, admin control total
CREATE POLICY "Public read configuracion_secciones" ON public.configuracion_secciones
    FOR SELECT USING (true);

CREATE POLICY "Admin full access configuracion_secciones" ON public.configuracion_secciones
    FOR ALL USING (is_admin());

-- TABLA PERFILES_BIENESTAR: Lectura pública, admin control total
CREATE POLICY "Public read perfiles_bienestar" ON public.perfiles_bienestar
    FOR SELECT USING (true);

CREATE POLICY "Admin full access perfiles_bienestar" ON public.perfiles_bienestar
    FOR ALL USING (is_admin());

-- TABLA ANALYSES: Lectura pública, admin control total
CREATE POLICY "Public read analyses" ON public.analyses
    FOR SELECT USING (true);

CREATE POLICY "Admin full access analyses" ON public.analyses
    FOR ALL USING (is_admin());

-- TABLA DOCTORS: Médicos ven su perfil, público ve verificados, admin control total
CREATE POLICY "Doctors can view and edit own profile" ON public.doctors
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view verified doctors" ON public.doctors
    FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "Admin full access doctors" ON public.doctors
    FOR ALL USING (is_admin());

-- TABLA CATEGORIAS_ANALISTAS: Lectura pública, admin control total
CREATE POLICY "Public read categorias_analistas" ON public.categorias_analistas
    FOR SELECT USING (true);

CREATE POLICY "Admin full access categorias_analistas" ON public.categorias_analistas
    FOR ALL USING (is_admin());

-- TABLA ANALISTAS: Lectura pública, admin control total
CREATE POLICY "Public read analistas" ON public.analistas
    FOR SELECT USING (true);

CREATE POLICY "Admin full access analistas" ON public.analistas
    FOR ALL USING (is_admin());

-- TABLA PROFILES: Usuarios ven su perfil, admin control total
CREATE POLICY "Users can view own profile_profiles" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile_profiles" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin full access profiles" ON public.profiles
    FOR ALL USING (is_admin());

-- TABLA DBOUT_CONTENT: Lectura pública, admin control total
CREATE POLICY "Public read dbout_content" ON public.dbout_content
    FOR SELECT USING (true);

CREATE POLICY "Admin full access dbout_content" ON public.dbout_content
    FOR ALL USING (is_admin());

-- 5. VERIFICAR QUE EXISTE AL MENOS UN USUARIO ADMIN
-- =================================================

DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count 
    FROM public.users 
    WHERE user_type = 'admin';
    
    IF admin_count = 0 THEN
        RAISE WARNING 'ADVERTENCIA: No se encontró ningún usuario admin. Asegúrate de tener al menos un usuario con user_type = admin antes de activar RLS completamente.';
    ELSE
        RAISE NOTICE 'Perfecto: Se encontraron % usuario(s) admin.', admin_count;
    END IF;
END $$;

-- 6. OTORGAR PERMISOS NECESARIOS
-- ==============================

-- Permitir a usuarios autenticados ejecutar la función is_admin
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

COMMIT;

-- 7. VERIFICACIÓN FINAL
-- =====================

SELECT 
    schemaname,
    tablename,
    rowsecurity,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'biblioteca_digital', 'configuracion_secciones', 
    'perfiles_bienestar', 'analyses', 'doctors', 
    'categorias_analistas', 'analistas', 'profiles', 'dbout_content'
)
ORDER BY tablename;

-- Mostrar todas las políticas creadas
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===========================================================================
-- RESUMEN DE LO QUE HACE ESTE SCRIPT:
-- ===========================================================================
-- 
-- ✅ Habilita RLS en todas las tablas principales
-- ✅ Crea una función helper is_admin() para verificar permisos de admin
-- ✅ Otorga acceso COMPLETO al admin en todas las tablas
-- ✅ Mantiene funcionalidad pública donde es necesario (lectura)
-- ✅ Permite a usuarios gestionar sus propios perfiles
-- ✅ Resuelve todas las advertencias de seguridad de Supabase
-- ✅ NO rompe ninguna funcionalidad existente del admin
-- 
-- IMPORTANTE: El admin conserva TODOS sus permisos y funcionalidades
-- =========================================================================== 