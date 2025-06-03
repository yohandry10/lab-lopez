-- SCRIPT DE VERIFICACIÓN DESPUÉS DE HABILITAR RLS
-- Ejecutar este script después del secure-rls-setup.sql para verificar que todo funciona correctamente

-- ===========================================================================
-- VERIFICACIÓN DEL ESTADO DE RLS Y POLÍTICAS
-- ===========================================================================

-- 1. VERIFICAR QUE RLS ESTÁ HABILITADO EN TODAS LAS TABLAS
-- ========================================================

SELECT 
    '🔒 Estado RLS por tabla' as info,
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ HABILITADO' 
        ELSE '❌ DESHABILITADO' 
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'biblioteca_digital', 'configuracion_secciones', 
    'perfiles_bienestar', 'analyses', 'doctors', 
    'categorias_analistas', 'analistas', 'profiles', 'dbout_content'
)
ORDER BY tablename;

-- 2. VERIFICAR POLÍTICAS CREADAS
-- ===============================

SELECT 
    '📋 Políticas por tabla' as info,
    tablename,
    COUNT(*) as total_policies,
    string_agg(policyname, ', ' ORDER BY policyname) as policy_names
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
    'users', 'biblioteca_digital', 'configuracion_secciones', 
    'perfiles_bienestar', 'analyses', 'doctors', 
    'categorias_analistas', 'analistas', 'profiles', 'dbout_content'
)
GROUP BY tablename
ORDER BY tablename;

-- 3. VERIFICAR FUNCIÓN is_admin()
-- ===============================

SELECT 
    '🔍 Verificando función is_admin()' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p 
            JOIN pg_namespace n ON p.pronamespace = n.oid 
            WHERE n.nspname = 'public' AND p.proname = 'is_admin'
        ) 
        THEN '✅ FUNCIÓN EXISTE' 
        ELSE '❌ FUNCIÓN NO ENCONTRADA' 
    END as function_status;

-- 4. VERIFICAR USUARIOS ADMIN
-- ===========================

SELECT 
    '👤 Usuarios Admin encontrados' as info,
    COUNT(*) as admin_count,
    string_agg(email, ', ') as admin_emails
FROM public.users 
WHERE user_type = 'admin';

-- 5. VERIFICAR PERMISOS DE LA FUNCIÓN
-- ===================================

SELECT 
    '🔑 Permisos función is_admin()' as info,
    grantee,
    privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'is_admin'
AND routine_schema = 'public';

-- 6. RESUMEN DE ADVERTENCIAS RESUELTAS
-- ====================================

SELECT 
    '🛡️ Resumen de Seguridad' as info,
    (
        SELECT COUNT(*) 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND rowsecurity = true
        AND tablename IN (
            'users', 'biblioteca_digital', 'configuracion_secciones', 
            'perfiles_bienestar', 'analyses', 'doctors', 
            'categorias_analistas', 'analistas', 'profiles', 'dbout_content'
        )
    ) as tables_with_rls,
    (
        SELECT COUNT(*) 
        FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename IN (
            'users', 'biblioteca_digital', 'configuracion_secciones', 
            'perfiles_bienestar', 'analyses', 'doctors', 
            'categorias_analistas', 'analistas', 'profiles', 'dbout_content'
        )
    ) as total_policies_created;

-- ===========================================================================
-- TESTS DE FUNCIONALIDAD (OPCIONAL - SOLO SI HAY USUARIO ADMIN ACTIVO)
-- ===========================================================================

-- Si tienes un usuario admin logueado, puedes descomentar estas consultas para probar:

-- TEST 1: Verificar que admin puede ver todas las tablas
-- SELECT '🧪 Test Admin - Users' as test, COUNT(*) as total_users FROM public.users;
-- SELECT '🧪 Test Admin - Biblioteca' as test, COUNT(*) as total_items FROM public.biblioteca_digital;
-- SELECT '🧪 Test Admin - Analyses' as test, COUNT(*) as total_analyses FROM public.analyses;

-- TEST 2: Verificar función is_admin() (solo si hay usuario admin logueado)
-- SELECT '🧪 Test is_admin()' as test, is_admin() as result;

-- ===========================================================================
-- INTERPRETACIÓN DE RESULTADOS
-- ===========================================================================

SELECT 
    '📊 INTERPRETACIÓN DE RESULTADOS' as header,
    '
✅ Si ves "HABILITADO" en RLS Status: Perfecto, RLS está activo
✅ Si ves políticas creadas para cada tabla: Las reglas de seguridad están configuradas
✅ Si ves función is_admin() existe: Los permisos de admin están funcionando
✅ Si ves usuarios admin encontrados > 0: Hay administradores configurados

❌ Si algún elemento muestra error: Revisar el script secure-rls-setup.sql

🔒 RESULTADO ESPERADO:
- Todas las advertencias de Supabase deben desaparecer
- El admin mantiene acceso completo a todas las funcionalidades  
- Los usuarios normales solo ven lo que deben ver
- La aplicación funciona normalmente sin errores
    ' as explanation;

-- ===========================================================================
-- SIGUIENTE PASO: IR A SUPABASE DASHBOARD
-- ===========================================================================

SELECT 
    '🎯 PRÓXIMOS PASOS' as header,
    '
1. Ejecuta este script en el SQL Editor de Supabase
2. Ve al Security Advisor en tu Dashboard de Supabase  
3. Verifica que las advertencias han desaparecido
4. Prueba las funcionalidades de admin en tu aplicación
5. Confirma que todo funciona correctamente

Si algo no funciona, puedes revertir temporalmente con:
ALTER TABLE [tabla] DISABLE ROW LEVEL SECURITY;
    ' as instructions; 