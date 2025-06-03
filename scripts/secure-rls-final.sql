-- SCRIPT FINAL PARA HABILITAR RLS DE FORMA SEGURA
-- Este script maneja automáticamente los problemas de tipos de datos
-- Ejecutar en el SQL Editor de Supabase

-- ===========================================================================
-- VERSIÓN FINAL - MANEJA TIPOS DE DATOS AUTOMÁTICAMENTE
-- ===========================================================================

BEGIN;

-- 1. VERIFICAR TABLAS EXISTENTES Y SUS ESTRUCTURAS
-- ================================================

SELECT 
    '🔍 VERIFICANDO TABLAS EXISTENTES' as info,
    tablename,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS YA HABILITADO' 
        ELSE '🔓 RLS DESHABILITADO' 
    END as current_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'biblioteca_digital', 'configuracion_secciones', 
    'perfiles_bienestar', 'analyses', 'doctors', 'profiles',
    'about_content', 'patients', 'services', 'appointments'
)
ORDER BY tablename;

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

-- 3. FUNCIONES HELPER MEJORADAS
-- =============================

-- Función para habilitar RLS de forma segura
CREATE OR REPLACE FUNCTION enable_rls_safe(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    table_exists BOOLEAN;
    result TEXT;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = table_name
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
        result := '✅ RLS habilitado en ' || table_name;
    ELSE
        result := '⚠️ Tabla ' || table_name || ' no existe';
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar políticas de forma segura
CREATE OR REPLACE FUNCTION clean_policies_safe(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    table_exists BOOLEAN;
    policy_record RECORD;
    result TEXT;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = table_name
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Eliminar todas las políticas existentes de la tabla
        FOR policy_record IN 
            SELECT policyname FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = table_name
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 
                         policy_record.policyname, table_name);
        END LOOP;
        result := '🧹 Políticas limpiadas en ' || table_name;
    ELSE
        result := '⚠️ Tabla ' || table_name || ' no existe';
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. HABILITAR RLS EN TABLAS EXISTENTES
-- =====================================

SELECT enable_rls_safe('users');
SELECT enable_rls_safe('biblioteca_digital');
SELECT enable_rls_safe('configuracion_secciones');
SELECT enable_rls_safe('perfiles_bienestar');
SELECT enable_rls_safe('analyses');
SELECT enable_rls_safe('doctors');
SELECT enable_rls_safe('profiles');
SELECT enable_rls_safe('about_content');
SELECT enable_rls_safe('patients');
SELECT enable_rls_safe('services');
SELECT enable_rls_safe('appointments');

-- 5. LIMPIAR POLÍTICAS EXISTENTES
-- ===============================

SELECT clean_policies_safe('users');
SELECT clean_policies_safe('biblioteca_digital');
SELECT clean_policies_safe('configuracion_secciones');
SELECT clean_policies_safe('perfiles_bienestar');
SELECT clean_policies_safe('analyses');
SELECT clean_policies_safe('doctors');
SELECT clean_policies_safe('profiles');
SELECT clean_policies_safe('about_content');
SELECT clean_policies_safe('patients');
SELECT clean_policies_safe('services');
SELECT clean_policies_safe('appointments');

-- 6. CREAR POLÍTICAS BÁSICAS PARA ADMIN
-- =====================================

-- Función para crear políticas básicas de admin
CREATE OR REPLACE FUNCTION create_basic_admin_policy(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    table_exists BOOLEAN;
    result TEXT;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = table_name
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Solo crear política de admin (la más importante)
        EXECUTE format('CREATE POLICY "admin_full_access" ON public.%I FOR ALL USING (is_admin())', table_name);
        result := '✅ Política de admin creada para ' || table_name;
    ELSE
        result := '⚠️ Tabla ' || table_name || ' no existe';
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Aplicar política básica de admin a todas las tablas
SELECT create_basic_admin_policy('users');
SELECT create_basic_admin_policy('biblioteca_digital');
SELECT create_basic_admin_policy('configuracion_secciones');
SELECT create_basic_admin_policy('perfiles_bienestar');
SELECT create_basic_admin_policy('analyses');
SELECT create_basic_admin_policy('doctors');
SELECT create_basic_admin_policy('profiles');
SELECT create_basic_admin_policy('about_content');
SELECT create_basic_admin_policy('patients');
SELECT create_basic_admin_policy('services');
SELECT create_basic_admin_policy('appointments');

-- 7. POLÍTICAS ESPECÍFICAS DE LECTURA PÚBLICA (SOLO PARA TABLAS PÚBLICAS)
-- =======================================================================

-- Función para crear políticas de lectura pública
CREATE OR REPLACE FUNCTION create_public_read_policy(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    table_exists BOOLEAN;
    result TEXT;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = table_name
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE format('CREATE POLICY "public_read" ON public.%I FOR SELECT USING (true)', table_name);
        result := '✅ Política de lectura pública creada para ' || table_name;
    ELSE
        result := '⚠️ Tabla ' || table_name || ' no existe';
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Aplicar lectura pública solo a tablas que deben ser públicas
SELECT create_public_read_policy('biblioteca_digital');
SELECT create_public_read_policy('configuracion_secciones');
SELECT create_public_read_policy('perfiles_bienestar');
SELECT create_public_read_policy('analyses');
SELECT create_public_read_policy('about_content');
SELECT create_public_read_policy('services');

-- 8. POLÍTICAS ESPECÍFICAS PARA USUARIOS Y MÉDICOS (SIN PROBLEMAS DE TIPOS)
-- =========================================================================

-- USERS: Permitir a usuarios ver/editar su propio perfil (solo si la tabla tiene UUID)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        -- Verificar si el campo id es uuid
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'id' 
            AND data_type = 'uuid'
        ) THEN
            CREATE POLICY "users_own_profile" ON public.users
                FOR ALL USING (auth.uid() = id);
            RAISE NOTICE '✅ Política de perfil propio creada para users';
        ELSE
            RAISE NOTICE '⚠️ Tabla users no tiene campo id de tipo uuid - solo admin tendrá acceso';
        END IF;
    END IF;
END $$;

-- DOCTORS: Permitir a médicos gestionar su propio perfil (solo si tiene user_id uuid)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'doctors') THEN
        -- Verificar si tiene campo user_id de tipo uuid
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'doctors' 
            AND column_name = 'user_id' 
            AND data_type = 'uuid'
        ) THEN
            CREATE POLICY "doctors_own_profile" ON public.doctors
                FOR ALL USING (auth.uid() = user_id);
            
            CREATE POLICY "doctors_public_verified" ON public.doctors
                FOR SELECT USING (is_active = true AND is_verified = true);
                
            RAISE NOTICE '✅ Políticas específicas creadas para doctors';
        ELSE
            RAISE NOTICE '⚠️ Tabla doctors no tiene user_id uuid - solo admin tendrá acceso';
        END IF;
    END IF;
