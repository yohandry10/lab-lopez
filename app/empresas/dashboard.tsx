"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Search, Calendar, Users, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
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

// Importar las funciones de la base de datos al principio del archivo
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "@/lib/database"

// Mock data for employees
const mockEmployees = [
  {
    id: "EMP-001",
    name: "Roberto Gómez",
    position: "Gerente de Recursos Humanos",
    department: "Recursos Humanos",
    email: "roberto.gomez@empresa.com",
    phone: "999-888-777",
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: "EMP-002",
    name: "Laura Torres",
    position: "Analista Financiero",
    department: "Finanzas",
    email: "laura.torres@empresa.com",
    phone: "999-777-888",
    status: "active",
    joinDate: "2023-01-20",
  },
  {
    id: "EMP-003",
    name: "Miguel Sánchez",
    position: "Supervisor de Operaciones",
    department: "Operaciones",
    email: "miguel.sanchez@empresa.com",
    phone: "999-666-555",
    status: "inactive",
    joinDate: "2023-01-10",
  },
  {
    id: "EMP-004",
    name: "Sofía Ramírez",
    position: "Especialista en Marketing",
    department: "Marketing",
    email: "sofia.ramirez@empresa.com",
    phone: "999-555-444",
    status: "active",
    joinDate: "2023-02-05",
  },
  {
    id: "EMP-005",
    name: "Carlos Mendoza",
    position: "Desarrollador de Software",
    department: "Tecnología",
    email: "carlos.mendoza@empresa.com",
    phone: "999-444-333",
    status: "active",
    joinDate: "2023-02-15",
  },
]

// Mock data for appointments
const mockAppointments = [
  {
    id: "APT-001",
    employeeId: "EMP-001",
    employeeName: "Roberto Gómez",
    date: "2024-04-10",
    time: "09:00",
    status: "scheduled",
    type: "Examen médico ocupacional",
    location: "Sede Central",
  },
  {
    id: "APT-002",
    employeeId: "EMP-002",
    employeeName: "Laura Torres",
    date: "2024-04-15",
    time: "10:30",
    status: "scheduled",
    type: "Examen médico ocupacional",
    location: "Sede Central",
  },
  {
    id: "APT-003",
    employeeId: "EMP-003",
    employeeName: "Miguel Sánchez",
    date: "2024-03-25",
    time: "15:00",
    status: "completed",
    type: "Examen médico ocupacional",
    location: "Sede Norte",
  },
]

// Mock data for services
const mockServices = [
  {
    id: "SRV-001",
    name: "Examen médico ocupacional",
    description: "Evaluación médica completa para empleados",
    price: 200,
    category: "Salud ocupacional",
  },
  {
    id: "SRV-002",
    name: "Evaluación psicológica",
    description: "Evaluación del estado psicológico del empleado",
    price: 150,
    category: "Salud ocupacional",
  },
  {
    id: "SRV-003",
    name: "Audiometría",
    description: "Evaluación de la capacidad auditiva",
    price: 80,
    category: "Salud ocupacional",
  },
  {
    id: "SRV-004",
    name: "Espirometría",
    description: "Evaluación de la función pulmonar",
    price: 90,
    category: "Salud ocupacional",
  },
  {
    id: "SRV-005",
    name: "Campaña de vacunación",
    description: "Vacunación contra la influenza para empleados",
    price: 50,
    category: "Prevención",
  },
]

