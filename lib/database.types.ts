export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          date: string
          doctor_id: string | null
          id: string
          location: string | null
          notes: string | null
          patient_id: string | null
          status: string | null
          time: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          status?: string | null
          time: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          status?: string | null
          time?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnoses: {
        Row: {
          created_at: string | null
          diagnosis: string
          doctor_id: string | null
          exam_id: string | null
          id: string
          recommendations: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          diagnosis: string
          doctor_id?: string | null
          exam_id?: string | null
          id?: string
          recommendations?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          diagnosis?: string
          doctor_id?: string | null
          exam_id?: string | null
          id?: string
          recommendations?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnoses_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnoses_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_hours: Json | null
          bio: string | null
          certifications: string[] | null
          cmp_number: string | null
          consultation_fee: number | null
          created_at: string | null
          education: string | null
          email: string | null
          hospital_affiliations: string[] | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          medical_license: string | null
          office_address: string | null
          phone: string | null
          profile_image_url: string | null
          specialty: string
          sub_specialty: string | null
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
          years_experience: number | null
        }
        Insert: {
          available_hours?: Json | null
          bio?: string | null
          certifications?: string[] | null
          cmp_number?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          hospital_affiliations?: string[] | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          medical_license?: string | null
          office_address?: string | null
          phone?: string | null
          profile_image_url?: string | null
          specialty: string
          sub_specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          years_experience?: number | null
        }
        Update: {
          available_hours?: Json | null
          bio?: string | null
          certifications?: string[] | null
          cmp_number?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          hospital_affiliations?: string[] | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          medical_license?: string | null
          office_address?: string | null
          phone?: string | null
          profile_image_url?: string | null
          specialty?: string
          sub_specialty?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          company_id: string | null
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          join_date: string | null
          name: string
          phone: string | null
          position: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          name: string
          phone?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          name?: string
          phone?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string | null
          date: string
          doctor_id: string | null
          id: string
          notes: string | null
          patient_id: string | null
          results: Json | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          results?: Json | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          results?: Json | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      home_services: {
        Row: {
          address: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          service_id: string | null
          status: string | null
          time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "home_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "home_services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          date: string
          id: string
          items: Json | null
          status: string | null
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          items?: Json | null
          status?: string | null
          total: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          items?: Json | null
          status?: string | null
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string | null
          blood_type: string | null
          created_at: string | null
          document_number: string | null
          document_type: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          gender: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          blood_type?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          blood_type?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          accepted_marketing: boolean | null
          accepted_terms: boolean | null
          company_name: string | null
          company_position: string | null
          company_ruc: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_company_admin: boolean | null
          last_name: string
          patient_code: string | null
          updated_at: string | null
          user_type: string
          username: string
        }
        Insert: {
          accepted_marketing?: boolean | null
          accepted_terms?: boolean | null
          company_name?: string | null
          company_position?: string | null
          company_ruc?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          is_company_admin?: boolean | null
          last_name: string
          patient_code?: string | null
          updated_at?: string | null
          user_type?: string
          username: string
        }
        Update: {
          accepted_marketing?: boolean | null
          accepted_terms?: boolean | null
          company_name?: string | null
          company_position?: string | null
          company_ruc?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_company_admin?: boolean | null
          last_name?: string
          patient_code?: string | null
          updated_at?: string | null
          user_type?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
