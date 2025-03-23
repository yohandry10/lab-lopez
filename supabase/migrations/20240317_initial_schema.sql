-- Función para crear la tabla de usuarios
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT UNIQUE,
    user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'doctor', 'company')),
    patient_code TEXT UNIQUE,
    company_name TEXT,
    company_ruc TEXT,
    is_company_admin BOOLEAN DEFAULT FALSE,
    specialty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de empleados
CREATE OR REPLACE FUNCTION create_employees_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
    join_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de citas
CREATE OR REPLACE FUNCTION create_appointments_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES users(id),
    employee_id UUID REFERENCES employees(id),
    patient_id UUID REFERENCES users(id),
    doctor_id UUID REFERENCES users(id),
    employee_name TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de servicios
CREATE OR REPLACE FUNCTION create_services_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de pacientes
CREATE OR REPLACE FUNCTION create_patients_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    emergency_contact TEXT,
    emergency_phone TEXT,
    blood_type TEXT,
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de exámenes
CREATE OR REPLACE FUNCTION create_exams_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id),
    doctor_id UUID REFERENCES users(id),
    type TEXT NOT NULL,
    date DATE NOT NULL,
    results JSONB,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de diagnósticos
CREATE OR REPLACE FUNCTION create_diagnoses_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id),
    doctor_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    treatment TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de órdenes
CREATE OR REPLACE FUNCTION create_orders_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para crear la tabla de servicios a domicilio
CREATE OR REPLACE FUNCTION create_home_services_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS home_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    service_id UUID NOT NULL REFERENCES services(id),
    address TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Función para insertar datos de ejemplo para servicios
CREATE OR REPLACE FUNCTION seed_services()
RETURNS void AS $$
BEGIN
  INSERT INTO services (name, description, price, category)
  VALUES
    ('Examen médico ocupacional', 'Evaluación médica completa para empleados', 200.00, 'Salud ocupacional'),
    ('Evaluación psicológica', 'Evaluación del estado psicológico del empleado', 150.00, 'Salud ocupacional'),
    ('Audiometría', 'Evaluación de la capacidad auditiva', 80.00, 'Salud ocupacional'),
    ('Espirometría', 'Evaluación de la función pulmonar', 90.00, 'Salud ocupacional'),
    ('Hemograma completo', 'Análisis completo de la sangre', 60.00, 'Laboratorio'),
    ('Perfil lipídico', 'Análisis de colesterol y triglicéridos', 70.00, 'Laboratorio'),
    ('Glucosa', 'Medición de niveles de glucosa en sangre', 30.00, 'Laboratorio'),
    ('Vacuna contra la influenza', 'Vacunación contra la influenza estacional', 50.00, 'Vacunación'),
    ('Vacuna contra el tétanos', 'Vacunación contra el tétanos', 60.00, 'Vacunación'),
    ('Servicio de enfermería a domicilio', 'Atención de enfermería en el hogar', 120.00, 'Domicilio'),
    ('Toma de muestras a domicilio', 'Recolección de muestras para análisis en el hogar', 80.00, 'Domicilio')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

