-- Script para verificar la estructura actual de la tabla users
-- Ejecutar en el SQL Editor de Supabase

-- Ver todas las columnas de la tabla users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Ver las restricciones actuales
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'users'::regclass; 