import { NextRequest, NextResponse } from "next/server"

const ORION_API_KEY =
  "etFJbEqH317VuCwP4AuLwOIdRT9ytRaCUUdbR3cEhcqViKBcmeUSm9rJ9WL5"
const BASE_URL = "https://laboratoriolopez.orion-labs.com/api/v1"

/* -------------------------------------------------------------------------- */
/*  HELPERS                                                                   */
/* -------------------------------------------------------------------------- */

async function fetchFromOrion(path: string) {
  const url = `${BASE_URL}${path}`
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${ORION_API_KEY}`,
  }

  const res = await fetch(url, { headers, cache: "no-store" })
  const txt = await res.text()

  if (!res.ok) {
    // Lanzamos el mensaje que viene del API para depurar
    let parsed: any = {}
    try {
      parsed = JSON.parse(txt)
    } catch {}
    throw new Error(
      `HTTP ${res.status} – ${parsed.message ?? parsed.error ?? txt}`
    )
  }

  return JSON.parse(txt)
}

/* -------------------------------------------------------------------------- */
/*  MAIN HANDLER                                                              */
/* -------------------------------------------------------------------------- */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // orden | identificacion | medico
    const value = searchParams.get("value")?.trim()

    if (!value)
      return NextResponse.json(
        { success: false, message: "Valor de búsqueda requerido" },
        { status: 400 }
      )

    const include = "paciente,categoria,medico,examenes"
    let data: any[] = []

    /* -------------------------- BÚSQUEDA POR ORDEN ------------------------- */
    if (type === "orden") {
      // 1) número_orden
      let endpoint = `/ordenes?filtrar[numero_orden]=${value}&incluir=${include}&pagina=1`
      let res = await fetchFromOrion(endpoint)
      if (Array.isArray(res.data) && res.data.length) data = res.data

      // 2) número_orden_externa
      if (!data.length) {
        endpoint = `/ordenes?filtrar[numero_orden_externa]=${value}&incluir=${include}&pagina=1`
        res = await fetchFromOrion(endpoint)
        if (Array.isArray(res.data) && res.data.length) data = res.data
      }

      // 3) búsqueda directa por ID
      if (!data.length && /^\d+$/.test(value)) {
        try {
          const resById = await fetchFromOrion(
            `/ordenes/${value}?incluir=${include}`
          )
          if (resById?.data) data = [resById.data]
        } catch {}
      }

      // 4) código de barras
      if (!data.length) {
        endpoint = `/ordenes?filtrar[codigo_barras]=${value}&incluir=${include}&pagina=1`
        res = await fetchFromOrion(endpoint)
        if (Array.isArray(res.data) && res.data.length) data = res.data
      }
    }

    /* ---------------------- BÚSQUEDA POR IDENTIFICACIÓN -------------------- */
    else if (type === "identificacion") {
      const endpoint = `/ordenes?filtrar[paciente.numero_identificacion]=${value}&incluir=${include}&pagina=1`
      const res = await fetchFromOrion(endpoint)
      if (Array.isArray(res.data)) data = res.data
    }

    /* ----------------------------- BÚSQUEDA MÉDICO ------------------------- */
    else if (type === "medico") {
      const endpoint = `/ordenes?filtrar[medico.numero_identificacion]=${value}&incluir=${include}&pagina=1`
      const res = await fetchFromOrion(endpoint)
      if (Array.isArray(res.data)) data = res.data
    }

    /* --------------------------- RESPUESTA FINAL --------------------------- */
    if (!data.length) {
      const msg =
        type === "orden"
          ? `No se encontró la orden ${value}.`
          : type === "identificacion"
          ? `No se encontraron órdenes para la identificación ${value}.`
          : `No se encontraron órdenes para el médico ${value}.`
      return NextResponse.json({ success: false, message: msg })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Error interno" },
      { status: 500 }
    )
  }
}