END $$;

-- 9. VERIFICAR USUARIOS ADMIN
-- ===========================

DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        SELECT COUNT(*) INTO admin_count 
        FROM public.users 
        WHERE user_type = 'admin';
        
        IF admin_count = 0 THEN
            RAISE WARNING '⚠️ No se encontró ningún usuario admin!';
        ELSE
            RAISE NOTICE '✅ Encontrados % usuario(s) admin', admin_count;
        END IF;
    ELSE
        RAISE WARNING '⚠️ Tabla users no existe';
    END IF;
END $$;

-- 10. OTORGAR PERMISOS Y LIMPIAR
-- ==============================

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

-- Limpiar funciones helper
DROP FUNCTION IF EXISTS enable_rls_safe(TEXT);
DROP FUNCTION IF EXISTS clean_policies_safe(TEXT);
DROP FUNCTION IF EXISTS create_basic_admin_policy(TEXT);
DROP FUNCTION IF EXISTS create_public_read_policy(TEXT);

COMMIT;

-- 11. VERIFICACIÓN FINAL COMPLETA
-- ===============================

SELECT 
    '🏁 RESUMEN FINAL COMPLETO' as header,
    'Tabla: ' || tablename as tabla,
    CASE 
        WHEN rowsecurity THEN '✅ RLS HABILITADO' 
        ELSE '❌ RLS DESHABILITADO' 
    END as rls_status,
    COALESCE((SELECT COUNT(*)::text FROM pg_policies WHERE tablename = t.tablename), '0') || ' políticas' as politicas
FROM pg_tables t
WHERE schemaname = 'public' 
AND EXISTS (
    SELECT 1 FROM pg_tables pt
    WHERE pt.schemaname = 'public' 
    AND pt.tablename = t.tablename
    AND pt.tablename IN (
        'users', 'biblioteca_digital', 'configuracion_secciones', 
        'perfiles_bienestar', 'analyses', 'doctors', 'profiles',
        'about_content', 'patients', 'services', 'appointments'
    )
)
ORDER BY tablename;

-- Mostrar todas las políticas creadas
SELECT 
    '📋 POLÍTICAS ACTIVAS' as header,
    tablename as tabla,
    policyname as politica,
    cmd as tipo
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
        'users', 'biblioteca_digital', 'configuracion_secciones', 
        'perfiles_bienestar', 'analyses', 'doctors', 'profiles',
        'about_content', 'patients', 'services', 'appointments'
    )
)
ORDER BY tablename, policyname;

-- ===========================================================================
-- ✅ ESTE SCRIPT FINAL:
-- ===========================================================================
-- 
-- ✅ Maneja automáticamente problemas de tipos de datos
-- ✅ Habilita RLS solo en tablas que existen
-- ✅ Crea políticas básicas que siempre funcionan
-- ✅ Otorga acceso COMPLETO al admin sin excepciones
-- ✅ Añade funcionalidad específica cuando es posible
-- ✅ NO falla por incompatibilidades de tipos
-- ✅ Proporciona un resumen completo al final
-- 
-- GARANTÍA: El admin conserva TODOS sus permisos en TODAS las tablas
-- =========================================================================== 