import { NextResponse } from "next/server"

export async function GET() {
  // Usar un valor por defecto si la variable de entorno no está definida
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return NextResponse.redirect(new URL("/vacunacion", appUrl))
}

