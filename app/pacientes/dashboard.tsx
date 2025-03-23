"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  FileText,
  Calendar,
  Download,
  Mail,
  AlertCircle,
  Clock,
  XCircle,
  ShoppingCart,
  CreditCard,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-03-15",
    status: "completed",
    items: [
      { name: "Hemograma completo", price: 80 },
      { name: "Perfil lipídico", price: 120 },
    ],
    total: 200,
    paymentMethod: "Tarjeta de crédito",
    results: [
      { name: "Hemoglobina", value: "14.5 g/dL", reference: "13.5 - 17.5 g/dL", status: "normal" },
      { name: "Glucosa", value: "95 mg/dL", reference: "70 - 100 mg/dL", status: "normal" },
      { name: "Colesterol total", value: "210 mg/dL", reference: "< 200 mg/dL", status: "high" },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-03-20",
    status: "processing",
    items: [
      { name: "Glucosa en ayunas", price: 50 },
      { name: "Hemoglobina glicosilada", price: 90 },
    ],
    total: 140,
    paymentMethod: "Efectivo",
    results: [],
  },
  {
    id: "ORD-003",
    date: "2024-03-25",
    status: "pending",
    items: [{ name: "Perfil tiroideo", price: 150 }],
    total: 150,
    paymentMethod: "Pendiente",
    results: [],
  },
]

// Mock data for appointments
const mockAppointments = [
  {
    id: "APT-001",
    date: "2024-04-10",
    time: "09:00",
    status: "scheduled",
    type: "Toma de muestra",
    location: "Sede Central",
    notes: "Ayuno de 8 horas",
  },
  {
    id: "APT-002",
    date: "2024-04-15",
    time: "10:30",
    status: "scheduled",
    type: "Consulta resultados",
    location: "Sede Central",
    notes: "Traer resultados anteriores",
  },
  {
    id: "APT-003",
    date: "2024-03-25",
    time: "15:00",
    status: "completed",
    type: "Toma de muestra",
    location: "Sede Norte",
    notes: "Ninguna",
  },
]

// Mock data for services
const mockServices = [
  {
    id: "SRV-001",
    name: "Hemograma completo",
    description: "Análisis completo de células sanguíneas",
    price: 80,
    category: "Análisis de sangre",
    preparationInstructions: "Ayuno de 8 horas",
  },
  {
    id: "SRV-002",
    name: "Perfil lipídico",
    description: "Medición de colesterol y triglicéridos",
    price: 120,
    category: "Análisis de sangre",
    preparationInstructions: "Ayuno de 12 horas",
  },
  {
    id: "SRV-003",
    name: "Glucosa en ayunas",
    description: "Medición de niveles de glucosa",
    price: 50,
    category: "Análisis de sangre",
    preparationInstructions: "Ayuno de 8 horas",
  },
  {
    id: "SRV-004",
    name: "Perfil tiroideo",
    description: "Evaluación de la función tiroidea",
    price: 150,
    category: "Análisis hormonales",
    preparationInstructions: "No requiere preparación especial",
  },
  {
    id: "SRV-005",
    name: "Hemoglobina glicosilada",
    description: "Control de diabetes",
    price: 90,
    category: "Análisis de sangre",
    preparationInstructions: "No requiere preparación especial",
  },
]

