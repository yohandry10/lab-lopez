"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExamenResponse {
  id_externo?: string
  nombre?: string
}

interface OrdenResponse {
  id: number
  numero_orden: string
  numero_orden_externa: string | null
  fecha_orden: string
  estado: 'G' | 'P' | 'R' | 'L' | 'V'
  paciente?: {
    tipo_identificacion?: string
    numero_identificacion?: string
    nombres?: string
    apellidos?: string
  }
}

export default function TestOrionPage() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [endpoint, setEndpoint] = useState("examenes")
  
  // Estados para búsqueda de órdenes
  const [numeroOrden, setNumeroOrden] = useState("")
  const [numeroIdentificacion, setNumeroIdentificacion] = useState("")

  const testApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL("/api/test-orion", window.location.origin)
      url.searchParams.append("endpoint", endpoint)
      
      // Agregar parámetros de búsqueda para órdenes
      if (endpoint === "ordenes") {
        if (numeroOrden) {
          url.searchParams.append("numero_orden", numeroOrden)
        }
        if (numeroIdentificacion) {
          url.searchParams.append("numero_identificacion", numeroIdentificacion)
        }
      }
      
      const res = await fetch(url.toString())
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Obtener la lista de exámenes o órdenes
  const examenes = response?.data?.data || []
  const ordenes = response?.data?.data || []

  // Función para mostrar el estado de la orden
  const getEstadoLabel = (estado: string) => {
    const estados = {
      'G': 'Generada',
      'P': 'Pendiente',
      'R': 'Recibida',
      'L': 'Liberada',
      'V': 'Validada'
    }
    return estados[estado as keyof typeof estados] || estado
  }

  // Función para obtener la clase CSS del estado
  const getEstadoClass = (estado: string) => {
    const clases = {
      'G': 'bg-gray-100 text-gray-800',
      'P': 'bg-yellow-100 text-yellow-800',
      'R': 'bg-blue-100 text-blue-800',
      'L': 'bg-green-100 text-green-800',
      'V': 'bg-purple-100 text-purple-800'
    }
    return clases[estado as keyof typeof clases] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Prueba API Orión</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuración de la prueba</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Endpoint</label>
              <Select value={endpoint} onValueChange={(value) => {
                setEndpoint(value)
                setResponse(null) // Limpiar respuesta al cambiar endpoint
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un endpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="examenes">/examenes</SelectItem>
                  <SelectItem value="ordenes">/ordenes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {endpoint === "ordenes" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Número de Orden</label>
                  <Input
                    type="text"
                    placeholder="Ingrese número de orden"
                    value={numeroOrden}
                    onChange={(e) => setNumeroOrden(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número de Identificación del Paciente</label>
                  <Input
                    type="text"
                    placeholder="Ingrese número de identificación"
                    value={numeroIdentificacion}
                    onChange={(e) => setNumeroIdentificacion(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <Button 
              onClick={testApi}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Probando..." : "Probar API"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {response && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Respuesta de {response.url}
            </h2>

            {response.endpoint === "examenes" && examenes.length > 0 ? (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">Lista de Exámenes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {examenes.map((examen: ExamenResponse, index: number) => (
                      <div 
                        key={examen.id_externo || `examen-${index}`} 
                        className="p-3 border rounded hover:bg-gray-50"
                      >
                        <span className="font-medium block">{examen.nombre || "Sin nombre"}</span>
                        {examen.id_externo && (
                          <span className="text-gray-500 text-xs">ID: {examen.id_externo}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Total de exámenes: {examenes.length}
                </div>
              </div>
            ) : response.endpoint === "ordenes" ? (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">Órdenes Encontradas</h3>
                  {ordenes.length > 0 ? (
                    <div className="space-y-4">
                      {ordenes.map((orden: OrdenResponse) => (
                        <div key={orden.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">Orden #{orden.numero_orden}</h4>
                              {orden.numero_orden_externa && (
                                <p className="text-sm text-gray-500">Orden externa: {orden.numero_orden_externa}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-sm ${getEstadoClass(orden.estado)}`}>
                              {getEstadoLabel(orden.estado)}
                            </span>
                          </div>
                          
                          {orden.paciente && (
                            <div className="mt-2 text-sm">
                              <p>
                                <span className="font-medium">Paciente:</span>{' '}
                                {orden.paciente.nombres} {orden.paciente.apellidos}
                              </p>
                              {orden.paciente.tipo_identificacion && orden.paciente.numero_identificacion && (
                                <p className="text-gray-500">
                                  {orden.paciente.tipo_identificacion}: {orden.paciente.numero_identificacion}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-500 mt-2">
                            Fecha: {new Date(orden.fecha_orden).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No se encontraron órdenes con los criterios especificados
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Total de órdenes: {ordenes.length}
                </div>
              </div>
            ) : (
              <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-[600px]">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 