import { NextRequest, NextResponse } from "next/server"

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                    */
/* -------------------------------------------------------------------------- */
const ORION_API_KEY =
  "etFJbEqH317VuCwP4AuLwOIdRT9ytRaCUUdbR3cEhcqViKBcmeUSm9rJ9WL5"
const BASE_URL = "https://laboratoriolopez.orion-labs.com/api/v1"

/* -------------------------------------------------------------------------- */
/*  HTTP WRAPPER                                                              */
/* -------------------------------------------------------------------------- */
async function orion(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${ORION_API_KEY}`,
    },
    cache: "no-store",
  })

  const text = await res.text()
  if (!res.ok) {
    let parsed: any = {}
    try { parsed = JSON.parse(text) } catch {}
    throw new Error(
      `HTTP ${res.status} – ${parsed.message ?? parsed.error ?? text}`
    )
  }
  return JSON.parse(text)
}

/* -------------------------------------------------------------------------- */
/*  TRANSFORMACIÓN                                                            */
/* -------------------------------------------------------------------------- */
function buildTable(order: any) {
  const bySection: Record<string, any[]> = {}
  const detalles = Array.isArray(order.detallesOrdenes) ? order.detallesOrdenes : []

  detalles.forEach((det: any) => {
    const section = det.seccion || "GENERAL"
    bySection[section] = bySection[section] || []

    /* subtítulo = nombre del examen */
    bySection[section].push({
      isSubtitulo: true,
      examen:
        det.nombre_examen ?? det.nombre ?? det.codigo ?? "EXAMEN",
      resultado: "",
      unidad: "",
      valor_referencia: "",
    })

    /* recorrer TODOS los reportes asociados */
    const reportes = Array.isArray(det.reportes) ? det.reportes : []
    reportes.forEach((rep: any) => {
      const items = Array.isArray(rep.detallesReportes)
        ? rep.detallesReportes
        : []

      items.forEach((row: any) =>
        bySection[section].push({
          isResultado: true,
          examen:
            row.nombre_parametro ?? row.nombre ?? row.descripcion ?? "",
          resultado:
            row.resultado ??
            row.resultado_texto ??
            String(row.resultado_numerico ?? ""),
          unidad: row.unidad_medida ?? row.unidad ?? "",
          valor_referencia:
            row.valor_referencia_texto ??
            (row.valor_minimo != null && row.valor_maximo != null
              ? `${row.valor_minimo} – ${row.valor_maximo}`
              : ""),
        })
      )
    })

    /* método / técnica */
    if (det.tecnica)
      bySection[section].push({
        isMetodo: true,
        examen: `Método: ${det.tecnica}`,
        resultado: "",
        unidad: "",
        valor_referencia: "",
      })
  })

  return bySection
}

/* -------------------------------------------------------------------------- */
/*  HANDLER                                                                   */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  const orderId = new URL(req.url).searchParams.get("orderId")
  if (!orderId)
    return NextResponse.json(
      { success: false, message: "Se requiere orderId" },
      { status: 400 }
    )

  try {
    const include =
      "paciente,medico," +
      "detallesOrdenes,detallesOrdenes.reportes," +
      "detallesOrdenes.reportes.detallesReportes"

    const res     = await orion(`/ordenes/${orderId}?incluir=${include}`)
    const order   = res?.data
    const table   = order ? buildTable(order) : {}

    if (!Object.keys(table).length)
      return NextResponse.json({
        success: true,
        data: {},
        message: "No se encontraron resultados de exámenes para esta orden.",
      })

    return NextResponse.json({ success: true, data: table })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Error interno" },
      { status: 500 }
    )
  }
}
