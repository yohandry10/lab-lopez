import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const supabase = createServerSupabaseClient()

    // Iniciar sesión con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Obtener información adicional del usuario desde la tabla de usuarios
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Error en la autenticación:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

export async function DELETE() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  return NextResponse.json({ success: true })
}

