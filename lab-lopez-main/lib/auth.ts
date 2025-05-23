import { getSupabaseClient } from "./supabase-client"
import type { User } from "./supabase-client"

type AuthResponse = {
  success: boolean
  error?: string
  user?: User
}

type SignUpData = {
  email: string
  password: string
  username: string
  first_name: string
  last_name: string
  user_type: "patient" | "doctor" | "company"
  accepted_terms: boolean
  accepted_marketing: boolean
  company_name?: string
  company_ruc?: string
  company_position?: string
  is_company_admin?: boolean
}

// Función para registrar un nuevo usuario
export async function signUp(userData: SignUpData): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient()

    console.log("Iniciando registro de usuario:", userData.email)

    // Registrar usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError || !authData.user) {
      console.error("Error en registro de autenticación:", authError)
      return { success: false, error: authError?.message || "No se pudo crear el usuario" }
    }

    console.log("Usuario creado en Auth:", authData.user.id)

    // Crear registro en la tabla users
    const { data: insertedUser, error: userError } = await supabase
      .from("users")
      .upsert([{
        id: authData.user.id,
        email: userData.email,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        user_type: userData.user_type,
        accepted_terms: userData.accepted_terms,
        accepted_marketing: userData.accepted_marketing,
        company_name: userData.company_name,
        company_ruc: userData.company_ruc,
        company_position: userData.company_position,
        is_company_admin: userData.is_company_admin,
      }])
      .select()
      .single()

    if (userError || !insertedUser) {
      console.error("Error al crear perfil de usuario:", userError)
      return { success: false, error: userError?.message || "Error al crear perfil de usuario" }
    }

    console.log("Perfil de usuario creado:", insertedUser)

    return { 
      success: true, 
      user: insertedUser as User
    }
  } catch (error) {
    console.error("Error inesperado en registro:", error)
    return { success: false, error: "Error inesperado al registrar usuario" }
  }
}

// Función para iniciar sesión
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { success: false, error: error?.message || "No se encontró el usuario" }
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError || !userData) {
      return { success: false, error: userError?.message || "Error al obtener datos del usuario" }
    }

    return { success: true, user: userData as User }
  } catch (error) {
    console.error("Error inesperado al iniciar sesión:", error)
    return { success: false, error: "Error inesperado al iniciar sesión" }
  }
}

// Función para cerrar sesión
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error inesperado al cerrar sesión:", error)
    return { success: false, error: "Error inesperado al cerrar sesión" }
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = getSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      return null
    }

    return userData as User
  } catch (error) {
    console.error("Error inesperado al obtener usuario actual:", error)
    return null
  }
}

// Función para actualizar el perfil del usuario
export async function updateUser(userId: string, updates: Partial<User>): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single()

    if (error || !data) {
      return { success: false, error: error?.message || "Error al actualizar usuario" }
    }

    return { success: true, user: data as User }
  } catch (error) {
    console.error("Error inesperado al actualizar usuario:", error)
    return { success: false, error: "Error inesperado al actualizar usuario" }
  }
} 