export default function CompanyDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [employees, setEmployees] = useState(mockEmployees)
  const [appointments, setAppointments] = useState(mockAppointments)
  const [services, setServices] = useState(mockServices)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isScheduleAppointmentOpen, setIsScheduleAppointmentOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
  })
  const [appointmentFormData, setAppointmentFormData] = useState({
    employeeId: "",
    date: "",
    time: "",
    type: "Examen médico ocupacional",
    location: "Sede Central",
  })
  const [statsData, setStatsData] = useState({
    totalEmployees: mockEmployees.length,
    activeEmployees: mockEmployees.filter((e) => e.status === "active").length,
    pendingAppointments: mockAppointments.filter((a) => a.status === "scheduled").length,
    totalServices: services.length,
  })

  // Check if user is logged in and is a company
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.userType !== "company" || !user.isCompanyAdmin) {
      router.push("/")
    } else {
      // Cargar empleados desde la base de datos
      const loadEmployees = async () => {
        try {
          const employeesData = await getEmployees(user.id)
          if (employeesData && employeesData.length > 0) {
            setEmployees(employeesData)
          }
        } catch (error) {
          console.error("Error loading employees:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar los empleados. Intente nuevamente.",
            variant: "destructive",
          })
        }
      }

      loadEmployees()
    }
  }, [user, router])

  // Update stats when data changes
  useEffect(() => {
    setStatsData({
      totalEmployees: employees.length,
      activeEmployees: employees.filter((e) => e.status === "active").length,
      pendingAppointments: appointments.filter((a) => a.status === "scheduled").length,
      totalServices: services.length,
    })
  }, [employees, appointments, services])

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get recent employees (last 5 added)
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5)

  // Handle employee form input change
  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target
    setEmployeeFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle appointment form input change
  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target
    setAppointmentFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add new employee
  const handleAddEmployee = async () => {
    if (!user) return

    try {
      const newEmployeeData = {
        company_id: user.id,
        name: employeeFormData.name,
        position: employeeFormData.position,
        department: employeeFormData.department,
        email: employeeFormData.email,
        phone: employeeFormData.phone,
        status: "active",
        join_date: new Date().toISOString().split("T")[0],
      }

      const newEmployee = await createEmployee(newEmployeeData)

      if (newEmployee) {
        setEmployees([...employees, newEmployee])
        setEmployeeFormData({
          name: "",
          position: "",
          department: "",
          email: "",
          phone: "",
        })
        setIsAddEmployeeOpen(false)
        toast({
          title: "Empleado agregado",
          description: `${newEmployee.name} ha sido agregado correctamente.`,
        })
      } else {
        throw new Error("No se pudo crear el empleado")
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el empleado. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Agregar función para actualizar empleado
  const handleUpdateEmployee = async (employeeId, updates) => {
    try {
      const updatedEmployee = await updateEmployee(employeeId, updates)

      if (updatedEmployee) {
        const updatedEmployees = employees.map((emp) => (emp.id === employeeId ? updatedEmployee : emp))
        setEmployees(updatedEmployees)

        if (selectedEmployee && selectedEmployee.id === employeeId) {
          setSelectedEmployee(updatedEmployee)
        }

        toast({
          title: "Empleado actualizado",
          description: `${updatedEmployee.name} ha sido actualizado correctamente.`,
        })
      } else {
        throw new Error("No se pudo actualizar el empleado")
      }
    } catch (error) {
      console.error("Error updating employee:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el empleado. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Agregar función para eliminar empleado
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const success = await deleteEmployee(employeeId)

      if (success) {
        const filteredEmployees = employees.filter((emp) => emp.id !== employeeId)
        setEmployees(filteredEmployees)

        if (selectedEmployee && selectedEmployee.id === employeeId) {
          setSelectedEmployee(null)
        }

        toast({
          title: "Empleado eliminado",
          description: "El empleado ha sido eliminado correctamente.",
        })
      } else {
        throw new Error("No se pudo eliminar el empleado")
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el empleado. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Schedule new appointment
  const handleScheduleAppointment = () => {
    const employee = employees.find((e) => e.id === appointmentFormData.employeeId)
    const newAppointment = {
      id: `APT-${String(appointments.length + 1).padStart(3, "0")}`,
      employeeId: appointmentFormData.employeeId,
      employeeName: employee ? employee.name : "",
      date: appointmentFormData.date,
      time: appointmentFormData.time,
      status: "scheduled",
      type: "Examen médico ocupacional",
      location: appointmentFormData.location,
    }

    setAppointments([...appointments, newAppointment])
    setAppointmentFormData({
      employeeId: "",
      date: "",
      time: "",
      type: "Examen médico ocupacional",
      location: "Sede Central",
    })
    setIsScheduleAppointmentOpen(false)
    toast({
      title: "Cita programada",
      description: `Cita programada correctamente para ${employee ? employee.name : ""}.`,
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
      description: "La cita ha sido cancelada correctamente.",
    })
  }

  // Get employee appointments
  const getEmployeeAppointments = (employeeId) => {
    return appointments.filter((appointment) => appointment.employeeId === employeeId)
  }

  // If user is not logged in or not a company, show loading
  if (!user || user.userType !== "company" || !user.isCompanyAdmin) {
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
            <h1 className="text-2xl font-bold text-gray-900">Panel de Empresa</h1>
            <p className="text-gray-500">
              Bienvenido, {user.firstName} {user.lastName}
            </p>
            {user.companyName && (
              <p className="text-gray-500">
                <span className="font-medium">Empresa:</span> {user.companyName} |{" "}
                <span className="font-medium">RUC:</span> {user.companyRuc}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddEmployeeOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
            <Button onClick={() => setIsScheduleAppointmentOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Programar Cita
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Empleados</p>
                <h3 className="text-3xl font-bold">{statsData.totalEmployees}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Empleados Activos</p>
                <h3 className="text-3xl font-bold">{statsData.activeEmployees}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Citas Pendientes</p>
                <h3 className="text-3xl font-bold">{statsData.pendingAppointments}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Servicios Disponibles</p>
                <h3 className="text-3xl font-bold">{statsData.totalServices}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Employees */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Empleados Recientes</CardTitle>
                  <CardDescription>Últimos empleados agregados a la empresa</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsAddEmployeeOpen(true)}>
                  Agregar Empleado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-medium text-blue-600">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={employee.status === "active" ? "success" : "secondary"}>
                        {employee.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(employee)}>
                        Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Citas</CardTitle>
              <CardDescription>Citas programadas para los próximos días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments
                  .filter((a) => a.status === "scheduled")
                  .slice(0, 3)
                  .map((appointment) => (
                    <div key={appointment.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{appointment.employeeName}</p>
                        <Badge variant="outline">{appointment.type.split(" ")[0]}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  ))}
                {appointments.filter((a) => a.status === "scheduled").length === 0 && (
                  <div className="text-center py-6 text-gray-500">No hay citas programadas</div>
                )}
              </div>
              {appointments.filter((a) => a.status === "scheduled").length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => document.getElementById("appointments-tab").click()}
                >
                  Ver Todas las Citas
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="employees" id="employees-tab">
              Empleados
            </TabsTrigger>
            <TabsTrigger value="appointments" id="appointments-tab">
              Citas
            </TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Lista de Empleados</CardTitle>
                    <CardDescription>Gestiona la información de tus empleados</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar empleados..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => setIsAddEmployeeOpen(true)}>
                      <Users className="mr-2 h-4 w-4" />
                      Nuevo Empleado
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Nombre</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Cargo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Departamento</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <tr key={employee.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{employee.id}</td>
                            <td className="py-3 px-4">{employee.name}</td>
                            <td className="py-3 px-4">{employee.position}</td>
                            <td className="py-3 px-4">{employee.department}</td>
                            <td className="py-3 px-4">
                              <Badge variant={employee.status === "active" ? "success" : "secondary"}>
                                {employee.status === "active" ? "Activo" : "Inactivo"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                                Ver Detalles
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            No se encontraron empleados
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
                    <CardTitle>Citas Programadas</CardTitle>
                    <CardDescription>Gestiona las citas de tus empleados</CardDescription>
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
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Empleado</th>
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
                            <td className="py-3 px-4">{appointment.employeeName}</td>
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
                          <td colSpan={7} className="py-6 text-center text-gray-500">
                            No hay citas programadas
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
                    <CardDescription>Explora nuestros servicios para empresas</CardDescription>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar servicios..." className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <Badge variant="outline">{service.category}</Badge>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-2">
                        <p className="font-bold">S/ {service.price.toFixed(2)}</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Solicitud enviada",
                              description: `Se ha enviado una solicitud para el servicio ${service.name}.`,
                            })
                          }}
                        >
                          Solicitar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Employee Details Dialog */}
      <Dialog open={selectedEmployee !== null} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalles del Empleado</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Información Personal</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium">{selectedEmployee.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nombre:</span>
                      <span className="font-medium">{selectedEmployee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cargo:</span>
                      <span className="font-medium">{selectedEmployee.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Departamento:</span>
                      <span className="font-medium">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estado:</span>
                      <Badge variant={selectedEmployee.status === "active" ? "success" : "secondary"}>
                        {selectedEmployee.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Información de Contacto</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Teléfono:</span>
                      <span className="font-medium">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">Nota:</p>
                <p className="text-sm text-blue-700">
                  Los empleados registrados aparecerán en el sistema como "Inscritos" y podrán ser gestionados desde
                  este panel.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("¿Está seguro que desea eliminar este empleado? Esta acción no se puede deshacer.")) {
                      handleDeleteEmployee(selectedEmployee.id)
                    }
                  }}
                >
                  Eliminar empleado
                </Button>
                <Button
                  variant={selectedEmployee.status === "active" ? "outline" : "default"}
                  onClick={() => {
                    handleUpdateEmployee(selectedEmployee.id, {
                      status: selectedEmployee.status === "active" ? "inactive" : "active",
                    })
                  }}
                >
                  {selectedEmployee.status === "active" ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedEmployee(null)
                    setAppointmentFormData({
                      ...appointmentFormData,
                      employeeId: selectedEmployee.id,
                    })
                    setIsScheduleAppointmentOpen(true)
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Programar Cita
                </Button>
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
                  <p className="text-sm text-gray-500">Empleado: {selectedAppointment.employeeName}</p>
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

      {/* Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
            <DialogDescription>Ingresa la información del nuevo empleado</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={employeeFormData.name}
                  onChange={handleEmployeeFormChange}
                  placeholder="Nombre completo del empleado"
                />
              </div>
              <div>
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  name="position"
                  value={employeeFormData.position}
                  onChange={handleEmployeeFormChange}
                  placeholder="Cargo del empleado"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  name="department"
                  value={employeeFormData.department}
                  onChange={handleEmployeeFormChange}
                  placeholder="Departamento del empleado"
                />
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={employeeFormData.email}
                  onChange={handleEmployeeFormChange}
                  placeholder="correo@empresa.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={employeeFormData.phone}
                onChange={handleEmployeeFormChange}
                placeholder="999-999-999"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEmployee}>Agregar Empleado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Appointment Dialog */}
      <Dialog open={isScheduleAppointmentOpen} onOpenChange={setIsScheduleAppointmentOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Programar Nueva Cita</DialogTitle>
            <DialogDescription>Selecciona el empleado y la fecha para la cita</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employeeId">Empleado</Label>
              <select
                id="employeeId"
                name="employeeId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={appointmentFormData.employeeId}
                onChange={handleAppointmentFormChange}
              >
                <option value="">Seleccionar empleado</option>
                {employees
                  .filter((e) => e.status === "active")
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
              </select>
            </div>
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
                <option value="Examen médico ocupacional">Examen médico ocupacional</option>
                <option value="Evaluación psicológica">Evaluación psicológica</option>
                <option value="Audiometría">Audiometría</option>
                <option value="Espirometría">Espirometría</option>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleAppointmentOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleScheduleAppointment}
              disabled={!appointmentFormData.employeeId || !appointmentFormData.date || !appointmentFormData.time}
            >
              Programar Cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

