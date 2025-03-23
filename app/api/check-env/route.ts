import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return NextResponse.json({
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      message: "Verificación de variables de entorno completada",
      success: true,
    })
  } catch (error) {
    console.error("Error al verificar variables de entorno:", error)
    return NextResponse.json(
      {
        message: "Error al verificar variables de entorno",
        error: error.message,
        success: false,
      },
      { status: 500 },
    )
  }
}

