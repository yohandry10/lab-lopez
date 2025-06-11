-- SCRIPT PARA CORREGIR ACCESO PÚBLICO A PERFILES
-- El problema: Los usuarios no logueados no pueden ver perfiles populares
-- Solución: Agregar política de lectura pública para la tabla profiles

-- Verificar tabla profiles
SELECT 
    '🔍 VERIFICANDO TABLA PROFILES' as info,
    tablename,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS HABILITADO' 
        ELSE '🔓 RLS DESHABILITADO' 
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Ver políticas actuales
SELECT 
    '📋 POLÍTICAS ACTUALES' as info,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- LIMPIAR Y RECREAR POLÍTICAS CORRECTAS
BEGIN;

-- 1. Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view own profile_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;

-- 2. Crear política de LECTURA PÚBLICA (esto es lo que faltaba)
CREATE POLICY "public_read_profiles" ON public.profiles
    FOR SELECT USING (true);

-- 3. Crear política de admin (acceso total)
CREATE POLICY "admin_full_access_profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- 4. Política para usuarios autenticados (pueden crear/editar sus propios perfiles si tienen campo user_id)
-- Nota: Solo crear si la tabla tiene campo user_id
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_id'
    ) THEN
        CREATE POLICY "users_manage_own_profiles" ON public.profiles
            FOR ALL USING (auth.uid() = user_id);
        RAISE NOTICE '✅ Política de gestión propia creada (campo user_id encontrado)';
    ELSE
        RAISE NOTICE '⚠️ Campo user_id no encontrado - solo lectura pública y admin';
    END IF;
END $$;

COMMIT;

-- Verificar políticas finales
SELECT 
    '✅ POLÍTICAS FINALES' as info,
    policyname,
    cmd,
    CASE 
        WHEN qual = 'true' THEN '🌍 ACCESO PÚBLICO'
        WHEN qual LIKE '%admin%' THEN '👑 SOLO ADMIN'
        WHEN qual LIKE '%auth.uid()%' THEN '👤 USUARIO PROPIO'
        ELSE '❓ OTRA CONDICIÓN'
    END as access_type
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname; 