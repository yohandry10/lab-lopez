// Módulo para conexión a la API de Orion Lab
const ORION_API_KEY = process.env.ORION_API_KEY || 'etFJbEqH317VuCwP4AuLwOIdRT9ytRaCUUdbR3cEhcqViKBcmeUSm9rJ9WL5'
const BASE_URL = process.env.ORION_BASE_URL || 'https://laboratoriolopez.orion-labs.com/api/v1'

/**
 * Realiza una solicitud GET a la API de Orion Lab
 * @param path Ruta relativa al endpoint (e.g. "/ordenes?filtrar=..." )
 */
export async function fetchFromOrion(path: string) {
  const url = `${BASE_URL}${path}`
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ORION_API_KEY}`,
  }

  const res = await fetch(url, { headers, cache: 'no-store' })
  const text = await res.text()

  if (!res.ok) {
    let parsed: any = {}
    try { parsed = JSON.parse(text) } catch {}
    throw new Error(`HTTP ${res.status} – ${parsed.message ?? parsed.error ?? text}`)
  }

  return JSON.parse(text)
} 