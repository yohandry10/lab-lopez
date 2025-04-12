"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { TestResultsModal } from "@/components/test-results-modal"

interface Examen {
  codigo: string // El código corto del examen (ej: BH)
  nombre: string // El nombre completo del examen
}

// Ajusta según lo que devuelva la API real
interface OrdenResponse {
  id: number
  numero_orden: string
  fecha_orden: string
  estado: string
  paciente?: {
    id?: number
    tipo_identificacion?: string
    numero_identificacion?: string
    nombres?: string
    apellidos?: string
    nombre_completo?: string
  }
  medico?: {
    id?: number
    nombres?: string
    apellidos?: string
    nombre_completo?: string
  }
  examenes?: Examen[] // Añadir el campo para los exámenes
}

export default function ResultadosPage() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") || "orden"

  const [activeTab, setActiveTab] = useState<string>(initialType)
  const [numeroOrden, setNumeroOrden] = useState("")
  const [numeroIdentificacion, setNumeroIdentificacion] = useState("")
  const [results, setResults] = useState<OrdenResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)

  const handleSearch = async () => {
    const searchValue =
      activeTab === "orden" ? numeroOrden.trim() : numeroIdentificacion.trim()

    if (!searchValue) {
      setError(
        `Por favor ingrese un ${
          activeTab === "orden" ? "número de orden" : "número de identificación"
        }`
      )
      return
    }

    setLoading(true)
    setError("")
    setResults([])

    try {
      console.log("\n=== ENVIANDO BÚSQUEDA ===")
      console.log("Tipo de búsqueda:", activeTab)
      console.log("Valor:", searchValue.trim())

      const url = `/api/test-orion?type=${activeTab}&value=${encodeURIComponent(
        searchValue.trim()
      )}`

      console.log("URL completa:", url)

      const response = await fetch(url)
      const data = await response.json()

      console.log("\n=== RESPUESTA RECIBIDA ===")
      console.log(JSON.stringify(data, null, 2))

      if (data.success === false) {
        // Si la API devuelve éxito falso pero tiene un mensaje informativo
        setError(data.message || "No se encontraron resultados")
        setResults([])
        return
      }

      // Si tenemos datos, los procesamos aunque haya un mensaje de advertencia
      if (data.data && Array.isArray(data.data)) {
        if (data.data.length === 0) {
          setError(
            `No se encontraron resultados para el número de ${
              activeTab === "orden" ? "orden" : "identificación"
            } ${searchValue.trim()}`
          )
        } else {
          // Mostrar mensaje informativo si existe
          if (data.message && !data.message.includes("Se encontraron")) {
            setError(data.message)
          } else {
            setError("")
          }
          
          // Siempre mostrar los resultados si los hay, incluso si son alternativos
          setResults(data.data)
        }
      } else {
        setResults([])
        setError("La respuesta de la API no tiene el formato esperado")
      }
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Error al buscar resultados")
    } finally {
      setLoading(false)
    }
  }

  const handleViewResults = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsResultsModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Consulta de Resultados</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="orden" className="flex-1">
                Buscar por Orden
              </TabsTrigger>
              <TabsTrigger value="identificacion" className="flex-1">
                Buscar por Identificación
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          {activeTab === "orden" ? (
            <div>
              <Label htmlFor="numeroOrden">Número de Orden</Label>
              <Input
                id="numeroOrden"
                type="text"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                placeholder="Ingrese el número de orden"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Ingrese solo el número de orden, sin espacios ni caracteres especiales
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="numeroIdentificacion">Número de Identificación</Label>
              <Input
                id="numeroIdentificacion"
                type="text"
                value={numeroIdentificacion}
                onChange={(e) => setNumeroIdentificacion(e.target.value)}
                placeholder="Ingrese el número de identificación"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Ingrese solo el número de identificación, sin formato E:XXa S:X
              </p>
            </div>
          )}

          <Button onClick={handleSearch} disabled={loading} className="w-full">
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Resultados encontrados</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      NO
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      FECHA
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      PACIENTE
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      IDENTIFICACIÓN
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      EXÁMENES
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      MÉDICO
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      ESTADO
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((orden) => {
                    // Parsear la fecha
                    const fecha = new Date(orden.fecha_orden)
                    const dia = String(fecha.getDate()).padStart(2, "0")
                    const mes = String(fecha.getMonth() + 1).padStart(2, "0")
                    const anio = fecha.getFullYear()
                    const horas = fecha.getHours()
                    const minutos = String(fecha.getMinutes()).padStart(2, "0")
                    const ampm = horas >= 12 ? "p. m." : "a. m."
                    const horas12 = (horas % 12) || 12
                    const fechaFormateada = `${dia}/${mes}/${anio}, ${horas12}:${minutos} ${ampm}`

                    // Determinar estado del paciente y la identificación
                    let nombrePaciente: string | React.ReactNode = (
                      <span className="text-red-600 italic">No proporcionado</span>
                    );
                    let identificacion: string | React.ReactNode = (
                      <span className="text-red-600 italic">No proporcionado</span>
                    );

                    // Solo intentar extraer si el objeto paciente existe y tiene claves
                    if (orden.paciente && Object.keys(orden.paciente).length > 0) {
                      const {
                        apellidos,
                        nombres,
                        nombre_completo,
                        numero_identificacion,
                        tipo_identificacion,
                      } = orden.paciente

                      let nombreTemp = "";
                      // Nombre
                      if (apellidos && nombres && apellidos !== "No disponible" && nombres !== "No disponible") {
                        nombreTemp = `${apellidos} ${nombres}`
                      } else if (nombre_completo && nombre_completo !== "No disponible") {
                        nombreTemp = nombre_completo
                      }
                      // Si se construyó un nombre válido, usarlo
                      if (nombreTemp) {
                        nombrePaciente = nombreTemp;
                      }

                      let idTemp = "";
                      // Identificación
                      if (numero_identificacion && numero_identificacion !== "No disponible") {
                        idTemp = numero_identificacion
                        if (tipo_identificacion) {
                          idTemp += ` (${tipo_identificacion})`
                        }
                      } else if (tipo_identificacion === "SIN_IDENTIFICACION") {
                        idTemp = "No proporcionado"
                      }
                      // Si se construyó una ID válida, usarla
                      if (idTemp) {
                        identificacion = idTemp;
                      }
                    }

                    // Obtener información del médico
                    const medico = orden.medico ? 
                      `${orden.medico.apellidos || ''} ${orden.medico.nombres || ''}`.trim() || 
                      (orden.medico.nombre_completo || "EXTERNO\nPARTICULAR") : 
                      "EXTERNO\nPARTICULAR";

                    // Obtener estado del examen
                    const estado = orden.estado || "VALIDADO";

                    // Agrupar los exámenes para mostrarlos en una sola lista
                    const examenesList = (orden.examenes && orden.examenes.length > 0) ? (
                      <ul className="space-y-1 list-disc pl-5">
                        {orden.examenes.map((examen, idx) => (
                          <li key={idx}>{examen.nombre || "Sin descripción"} {examen.codigo && <span className="text-xs font-mono">({examen.codigo})</span>}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="italic">No hay exámenes asociados</span>
                    );

                    return (
                      <tr
                        key={`${orden.id}-${orden.numero_orden}`}
                        className="hover:bg-gray-50 border-b border-gray-100"
                      >
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {orden.numero_orden}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {fechaFormateada}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                          {nombrePaciente}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {identificacion}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 align-top">
                          {examenesList}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <span className="whitespace-pre-line">{medico}</span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className="inline-block px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">
                            {estado}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 align-top">
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleViewResults(orden.id)}
                              className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-medium"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Ver resultado
                            </button>
                            <a 
                              href={`/api/download-pdf?orderId=${orden.id}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors font-medium"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-11.25a.75.75 0 0 0-1.5 0v4.59L6.3 9.8a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 1 0-1.06-1.06l-1.94 1.94V6.75Z" clipRule="evenodd" />
                              </svg>
                              Descargar PDF
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <div className="mt-4 p-4 text-center text-gray-500">
            No se encontraron resultados para la búsqueda realizada
          </div>
        )}
      </div>

      {/* Modal de resultados */}
      {selectedOrderId !== null && (
        <TestResultsModal
          open={isResultsModalOpen}
          onOpenChange={setIsResultsModalOpen}
          orderId={selectedOrderId}
          orderNumber={results.find(r => r.id === selectedOrderId)?.numero_orden || ""}
          patientName={
            (() => {
              const orden = results.find(r => r.id === selectedOrderId);
              if (!orden || !orden.paciente) return "Paciente";
              
              const { apellidos, nombres, nombre_completo } = orden.paciente;
              
              if (apellidos && nombres) {
                return `${apellidos} ${nombres}`;
              } else if (nombre_completo) {
                return nombre_completo;
              } else {
                return "Paciente";
              }
            })()
          }
          patientId={results.find(r => r.id === selectedOrderId)?.paciente?.numero_identificacion}
          testDate={
            (() => {
              const orden = results.find(r => r.id === selectedOrderId);
              if (!orden) return "";
              
              const fecha = new Date(orden.fecha_orden);
              return fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            })()
          }
        />
      )}
    </div>
  )
}
