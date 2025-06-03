import { createClient } from "@supabase/supabase-js"

// Tipos para la base de datos
export type Employee = {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  status: "active" | "inactive"
  join_date: string
  company_id: string
}

export type Patient = {
  id: string
  user_id: string
  patient_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  birth_date: string
  gender: string
}

export type ExamResult = {
  id: string
  patient_code: string
  order_number: string
  patient_name: string
  date: string
  status: "completed" | "pending"
  results: Array<{
    name: string
    value: string
    reference: string
    status: "normal" | "high" | "low"
  }>
}

export type Order = {
  id: string
  user_id: string
  patient_id: string
  doctor_id?: string
  company_id?: string
  order_number: string
  date: string
  status: string
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

// Crear cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseKey)

// Función para obtener el cliente de Supabase (para compatibilidad)
export function getSupabaseClient() {
  return supabase
}

