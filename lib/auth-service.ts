/* -------------------------------------------------------------------------- *
 *  AUTH-SERVICE – Next.js + Supabase v2                                      *
 * -------------------------------------------------------------------------- */

import { getSupabaseClient } from "./supabase-client"
import type { User } from "./supabase-client"

/* ---------- Tipos --------------------------------------------------------- */
export type AuthResponse = {
  success: boolean
  error?: string
  user?: User
}

export type SignUpData = {
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

/* -------------------------------------------------------------------------- *
 *  REGISTRO                                                                  *
 * -------------------------------------------------------------------------- */
export async function signUp(userData: SignUpData): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient()

    if (
      userData.user_type === "company" &&
      (!userData.company_name || !userData.company_ruc)
    ) {
      return {
        success: false,
        error: "Para cuentas de empresa se requiere nombre y RUC."
      }
    }

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    })

    if (authErr && authErr.message.includes("already registered")) {
      return {
        success: false,
        error: "El correo ya existe. Inicia sesión o recupera tu contraseña."
      }
    }
    if (authErr || !authData.user) {
      return { success: false, error: authErr?.message ?? "Fallo en Auth" }
    }

    const now = new Date().toISOString()
    const record: Record<string, unknown> = {
      id: authData.user.id,
      email: userData.email,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      user_type: userData.user_type,
      accepted_terms: userData.accepted_terms,
      accepted_marketing: userData.accepted_marketing,
      created_at: now,
      updated_at: now
    }

    if (userData.user_type === "company") {
      Object.assign(record, {
        company_name: userData.company_name,
        company_ruc: userData.company_ruc,
        company_position: userData.company_position,
        is_company_admin: userData.is_company_admin ?? false
      })
    }

    Object.keys(record).forEach(k => record[k] === undefined && delete record[k])

    const { error: insErr } = await supabase.from("users").insert(record)

    if (insErr) {
      const { error: upsErr } = await supabase
        .from("users")
        .upsert(record, { onConflict: "id" })
      if (upsErr) {
        return { success: false, error: upsErr.message }
      }
    }

    const { data: profile, error: selErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (selErr || !profile) {
      return {
        success: false,
        error: selErr?.message ?? "Usuario creado, pero no se pudo leer perfil"
      }
    }

    return { success: true, user: profile as User }
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }
}

/* -------------------------------------------------------------------------- *
 *  INICIO DE SESIÓN                                                          *
 * -------------------------------------------------------------------------- */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient()

    const { data: auth, error: authErr } =
      await supabase.auth.signInWithPassword({ email, password })

    if (authErr || !auth.user) {
      return { success: false, error: authErr?.message ?? "Credenciales inválidas" }
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", auth.user.id)
      .single()

    if (error || !profile) {
      return { success: false, error: error?.message ?? "Perfil no encontrado" }
    }

    return { success: true, user: profile as User }
  } catch {
    return { success: false, error: "Fallo inesperado en login" }
  }
}

/* -------------------------------------------------------------------------- *
 *  CIERRE DE SESIÓN                                                          *
 * -------------------------------------------------------------------------- */
export async function signOut(): Promise<AuthResponse> {
  const { error } = await getSupabaseClient().auth.signOut()
  return error ? { success: false, error: error.message } : { success: true }
}

/* -------------------------------------------------------------------------- *
 *  PERFIL – obtener y actualizar                                             *
 * -------------------------------------------------------------------------- */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return data as User | null
}

export async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<AuthResponse> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single()

  return error || !data
    ? { success: false, error: error?.message ?? "No se pudo actualizar" }
    : { success: true, user: data as User }
}
