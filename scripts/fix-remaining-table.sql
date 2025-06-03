-- SCRIPT RÁPIDO PARA HABILITAR RLS EN LA TABLA FALTANTE
-- Ejecutar en el SQL Editor de Supabase

-- ===========================================================================
-- SOLUCIONAR LA ÚLTIMA ADVERTENCIA: public.categorias_analistas
-- ===========================================================================

BEGIN;

-- 1. VERIFICAR QUE LA TABLA EXISTE
-- ================================

SELECT 
    '🔍 VERIFICANDO TABLA FALTANTE' as info,
    tablename,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS YA HABILITADO' 
        ELSE '🔓 RLS DESHABILITADO' 
    END as current_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'categorias_analistas';

-- 2. HABILITAR RLS EN LA TABLA
-- ============================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categorias_analistas') THEN
        ALTER TABLE public.categorias_analistas ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE '✅ RLS habilitado en categorias_analistas';
    ELSE
        RAISE NOTICE '⚠️ Tabla categorias_analistas no existe';
    END IF;
END $$;

-- 3. LIMPIAR POLÍTICAS EXISTENTES (SI LAS HAY)
-- ============================================

DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categorias_analistas') THEN
        FOR policy_record IN 
            SELECT policyname FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = 'categorias_analistas'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.categorias_analistas', policy_record.policyname);
        END LOOP;
        RAISE NOTICE '🧹 Políticas limpiadas en categorias_analistas';
    END IF;
END $$;

-- 4. CREAR POLÍTICAS PARA LA TABLA
-- ================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categorias_analistas') THEN
        
        -- Política de admin completo (LA MÁS IMPORTANTE)
        CREATE POLICY "admin_full_access" ON public.categorias_analistas
            FOR ALL USING (is_admin());
        
        -- Política de lectura pública (para que la web funcione)
        CREATE POLICY "public_read" ON public.categorias_analistas
            FOR SELECT USING (true);
        
        RAISE NOTICE '✅ Políticas creadas para categorias_analistas';
        RAISE NOTICE '   - Admin: Acceso completo ✅';
        RAISE NOTICE '   - Público: Lectura ✅';
        
    ELSE
        RAISE NOTICE '⚠️ Tabla categorias_analistas no existe';
    END IF;
END $$;

COMMIT;

-- 5. VERIFICACIÓN FINAL
-- =====================

SELECT 
    '🏁 VERIFICACIÓN FINAL' as header,
    tablename as tabla,
    CASE 
        WHEN rowsecurity THEN '✅ RLS HABILITADO' 
        ELSE '❌ RLS DESHABILITADO' 
    END as rls_status,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'categorias_analistas') as total_policies
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'categorias_analistas';

-- Mostrar las políticas creadas
SELECT 
    '📋 POLÍTICAS CREADAS' as header,
    policyname as politica,
    cmd as tipo
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'categorias_analistas'
ORDER BY policyname;

-- ===========================================================================
-- ✅ ESTE SCRIPT COMPLETA LA CONFIGURACIÓN:
-- ===========================================================================
-- 
-- ✅ Habilita RLS en la tabla categorias_analistas
-- ✅ Otorga acceso COMPLETO al admin
-- ✅ Permite lectura pública para que la web funcione
-- ✅ Resuelve la última advertencia de seguridad
-- 
-- DESPUÉS DE EJECUTAR ESTE SCRIPT: 
-- Todas las advertencias del Security Advisor deberían desaparecer
-- =========================================================================== 