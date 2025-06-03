import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Verificar variables de entorno
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "No configurado",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurado" : "No configurado",
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? "Configurado" : "No configurado",
    }

    // Probar conexión a Supabase
    const supabase = createServerSupabaseClient()

    // Verificar si las tablas existen
    const { data: tables, error: tablesError } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")

    if (tablesError) {
      return NextResponse.json(
        {
          success: false,
          error: `Error al consultar tablas: ${tablesError.message}`,
          envVars,
        },
        { status: 500 },
      )
    }

    // Probar consulta a la tabla users
    const { data: users, error: usersError } = await supabase.from("users").select("count").limit(1)

    // Probar consulta a la tabla services
    const { data: services, error: servicesError } = await supabase.from("services").select("count").limit(1)

    return NextResponse.json({
      success: true,
      envVars,
      tables,
      users: {
        data: users,
        error: usersError ? usersError.message : null,
      },
      services: {
        data: services,
        error: servicesError ? servicesError.message : null,
      },
    })
  } catch (error: any) {
    console.error("Error en la API de depuración:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error desconocido",
      },
      { status: 500 },
    )
  }
}

