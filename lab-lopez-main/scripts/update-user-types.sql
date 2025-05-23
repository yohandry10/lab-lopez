-- Primero, eliminamos la restricción existente
ALTER TABLE users DROP CONSTRAINT IF EXISTS user_type_check;

-- Luego, añadimos la nueva restricción que incluye 'admin'
ALTER TABLE users ADD CONSTRAINT user_type_check 
  CHECK (user_type IN ('patient', 'doctor', 'admin')); 