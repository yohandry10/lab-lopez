import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Intentar una consulta simple para verificar la conexión
    const { data, error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al conectar con Supabase",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa con Supabase",
      data,
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Error al intentar conectar con Supabase",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}