export default function PatientDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState(mockOrders)
  const [appointments, setAppointments] = useState(mockAppointments)
  const [services, setServices] = useState(mockServices)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isScheduleAppointmentOpen, setIsScheduleAppointmentOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [appointmentFormData, setAppointmentFormData] = useState({
    date: "",
    time: "",
    type: "Toma de muestra",
    location: "Sede Central",
    notes: "",
  })
  const [statsData, setStatsData] = useState({
    totalOrders: mockOrders.length,
    pendingResults: mockOrders.filter((o) => o.status === "processing").length,
    upcomingAppointments: mockAppointments.filter((a) => a.status === "scheduled").length,
  })

  // Check if user is logged in and is a patient
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.userType !== "patient") {
      router.push("/")
    }
  }, [user, router])

  // Update stats when data changes
  useEffect(() => {
    setStatsData({
      totalOrders: orders.length,
      pendingResults: orders.filter((o) => o.status === "processing").length,
      upcomingAppointments: appointments.filter((a) => a.status === "scheduled").length,
    })
  }, [orders, appointments])

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add service to cart
  const addToCart = (service) => {
    setCart([...cart, service])
    toast({
      title: "Servicio agregado",
      description: `${service.name} ha sido agregado al carrito.`,
    })
  }

  // Remove service from cart
  const removeFromCart = (serviceId) => {
    setCart(cart.filter((item) => item.id !== serviceId))
  }

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price, 0)

  // Handle checkout
  const handleCheckout = () => {
    // Generate a patient code if not already assigned
    if (!user.patientCode) {
      // In a real application, this would be handled by the backend
      const patientCode = `ROE-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`

      // Update user with patient code (in a real app, this would update the database)
      // For demo purposes, we're just showing a toast
      toast({
        title: "Código de paciente generado",
        description: `Tu código de paciente es: ${patientCode}`,
      })
    }

    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      items: cart.map((item) => ({ name: item.name, price: item.price })),
      total: cartTotal,
      paymentMethod: "Pendiente",
      results: [],
    }

    setOrders([...orders, newOrder])
    setCart([])
    setIsCartOpen(false)

    // Redirect to payment gateway
    toast({
      title: "Redirigiendo a pasarela de pago",
      description: `Procesando orden ${newOrder.id}...`,
    })

    // Simulate redirect to payment gateway
    setTimeout(() => {
      toast({
        title: "Orden creada",
        description: `Tu orden ${newOrder.id} ha sido creada correctamente.`,
      })

      // In a real application, this would redirect to an actual payment gateway
      // window.location.href = "/pasarela-de-pago?order=" + newOrder.id;
    }, 1500)
  }

  // Handle appointment form input change
  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target
    setAppointmentFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Schedule new appointment
  const handleScheduleAppointment = () => {
    const newAppointment = {
      id: `APT-${String(appointments.length + 1).padStart(3, "0")}`,
      date: appointmentFormData.date,
      time: appointmentFormData.time,
      status: "scheduled",
      type: appointmentFormData.type,
      location: appointmentFormData.location,
      notes: appointmentFormData.notes,
    }

    setAppointments([...appointments, newAppointment])
    setAppointmentFormData({
      date: "",
      time: "",
      type: "Toma de muestra",
      location: "Sede Central",
      notes: "",
    })
    setIsScheduleAppointmentOpen(false)
    toast({
      title: "Cita programada",
      description: `Tu cita ha sido programada correctamente para el ${newAppointment.date} a las ${newAppointment.time}.`,
    })
  }

  // Cancel appointment
  const cancelAppointment = (appointmentId) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status: "cancelled" } : appointment,
    )

    setAppointments(updatedAppointments)
    toast({
      title: "Cita cancelada",
      description: "Tu cita ha sido cancelada correctamente.",
    })
  }

  // If user is not logged in or not a patient, show loading
  if (!user || user.userType !== "patient") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Paciente</h1>
            <p className="text-gray-500">
              Bienvenido, {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsScheduleAppointmentOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Programar Cita
            </Button>
            <Button onClick={() => setIsCartOpen(true)} variant="outline" className="relative">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Carrito
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Órdenes</p>
                <h3 className="text-3xl font-bold">{statsData.totalOrders}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Resultados Pendientes</p>
                <h3 className="text-3xl font-bold">{statsData.pendingResults}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Citas Programadas</p>
                <h3 className="text-3xl font-bold">{statsData.upcomingAppointments}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="results">Mis Resultados</TabsTrigger>
            <TabsTrigger value="appointments">Mis Citas</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
          </TabsList>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Mis Resultados</CardTitle>
                <CardDescription>Historial de órdenes y resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Orden #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{order.id}</td>
                            <td className="py-3 px-4">{order.date}</td>
                            <td className="py-3 px-4">S/ {order.total.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "success"
                                    : order.status === "processing"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {order.status === "completed"
                                  ? "Completado"
                                  : order.status === "processing"
                                    ? "En proceso"
                                    : "Pendiente"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                disabled={order.status === "pending"}
                              >
                                {order.status === "completed" ? "Ver Resultados" : "Ver Detalles"}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            No tienes órdenes registradas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Mis Citas</CardTitle>
                    <CardDescription>Historial y programación de citas</CardDescription>
                  </div>
                  <Button onClick={() => setIsScheduleAppointmentOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Programar Cita
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Cita #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Hora</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                          <tr key={appointment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{appointment.id}</td>
                            <td className="py-3 px-4">{appointment.date}</td>
                            <td className="py-3 px-4">{appointment.time}</td>
                            <td className="py-3 px-4">{appointment.type}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  appointment.status === "scheduled"
                                    ? "outline"
                                    : appointment.status === "completed"
                                      ? "success"
                                      : "destructive"
                                }
                              >
                                {appointment.status === "scheduled"
                                  ? "Programada"
                                  : appointment.status === "completed"
                                    ? "Completada"
                                    : "Cancelada"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                                  Ver Detalles
                                </Button>
                                {appointment.status === "scheduled" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => cancelAppointment(appointment.id)}
                                  >
                                    Cancelar
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            No tienes citas programadas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Servicios Disponibles</CardTitle>
                    <CardDescription>Explora nuestros servicios y análisis</CardDescription>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar servicios..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <Card key={service.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <Badge variant="outline">{service.category}</Badge>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Preparación:</span> {service.preparationInstructions}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center pt-2">
                          <p className="font-bold">S/ {service.price.toFixed(2)}</p>
                          <Button
                            size="sm"
                            onClick={() => addToCart(service)}
                            disabled={cart.some((item) => item.id === service.id)}
                          >
                            {cart.some((item) => item.id === service.id) ? "Agregado" : "Agregar al carrito"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 py-6 text-center text-gray-500">No se encontraron servicios</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Orden</DialogTitle>
            <DialogDescription>Orden #{selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Fecha: {selectedOrder.date}</p>
                  <p className="text-sm text-gray-500">Método de pago: {selectedOrder.paymentMethod}</p>
                </div>
                <Badge
                  variant={
                    selectedOrder.status === "completed"
                      ? "success"
                      : selectedOrder.status === "processing"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {selectedOrder.status === "completed"
                    ? "Completado"
                    : selectedOrder.status === "processing"
                      ? "En proceso"
                      : "Pendiente"}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Servicios</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Servicio</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4 text-right">S/ {item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td className="py-3 px-4">Total</td>
                        <td className="py-3 px-4 text-right">S/ {selectedOrder.total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedOrder.status === "completed" && selectedOrder.results.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Resultados</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Parámetro</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Resultado</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Valores de referencia</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-500">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedOrder.results.map((result, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4">{result.name}</td>
                            <td className="py-3 px-4 font-medium">{result.value}</td>
                            <td className="py-3 px-4 text-gray-500">{result.reference}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                variant={
                                  result.status === "normal"
                                    ? "success"
                                    : result.status === "high"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {result.status === "normal" ? "Normal" : result.status === "high" ? "Elevado" : "Bajo"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedOrder.status === "processing" && (
                <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                  <p className="text-gray-700 font-medium">Tus resultados están siendo procesados</p>
                  <p className="text-gray-500 mt-2">Te notificaremos cuando estén listos</p>
                </div>
              )}

              {selectedOrder.status === "pending" && (
                <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-700 font-medium">Pago pendiente</p>
                  <p className="text-gray-500 mt-2">Completa el pago para procesar tu orden</p>
                  <Button className="mt-4">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Realizar pago
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {selectedOrder.status === "completed" && (
                  <>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </Button>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar por correo
                    </Button>
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Appointment Details Dialog */}
      <Dialog open={selectedAppointment !== null} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Cita</DialogTitle>
            <DialogDescription>Cita #{selectedAppointment?.id}</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Tipo: {selectedAppointment.type}</p>
                  <p className="text-sm text-gray-500">Ubicación: {selectedAppointment.location}</p>
                </div>
                <Badge
                  variant={
                    selectedAppointment.status === "scheduled"
                      ? "outline"
                      : selectedAppointment.status === "completed"
                        ? "success"
                        : "destructive"
                  }
                >
                  {selectedAppointment.status === "scheduled"
                    ? "Programada"
                    : selectedAppointment.status === "completed"
                      ? "Completada"
                      : "Cancelada"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Fecha y Hora</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <p className="font-medium">{selectedAppointment.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <p className="font-medium">{selectedAppointment.time}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Información Adicional</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedAppointment.notes ? (
                      <p>{selectedAppointment.notes}</p>
                    ) : (
                      <p className="text-gray-500">No hay notas adicionales</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {selectedAppointment.status === "scheduled" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      cancelAppointment(selectedAppointment.id)
                      setSelectedAppointment(null)
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar Cita
                  </Button>
                )}
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agregar a Calendario
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Appointment Dialog */}
      <Dialog open={isScheduleAppointmentOpen} onOpenChange={setIsScheduleAppointmentOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Programar Nueva Cita</DialogTitle>
            <DialogDescription>Selecciona la fecha y hora para tu cita</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={appointmentFormData.date}
                  onChange={handleAppointmentFormChange}
                />
              </div>
              <div>
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={appointmentFormData.time}
                  onChange={handleAppointmentFormChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type">Tipo de cita</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={appointmentFormData.type}
                onChange={handleAppointmentFormChange}
              >
                <option value="Toma de muestra">Toma de muestra</option>
                <option value="Consulta resultados">Consulta resultados</option>
                <option value="Vacunación">Vacunación</option>
              </select>
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <select
                id="location"
                name="location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={appointmentFormData.location}
                onChange={handleAppointmentFormChange}
              >
                <option value="Sede Central">Sede Central</option>
                <option value="Sede Norte">Sede Norte</option>
                <option value="Sede Sur">Sede Sur</option>
              </select>
            </div>
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <textarea
                id="notes"
                name="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={appointmentFormData.notes}
                onChange={handleAppointmentFormChange}
                placeholder="Información adicional para tu cita"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleAppointmentOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleScheduleAppointment}>Programar Cita</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Carrito de Compras</DialogTitle>
            <DialogDescription>Servicios seleccionados</DialogDescription>
          </DialogHeader>
          {cart.length > 0 ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Servicio</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Precio</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cart.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">S/ {item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="py-3 px-4">Total</td>
                      <td className="py-3 px-4 text-right">S/ {cartTotal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                  Seguir Comprando
                </Button>
                <Button onClick={handleCheckout}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceder al Pago
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="py-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tu carrito está vacío</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsCartOpen(false)}>
                Explorar Servicios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

