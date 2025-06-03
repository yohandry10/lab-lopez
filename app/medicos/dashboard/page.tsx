"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { TestResultsModal } from "@/components/test-results-modal"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface Examen {
  codigo: string
  nombre: string
}

interface Paciente {
  id?: number
  tipo_identificacion?: string
  numero_identificacion?: string
  nombres?: string
  apellidos?: string
  nombre_completo?: string
}

interface Medico {
  id?: number
  nombres?: string
  apellidos?: string
  nombre_completo?: string
}

interface OrdenResponse {
  id: number
  numero_orden: string
  fecha_orden: string
  estado: string
  paciente?: Paciente
  medico?: Medico
  examenes?: Examen[]
}

export default function DashboardMedicoPage() {
  const [orders, setOrders] = useState<OrdenResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedService, setSelectedService] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)

  // Cargar resultados al cargar la página
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // En una implementación real, aquí podrías filtrar por el ID del médico
        // usando la sesión del usuario o una cookie
        const response = await fetch("/api/test-orion?type=medico&value=all")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar resultados")
        }

        if (data.success && data.data && Array.isArray(data.data)) {
          setOrders(data.data)
        } else {
          setOrders([])
          // Si no hay datos reales, podemos usar datos de ejemplo para la demostración
          setOrders(getMockOrders())
        }
      } catch (err) {
        console.error("Error al cargar resultados:", err)
        setError(err instanceof Error ? err.message : "Error al cargar resultados")
        // Usar datos de ejemplo para demostración
        setOrders(getMockOrders())
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Función de filtrado de órdenes
  const filteredOrders = orders.filter((orden) => {
    // Filtro por búsqueda (en número de orden o nombre del paciente)
    const searchMatch = search === "" || 
      orden.numero_orden.toLowerCase().includes(search.toLowerCase()) ||
      (orden.paciente?.nombre_completo || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (orden.paciente?.apellidos && orden.paciente?.nombres
        ? `${orden.paciente.apellidos} ${orden.paciente.nombres}`
        : "")
        .toLowerCase()
        .includes(search.toLowerCase())

    // Aquí añadiríamos filtros por categoría, servicio y estado si fuera necesario
    const categoryMatch = selectedCategory === "all" || true // Implementar cuando haya datos reales
    const serviceMatch = selectedService === "all" || true // Implementar cuando haya datos reales
    const statusMatch = selectedStatus === "all" || orden.estado === selectedStatus

    return searchMatch && categoryMatch && serviceMatch && statusMatch
  })

  const handleViewResults = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsResultsModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Panel del Médico - Resultados</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="md:col-span-2">
            <Label htmlFor="searchInput">Buscar</Label>
            <Input
              id="searchInput"
              placeholder="Buscar por orden o paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="categoryFilter">Categoría</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="hematologia">Hematología</SelectItem>
                <SelectItem value="inmunologia">Inmunología</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="serviceFilter">Servicio</Label>
            <Select
              value={selectedService}
              onValueChange={setSelectedService}
            >
              <SelectTrigger>
                <SelectValue placeholder="Servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ambulatorio">Ambulatorio</SelectItem>
                <SelectItem value="hospitalizado">Hospitalizado</SelectItem>
                <SelectItem value="domicilio">Domicilio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="statusFilter">Estado</Label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="VALIDADO">Validado</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="ANULADO">Anulado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando resultados...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Orden No.
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Paciente
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Médico
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Estado
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No se encontraron resultados
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((orden) => {
                      // Parsear la fecha
                      const fecha = new Date(orden.fecha_orden)
                      const dia = String(fecha.getDate()).padStart(2, "0")
                      const mes = String(fecha.getMonth() + 1).padStart(2, "0")
                      const anio = fecha.getFullYear()
                      const horas = String(fecha.getHours()).padStart(2, "0")
                      const minutos = String(fecha.getMinutes()).padStart(2, "0")
                      const fechaFormateada = `${dia}/${mes}/${anio} ${horas}:${minutos}`

                      // Nombre del paciente
                      const nombrePaciente = orden.paciente
                        ? orden.paciente.apellidos && orden.paciente.nombres
                          ? `${orden.paciente.apellidos} ${orden.paciente.nombres}`
                          : orden.paciente.nombre_completo || "No disponible"
                        : "No disponible"

                      // Nombre del médico
                      const nombreMedico = orden.medico
                        ? orden.medico.apellidos && orden.medico.nombres
                          ? `${orden.medico.apellidos} ${orden.medico.nombres}`
                          : orden.medico.nombre_completo || "EXTERNO\nPARTICULAR"
                        : "EXTERNO\nPARTICULAR"

                      return (
                        <tr
                          key={orden.id}
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
                            <span className="whitespace-pre-line">{nombreMedico}</span>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                              orden.estado === "VALIDADO" 
                                ? "bg-green-100 text-green-800" 
                                : orden.estado === "PENDIENTE"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {orden.estado || "VALIDADO"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-center space-x-2">
                            <button
                              onClick={() => handleViewResults(orden.id)}
                              className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-medium"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Ver
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
                              PDF
                            </a>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-right">
              Total: {filteredOrders.length}
            </div>
          </>
        )}
      </div>

      {/* Modal de resultados */}
      {selectedOrderId !== null && (
        <TestResultsModal
          open={isResultsModalOpen}
          onOpenChange={setIsResultsModalOpen}
          orderId={selectedOrderId}
          orderNumber={orders.find(r => r.id === selectedOrderId)?.numero_orden || ""}
          patientName={
            (() => {
              const orden = orders.find(r => r.id === selectedOrderId);
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
          patientId={orders.find(r => r.id === selectedOrderId)?.paciente?.numero_identificacion}
          testDate={
            (() => {
              const orden = orders.find(r => r.id === selectedOrderId);
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

// Función auxiliar para generar datos de ejemplo para demostración
function getMockOrders(): OrdenResponse[] {
  return [
    {
      id: 2504093,
      numero_orden: "2504093",
      fecha_orden: "2023-04-09T10:57:00",
      estado: "VALIDADO",
      paciente: {
        id: 123,
        tipo_identificacion: "DNI",
        numero_identificacion: "75784874",
        nombres: "JEAN PAUL",
        apellidos: "PALOMINO MENDEZ",
      },
      medico: {
        nombre_completo: "EXTERNO\nPARTICULAR"
      },
      examenes: [
        { codigo: "BH", nombre: "HEMOGRAMA COMPLETO" },
        { codigo: "PH", nombre: "PERFIL HEPÁTICO" },
        { codigo: "PR", nombre: "PERFIL RENAL" },
        { codigo: "PT", nombre: "PERFIL TIROIDEO" }
      ]
    },
    {
      id: 2504083,
      numero_orden: "2504083",
      fecha_orden: "2023-04-08T10:27:00",
      estado: "VALIDADO",
      paciente: {
        id: 124,
        tipo_identificacion: "DNI",
        numero_identificacion: "75769863",
        nombres: "CLAUDIA ERLITA",
        apellidos: "CAMPOS ALMA",
      },
      medico: {
        nombre_completo: "EXTERNO\nPARTICULAR"
      },
      examenes: [
        { codigo: "PB", nombre: "PERFIL BIOQUÍMICO" }
      ]
    },
    {
      id: 2504082,
      numero_orden: "2504082",
      fecha_orden: "2023-04-08T09:59:00",
      estado: "VALIDADO",
      paciente: {
        id: 125,
        tipo_identificacion: "DNI",
        numero_identificacion: "76609561",
        nombres: "LIZBETH DE ROCIO BEATRIZ",
        apellidos: "CARPIO AVALOS",
      },
      medico: {
        nombre_completo: "EXTERNO\nPARTICULAR"
      },
      examenes: [
        { codigo: "QS", nombre: "QUÍMICA SANGUÍNEA" }
      ]
    },
    {
      id: 2504051,
      numero_orden: "2504051",
      fecha_orden: "2023-04-05T08:52:00",
      estado: "VALIDADO",
      paciente: {
        id: 126,
        tipo_identificacion: "DNI",
        numero_identificacion: "73444727",
        nombres: "JAQUELINE IVET",
        apellidos: "SANDOVAL GUTIERREZ",
      },
      medico: {
        nombre_completo: "EXTERNO\nPARTICULAR"
      },
      examenes: [
        { codigo: "UC", nombre: "UROCULTIVO" }
      ]
    },
    {
      id: 2504022,
      numero_orden: "2504022",
      fecha_orden: "2023-04-02T09:54:00",
      estado: "VALIDADO",
      paciente: {
        id: 127,
        tipo_identificacion: "DNI",
        numero_identificacion: "74610047",
        nombres: "GUILLERMO DAVID",
        apellidos: "LINARES YARAINGA",
      },
      medico: {
        nombre_completo: "EXTERNO\nPARTICULAR"
      },
      examenes: [
        { codigo: "PS", nombre: "PERFIL SANGUÍNEO" }
      ]
    }
  ]
} 