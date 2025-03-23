import { getSupabaseClient } from "./supabase-client"
import type { User } from "./supabase-client"

// Función para registrar un nuevo usuario
export async function signUp(email: string, password: string, userData: Partial<User>) {
  try {
    const supabase = getSupabaseClient()

    console.log("Iniciando registro de usuario:", email)

    // Registrar usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Error en registro de autenticación:", authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      console.error("No se pudo crear el usuario en Auth")
      return { success: false, error: "No se pudo crear el usuario" }
    }

    console.log("Usuario creado en Auth:", authData.user.id)

    // Crear un objeto con solo los campos necesarios para la tabla users
    const userRecord = {
      id: authData.user.id,
      email: email,
      username: userData.username || email.split("@")[0],
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      user_type: userData.user_type || "patient",
      patient_code: userData.patient_code,
      specialty: userData.specialty,
      company_name: userData.company_name,
      company_ruc: userData.company_ruc,
      company_position: userData.company_position,
      is_company_admin: userData.is_company_admin || false,
      accepted_terms: userData.accepted_terms || false,
      accepted_marketing: userData.accepted_marketing || false,
    }

    console.log("Intentando crear perfil de usuario:", userRecord)

    // Crear registro en la tabla users - usando upsert para evitar conflictos
    const { data: insertedUser, error: userError } = await supabase.from("users").upsert([userRecord]).select()

    if (userError) {
      console.error("Error al crear perfil de usuario:", userError)
      return { success: false, error: userError.message || "Error al crear perfil de usuario" }
    }

    if (!insertedUser || insertedUser.length === 0) {
      console.error("No se insertó ningún usuario en la base de datos")
      return { success: false, error: "No se pudo crear el perfil de usuario" }
    }

    console.log("Usuario creado exitosamente:", insertedUser[0])

    return {
      success: true,
      user: insertedUser[0],
      patientCode: userData.patient_code,
    }
  } catch (error: any) {
    console.error("Error inesperado en el registro:", error)
    return {
      success: false,
      error: error?.message || "Error inesperado en el proceso de registro",
    }
  }
}

// Función para iniciar sesión
export async function signIn(email: string, password: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error en inicio de sesión:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "No se pudo iniciar sesión" }
    }

    // Obtener datos del usuario desde la base de datos
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      console.error("Error al obtener datos del usuario:", userError)
      return { success: false, error: userError.message }
    }

    return {
      success: true,
      user: userData,
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error)
    return { success: false, error: "Error en el proceso de inicio de sesión" }
  }
}

// Función para cerrar sesión
export async function signOut() {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error al cerrar sesión:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return { success: false, error: "Error al cerrar sesión" }
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error al obtener sesión:", error)
      return null
    }

    if (!data.session || !data.session.user) {
      return null
    }

    // Obtener datos del usuario desde la base de datos
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.session.user.id)
      .single()

    if (userError) {
      console.error("Error al obtener datos del usuario:", userError)
      return null
    }

    return userData
  } catch (error) {
    console.error("Error al obtener usuario actual:", error)
    return null
  }
}

// Función para actualizar el perfil del usuario
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error al actualizar perfil:", error)
      return { success: false, error: error.message }
    }

    return { success: true, user: data }
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return { success: false, error: "Error al actualizar el perfil" }
  }
}

