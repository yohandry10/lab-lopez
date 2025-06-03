-- Script para agregar columnas de empresa a la tabla users
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columnas para empresas si no existen
DO $$ 
BEGIN
    -- Agregar company_name si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'company_name') THEN
        ALTER TABLE users ADD COLUMN company_name TEXT;
        RAISE NOTICE 'Columna company_name agregada';
    ELSE
        RAISE NOTICE 'Columna company_name ya existe';
    END IF;

    -- Agregar company_ruc si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'company_ruc') THEN
        ALTER TABLE users ADD COLUMN company_ruc TEXT;
        RAISE NOTICE 'Columna company_ruc agregada';
    ELSE
        RAISE NOTICE 'Columna company_ruc ya existe';
    END IF;

    -- Agregar company_position si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'company_position') THEN
        ALTER TABLE users ADD COLUMN company_position TEXT;
        RAISE NOTICE 'Columna company_position agregada';
    ELSE
        RAISE NOTICE 'Columna company_position ya existe';
    END IF;

    -- Agregar is_company_admin si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'is_company_admin') THEN
        ALTER TABLE users ADD COLUMN is_company_admin BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna is_company_admin agregada';
    ELSE
        RAISE NOTICE 'Columna is_company_admin ya existe';
    END IF;

    -- Agregar accepted_terms si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'accepted_terms') THEN
        ALTER TABLE users ADD COLUMN accepted_terms BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna accepted_terms agregada';
    ELSE
        RAISE NOTICE 'Columna accepted_terms ya existe';
    END IF;

    -- Agregar accepted_marketing si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'accepted_marketing') THEN
        ALTER TABLE users ADD COLUMN accepted_marketing BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna accepted_marketing agregada';
    ELSE
        RAISE NOTICE 'Columna accepted_marketing ya existe';
    END IF;

    -- Agregar patient_code si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'patient_code') THEN
        ALTER TABLE users ADD COLUMN patient_code TEXT;
        RAISE NOTICE 'Columna patient_code agregada';
    ELSE
        RAISE NOTICE 'Columna patient_code ya existe';
    END IF;
END $$;

-- Actualizar la restricción de user_type para incluir 'company'
DO $$ 
BEGIN
    -- Eliminar restricción existente si existe
    IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
               WHERE table_name = 'users' AND column_name = 'user_type') THEN
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check;
        ALTER TABLE users DROP CONSTRAINT IF EXISTS user_type_check;
        RAISE NOTICE 'Restricciones de user_type eliminadas';
    END IF;

    -- Agregar nueva restricción que incluye 'company'
    ALTER TABLE users ADD CONSTRAINT users_user_type_check 
    CHECK (user_type IN ('patient', 'doctor', 'admin', 'company'));
    RAISE NOTICE 'Nueva restricción de user_type agregada con company';
END $$;

-- Verificar la estructura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position; 