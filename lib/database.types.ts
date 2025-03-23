export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          first_name: string
          last_name: string
          user_type: string
          created_at: string
          updated_at: string
          patient_code: string | null
          specialty: string | null
          company_name: string | null
          company_ruc: string | null
          company_position: string | null
          is_company_admin: boolean | null
          accepted_terms: boolean | null
          accepted_marketing: boolean | null
        }
        Insert: {
          id: string
          email: string
          username: string
          first_name: string
          last_name: string
          user_type: string
          created_at?: string
          updated_at?: string
          patient_code?: string | null
          specialty?: string | null
          company_name?: string | null
          company_ruc?: string | null
          company_position?: string | null
          is_company_admin?: boolean | null
          accepted_terms?: boolean | null
          accepted_marketing?: boolean | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          first_name?: string
          last_name?: string
          user_type?: string
          created_at?: string
          updated_at?: string
          patient_code?: string | null
          specialty?: string | null
          company_name?: string | null
          company_ruc?: string | null
          company_position?: string | null
          is_company_admin?: boolean | null
          accepted_terms?: boolean | null
          accepted_marketing?: boolean | null
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string
          document_type: string | null
          document_number: string | null
          birth_date: string | null
          gender: string | null
          address: string | null
          phone: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          blood_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_type?: string | null
          document_number?: string | null
          birth_date?: string | null
          gender?: string | null
          address?: string | null
          phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          blood_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: string | null
          document_number?: string | null
          birth_date?: string | null
          gender?: string | null
          address?: string | null
          phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          blood_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          company_id: string
          name: string
          position: string | null
          department: string | null
          email: string | null
          phone: string | null
          status: string
          join_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          position?: string | null
          department?: string | null
          email?: string | null
          phone?: string | null
          status?: string
          join_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          position?: string | null
          department?: string | null
          email?: string | null
          phone?: string | null
          status?: string
          join_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

