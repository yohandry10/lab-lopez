import { NextResponse } from "next/server"

export async function GET() {
  try {
    const requiredEnvVars = [
      "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
      "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
      "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
    ]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          message: `Faltan las siguientes variables de entorno: ${missingVars.join(", ")}`,
          success: false,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: "Variables de entorno verificadas correctamente", success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      {
        message: "Error al verificar variables de entorno",
        error: errorMessage,
        success: false,
      },
      { status: 500 }
    )
  }
}

