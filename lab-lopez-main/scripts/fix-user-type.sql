-- Eliminar todas las restricciones de user_type
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT constraint_name 
              FROM information_schema.constraint_column_usage 
              WHERE table_name = 'users' 
              AND column_name = 'user_type') 
    LOOP
        EXECUTE 'ALTER TABLE users DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Crear la nueva restricción
ALTER TABLE users ADD CONSTRAINT users_user_type_check 
CHECK (user_type IN ('patient', 'doctor', 'admin')); 