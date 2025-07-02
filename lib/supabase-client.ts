import { createClient } from "@supabase/supabase-js"

// Tipos para las tablas de la base de datos
export type User = {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  user_type: "patient" | "doctor" | "admin" | "company"
  created_at?: string
  updated_at?: string
  patient_code?: string
  accepted_terms: boolean
  accepted_marketing: boolean
  company_name?: string
  company_ruc?: string
  company_position?: string
  is_company_admin?: boolean
  // 🆕 Referencias del usuario (relación many-to-many)
  user_references?: Array<{
    id: string
    reference_id: string
    reference?: {
      id: string
      name: string
      business_name?: string
      default_tariff_id?: string
      active: boolean
    }
  }>
}

export type Patient = {
  id: string
  user_id: string
  document_type?: string
  document_number?: string
  birth_date?: string
  gender?: string
  address?: string
  phone?: string
  emergency_contact?: string
  emergency_phone?: string
  blood_type?: string
  created_at?: string
  updated_at?: string
}

export type Employee = {
  id: string
  company_id: string
  name: string
  position?: string
  department?: string
  email?: string
  phone?: string
  status: "active" | "inactive"
  join_date?: string
  created_at?: string
  updated_at?: string
}

export type Exam = {
  id: string
  patient_id: string
  doctor_id?: string
  type: string
  date: string
  status: "pending" | "processing" | "completed"
  results?: any
  notes?: string
  created_at?: string
  updated_at?: string
}

export type Appointment = {
  id: string
  patient_id: string
  doctor_id?: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  type?: string
  location?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export type Service = {
  id: string
  name: string
  description?: string
  price: number
  category?: string
  duration?: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export type Order = {
  id: string
  user_id: string
  date: string
  total: number
  status: "pending" | "processing" | "completed"
  items?: any
  created_at?: string
  updated_at?: string
}

// Crear cliente de Supabase - usando variables de entorno o valores por defecto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://adxvkmwhklblrxjljmzx.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkeHZrbXdoa2xibHJ4amxqbXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMzMyMTUsImV4cCI6MjA0NjYwOTIxNX0.v7fhNBQQj8Jd2Mh_gH_tUQN2nD5_J1DJGLyJZz9F1zA"

console.log("🔗 Conectando a Supabase:", supabaseUrl)

// Crear cliente para el lado del cliente (singleton)
let clientInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// Crear cliente para el lado del servidor
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

