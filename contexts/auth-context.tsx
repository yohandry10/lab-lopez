"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { signIn, signOut, signUp, adminCreateUser, getCurrentUser, updateUser } from "@/lib/auth-service"
import type { User } from "@/lib/supabase-client"

type RegisterData = {
  email: string
  password: string
  username: string
  first_name: string
  last_name: string
  user_type: "patient" | "doctor" | "company"
  accepted_terms: boolean
  accepted_marketing: boolean
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
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  adminRegister: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      setIsLoading(true)
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData as User)
        }
      } catch (error) {
        console.error("Error al cargar la sesión:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password)
      if (result.success && result.user) {
        setUser(result.user as User)
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error en login:", error)
      return { success: false, error: "Error al iniciar sesión" }
    }
  }

  const logout = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        setUser(null)
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error en logout:", error)
      return { success: false, error: "Error al cerrar sesión" }
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const result = await signUp(userData)
      if (result.success && result.user) {
        setUser(result.user as User)
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error en registro:", error)
      return { success: false, error: "Error al registrar usuario" }
    }
  }

  const adminRegister = async (userData: RegisterData) => {
    try {
      const result = await adminCreateUser(userData)
      if (result.success) {
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error en registro por admin:", error)
      return { success: false, error: "Error al registrar usuario" }
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const result = await updateUser(user?.id || "", updates)
      if (result.success && result.user) {
        setUser(result.user as User)
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      return { success: false, error: "Error al actualizar perfil" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, adminRegister, updateProfile }}>
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
