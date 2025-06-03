/* app/api/download-pdf/route.ts
   Proxy muy fino → descarga directa de Orion.
   · No guarda nada en disco, hace streaming.
   · Requiere que añadas  ORION_API_KEY  en tus variables de entorno.
*/

import { NextRequest, NextResponse } from "next/server"

const ORION_API_KEY = process.env.ORION_API_KEY || "etFJbEqH317VuCwP4AuLwOIdRT9ytRaCUUdbR3cEhcqViKBcmeUSm9rJ9WL5"
const ORION_BASE_URL  = "https://laboratoriolopez.orion-labs.com" // ¡sin "/" final!

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId")

  if (!orderId) {
    return NextResponse.json({ error: "Falta el parámetro orderId" }, { status: 400 })
  }
  if (!ORION_API_KEY) {
    return NextResponse.json({ error: "Falta ORION_API_KEY en variables de entorno" }, { status: 500 })
  }

  // URL exacta que usa el portal oficial
  const orionURL = `${ORION_BASE_URL}/api/v1/ordenes/${orderId}/resultados/pdf`

  try {
    const orionRes = await fetch(orionURL, {
      headers: {
        Accept:        "application/pdf",
        Authorization: `Bearer ${ORION_API_KEY}`,
      },
      cache: "no-store",      // evita cache de Next/Vercel
    })

    if (!orionRes.ok) {
      const text = await orionRes.text()   // Orion devuelve HTML con error
      return NextResponse.json(
        { error: `Orion devolvió ${orionRes.status}`, details: text.slice(0, 500) },
        { status: orionRes.status },
      )
    }

    // ——— PDF en streaming ————————————————————————————
    const filename = `Resultados_${orderId}.pdf`
    return new NextResponse(orionRes.body, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })

  } catch (err:any) {
    console.error("Proxy Orion-PDF error:", err)
    return NextResponse.json({ error: "No se pudo obtener el PDF de Orion" }, { status: 500 })
  }
}
