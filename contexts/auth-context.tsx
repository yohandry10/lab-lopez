"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, signIn, signOut, signUp, updateUserProfile } from "@/lib/auth-service"

type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  user_type: "patient" | "doctor" | "company"
  patient_code?: string
  company_name?: string
  company_ruc?: string
  company_position?: string
  is_company_admin?: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  register: (userData: any) => Promise<any>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sesión al cargar
  useEffect(() => {
    async function loadSession() {
      setIsLoading(true)
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_type: userData.user_type as "patient" | "doctor" | "company",
            patient_code: userData.patient_code,
            company_name: userData.company_name,
            company_ruc: userData.company_ruc,
            company_position: userData.company_position,
            is_company_admin: userData.is_company_admin,
          })
        }
      } catch (error) {
        console.error("Error al cargar la sesión:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  // Función de inicio de sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn(email, password)

      if (result.success && result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          user_type: result.user.user_type as "patient" | "doctor" | "company",
          patient_code: result.user.patient_code,
          company_name: result.user.company_name,
          company_ruc: result.user.company_ruc,
          company_position: result.user.company_position,
          is_company_admin: result.user.is_company_admin,
        })
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      return { success: false, error: "Error al iniciar sesión" }
    } finally {
      setIsLoading(false)
    }
  }

  // Modificar la función register para manejar mejor los errores

  // Función de registro
  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      console.log("Iniciando registro con datos:", {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userType: userData.userType,
      })

      // Generar código de paciente si es necesario
      let patientCode = undefined
      if (userData.userType === "patient") {
        patientCode = `P${Math.floor(100000 + Math.random() * 900000)}`
      }

      const result = await signUp(userData.email, userData.password, {
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
        user_type: userData.userType,
        patient_code: patientCode,
        company_name: userData.companyName,
        company_ruc: userData.companyRuc,
        company_position: userData.companyPosition,
        is_company_admin: userData.userType === "company",
        accepted_terms: userData.acceptedTerms,
        accepted_marketing: userData.acceptedMarketing,
      })

      console.log("Resultado del registro:", result)

      if (result.success && result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          user_type: result.user.user_type as "patient" | "doctor" | "company",
          patient_code: result.user.patient_code,
          company_name: result.user.company_name,
          company_ruc: result.user.company_ruc,
          company_position: result.user.company_position,
          is_company_admin: result.user.is_company_admin,
        })

        return {
          success: true,
          user: result.user,
          patientCode: result.patientCode,
        }
      }

      console.error("Error en el registro:", result.error)
      return { success: false, error: result.error || "Error desconocido en el registro" }
    } catch (error: any) {
      console.error("Error inesperado al registrar usuario:", error)
      return {
        success: false,
        error: error?.message || "Error inesperado al registrar usuario",
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Función de actualización de perfil
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { success: false, error: "No hay usuario autenticado" }
    }

    setIsLoading(true)
    try {
      const result = await updateUserProfile(user.id, {
        first_name: updates.first_name,
        last_name: updates.last_name,
        company_name: updates.company_name,
        company_ruc: updates.company_ruc,
        company_position: updates.company_position,
      })

      if (result.success && result.user) {
        setUser({
          ...user,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          company_name: result.user.company_name,
          company_ruc: result.user.company_ruc,
          company_position: result.user.company_position,
        })
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      return { success: false, error: "Error al actualizar perfil" }
    } finally {
      setIsLoading(false)
    }
  }

  // Función de cierre de sesión
  const logout = async () => {
    setIsLoading(true)
    try {
      const result = await signOut()

      if (result.success) {
        setUser(null)
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      return { success: false, error: "Error al cerrar sesión" }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

