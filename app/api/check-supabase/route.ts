import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    // Verificar conexión a Supabase
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al conectar con Supabase",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Conexión a Supabase exitosa",
      data,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error al verificar conexión con Supabase",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

