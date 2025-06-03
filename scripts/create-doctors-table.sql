-- Script para crear tabla de médicos si no existe
-- Ejecutar en el SQL Editor de Supabase

-- Crear tabla de médicos si no existe
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cmp_number VARCHAR(20) UNIQUE, -- Número de Colegio Médico del Perú
    specialty VARCHAR(100) NOT NULL,
    sub_specialty VARCHAR(100),
    medical_license VARCHAR(50),
    years_experience INTEGER DEFAULT 0,
    education TEXT,
    certifications TEXT[],
    hospital_affiliations TEXT[],
    consultation_fee DECIMAL(10,2),
    available_hours JSONB, -- Horarios disponibles
    phone VARCHAR(20),
    email VARCHAR(255),
    office_address TEXT,
    bio TEXT,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_cmp_number ON doctors(cmp_number);
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_is_verified ON doctors(is_verified);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_doctors_updated_at ON doctors;
CREATE TRIGGER trigger_update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_doctors_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Política para que los médicos puedan ver y editar su propio perfil
CREATE POLICY "Doctors can view and edit their own profile" ON doctors
    FOR ALL USING (auth.uid() = user_id);

-- Política para que todos puedan ver médicos activos y verificados (para búsquedas públicas)
CREATE POLICY "Anyone can view active verified doctors" ON doctors
    FOR SELECT USING (is_active = true AND is_verified = true);

-- Política para que los administradores puedan hacer todo
CREATE POLICY "Admins can do everything with doctors" ON doctors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Verificar que la tabla se creó correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'doctors' 
ORDER BY ordinal_position; 