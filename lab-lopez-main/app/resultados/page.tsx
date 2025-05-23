/* app/resultados/page.tsx
   Pantalla de consulta de resultados               (100 % funcional)
   --------------------------------------------------------------
   ▸ Busca órdenes llamando a  /api/test-orion
   ▸ Ya NO abre un modal (aún no existe un GET detalle en Orion)
   ▸ El botón «Descargar PDF» dispara /api/download-pdf?orderId={id}
*/

"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

interface Examen {
  codigo: string
  nombre: string
}

interface OrdenResponse {
  id:            number
  numero_orden:  string
  fecha_orden:   string
  estado:        string
  paciente?: {
    tipo_identificacion?:   string
    numero_identificacion?: string
    nombres?:              string
    apellidos?:            string
    nombre_completo?:      string
  }
  medico?: {
    nombres?:         string
    apellidos?:       string
    nombre_completo?: string
  }
  examenes?: Examen[]
}

export default function ResultadosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const [dni, setDni] = useState("")
  const [numeroOrden, setNumeroOrden] = useState("")
  const [results, setResults] = useState<OrdenResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  // Manejar redireccionamientos según el tipo de usuario
  useEffect(() => {
    if (type === "doctor" || type === "company") {
      if (!user) {
        // Si no está logueado y quiere acceder a resultados de médico o empresa, redirigir a login
        router.push("/login");
        return;
      } else if ((user.user_type === "doctor" && type === "doctor") || 
                (user.user_type === "company" && type === "company")) {
        // Si está logueado como médico/empresa y accede a su tipo, redirigir al portal externo
        window.open("https://laboratoriolopez.orion-labs.com/portal/login", "_blank");
        // Redirigir a la página de inicio
        router.push("/");
        return;
      }
    }
  }, [user, type, router]);

  /* ───────────────────────────────────────── SEARCH */
  async function handleSearch() {
    if (!dni && !numeroOrden) {
      setError("Por favor ingrese DNI o número de orden para realizar la búsqueda")
      return
    }

    setLoading(true)
    setError("")
    setResults([])
    setHasSearched(true)

    try {
      let foundResults = false
      
      // Si tenemos ambos valores (DNI y número de orden), filtramos por ambos
      if (dni.trim() && numeroOrden.trim()) {
        const ordenUrl = `/api/test-orion?type=orden&value=${encodeURIComponent(numeroOrden.trim())}`
        const ordenRes = await fetch(ordenUrl)
        const ordenJson = await ordenRes.json()
        
        if (ordenJson.success && Array.isArray(ordenJson.data) && ordenJson.data.length) {
          // Filtrar solo los resultados que coincidan con ambos criterios
          const filteredResults = ordenJson.data.filter((orden: OrdenResponse) => 
            orden.paciente?.numero_identificacion === dni.trim()
          );
          
          if (filteredResults.length > 0) {
            setResults(filteredResults)
            foundResults = true
          }
        }
      }
      // Si solo tenemos número de orden, buscamos solo por orden
      else if (numeroOrden.trim()) {
        const ordenUrl = `/api/test-orion?type=orden&value=${encodeURIComponent(numeroOrden.trim())}`
        const ordenRes = await fetch(ordenUrl)
        const ordenJson = await ordenRes.json()
        
        if (ordenJson.success && Array.isArray(ordenJson.data) && ordenJson.data.length) {
          setResults(ordenJson.data)
          foundResults = true
        }
      }
      // Si solo tenemos DNI, buscamos solo por DNI
      else if (dni.trim()) {
        const dniUrl = `/api/test-orion?type=identificacion&value=${encodeURIComponent(dni.trim())}`
        const dniRes = await fetch(dniUrl)
        const dniJson = await dniRes.json()
        
        if (dniJson.success && Array.isArray(dniJson.data) && dniJson.data.length) {
          setResults(dniJson.data)
          foundResults = true
        }
      }
      
      // Si no encontramos resultados con ninguna búsqueda
      if (!foundResults) {
        setError("No se encontraron resultados para los criterios ingresados")
      }
    } catch (e:any) {
      setError(e?.message || "Error al consultar la API")
    } finally {
      setLoading(false)
    }
  }

  /* ───────────────────────────────────────── JSX */
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Consulta de Resultados</h1>

      {/* FORMULARIO -------------------------------------------------- */}
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="mb-4">
            <Label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">DNI (o Cédula)</Label>
            <Input
              id="dni"
              value={dni}
              onChange={e => setDni(e.target.value)}
              placeholder="Ingrese DNI o Cédula"
              className="w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="numeroOrden" className="block text-sm font-medium text-gray-700 mb-1">Número de Orden</Label>
            <Input
              id="numeroOrden"
              value={numeroOrden}
              onChange={e => setNumeroOrden(e.target.value)}
              placeholder="Ingrese número de orden"
              className="w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <Button 
          disabled={loading} 
          onClick={handleSearch} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {loading ? "Buscando…" : "Buscar"}
        </Button>

        {/* mensajes */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* TABLA ------------------------------------------------------ */}
        {results.length > 0 && (
          <div className="mt-8 border border-green-200 rounded-lg p-4 bg-green-50">
            <h2 className="text-lg font-semibold mb-4 text-green-800">Resultados encontrados</h2>
            
            {results.map(ord => {
              const fecha = new Date(ord.fecha_orden)
              const fStr = fecha.toLocaleString("es-EC",
                          { day:"2-digit", month:"2-digit", year:"numeric",
                            hour:"2-digit", minute:"2-digit" })
              const paciente = ord.paciente?.nombre_completo ||
                              `${ord.paciente?.apellidos||""} ${ord.paciente?.nombres||""}`.trim() ||
                              "No disponible"
              const idTxt = ord.paciente?.numero_identificacion || "No disp."
              const medico = ord.medico?.nombre_completo ||
                            `${ord.medico?.apellidos||""} ${ord.medico?.nombres||""}`.trim() ||
                            "No disp."
              
              return (
                <div key={ord.id} className="mb-6 pb-4 border-b border-green-200 last:border-b-0">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nombre:</span>
                      <p className="font-semibold">{paciente}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Identificación:</span>
                      <p>{idTxt}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Fecha de Orden:</span>
                      <p>{fStr}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Número de Orden:</span>
                      <p>{ord.numero_orden}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Médico:</span>
                      <p>{medico}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Estado:</span>
                      <p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {ord.estado || "VALIDADO"}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">Exámenes:</span>
                    {ord.examenes?.length ? (
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {ord.examenes.map((ex, i) => (
                          <li key={i}>{ex.nombre} {ex.codigo && <span className="text-xs font-mono">({ex.codigo})</span>}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="italic">Sin exámenes</p>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href={`/api/download-pdf?orderId=${ord.id}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Descargar Resultados
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {hasSearched && !loading && results.length === 0 && !error && (
          <p className="mt-4 text-center text-gray-500">
            No se encontraron resultados para la búsqueda realizada
          </p>
        )}
      </div>
    </div>
  )
}
