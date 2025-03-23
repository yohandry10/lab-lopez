"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Download,
  Mail,
  ChevronRight,
  Search,
  Building,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Stethoscope,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Tipo para los usuarios almacenados
type StoredUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  userType: string
  patientCode?: string
}

// Tipo para empleados
type Employee = {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  status: "active" | "inactive"
  join_date: string
  company_id: string
}

// Tipo para resultados de exámenes
type ExamResult = {
  id: string
  patient_code: string
  order_number: string
  patient_name: string
  date: string
  status: "completed" | "pending"
  results: Array<{
    name: string
    value: string
    reference: string
    status: "normal" | "high" | "low"
  }>
}

// Datos de ejemplo para simular resultados
const mockResults = [
  {
    id: "exam-001",
    patient_code: "ROE-12345-6789",
    order_number: "ORD-001",
    patient_name: "Juan Pérez",
    date: "2023-03-15",
    status: "completed" as const,
    results: [
      { name: "Hemoglobina", value: "14.5 g/dL", reference: "13.5 - 17.5 g/dL", status: "normal" as const },
      { name: "Glucosa", value: "95 mg/dL", reference: "70 - 100 mg/dL", status: "normal" as const },
      { name: "Colesterol total", value: "210 mg/dL", reference: "< 200 mg/dL", status: "high" as const },
    ],
  },
  {
    id: "exam-002",
    patient_code: "ROE-54321-9876",
    order_number: "ORD-002",
    patient_name: "María García",
    date: "2023-03-20",
    status: "completed" as const,
    results: [
      { name: "Hemoglobina", value: "12.8 g/dL", reference: "12.0 - 16.0 g/dL", status: "normal" as const },
      { name: "Glucosa", value: "110 mg/dL", reference: "70 - 100 mg/dL", status: "high" as const },
      { name: "Colesterol total", value: "185 mg/dL", reference: "< 200 mg/dL", status: "normal" as const },
    ],
  },
  {
    id: "exam-003",
    patient_code: "ROE-67890-1234",
    order_number: "ORD-003",
    patient_name: "Carlos Rodríguez",
    date: "2023-03-25",
    status: "pending" as const,
    results: [],
  },
]

// Datos de ejemplo para médicos
const mockDoctorPatients = [
  {
    id: "patient-001",
    name: "Juan Pérez",
    patientCode: "ROE-12345-6789",
    lastResult: "2023-03-15",
    status: "completed",
  },
  {
    id: "patient-002",
    name: "María García",
    patientCode: "ROE-54321-9876",
    lastResult: "2023-03-20",
    status: "completed",
  },
  {
    id: "patient-003",
    name: "Carlos Rodríguez",
    patientCode: "ROE-67890-1234",
    lastResult: "2023-03-25",
    status: "pending",
  },
  {
    id: "patient-004",
    name: "Ana López",
    patientCode: "ROE-11223-3445",
    lastResult: "2023-03-22",
    status: "completed",
  },
]

// Datos de ejemplo para empresas
const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "Roberto Gómez",
    position: "Gerente de Recursos Humanos",
    department: "Recursos Humanos",
    email: "roberto.gomez@empresa.com",
    phone: "999-888-777",
    status: "active",
    join_date: "2023-01-15",
    company_id: "company-001",
  },
  {
    id: "emp-002",
    name: "Laura Torres",
    position: "Analista Financiero",
    department: "Finanzas",
    email: "laura.torres@empresa.com",
    phone: "999-777-888",
    status: "active",
    join_date: "2023-01-20",
    company_id: "company-001",
  },
  {
    id: "emp-003",
    name: "Miguel Sánchez",
    position: "Supervisor de Operaciones",
    department: "Operaciones",
    email: "miguel.sanchez@empresa.com",
    phone: "999-666-555",
    status: "inactive",
    join_date: "2023-01-10",
    company_id: "company-001",
  },
  {
    id: "emp-004",
    name: "Sofía Ramírez",
    position: "Especialista en Marketing",
    department: "Marketing",
    email: "sofia.ramirez@empresa.com",
    phone: "999-555-444",
    status: "active",
    join_date: "2023-02-05",
    company_id: "company-001",
  },
]

// Funciones simuladas para la gestión de empleados
const getEmployees = async (companyId: string): Promise<Employee[]> => {
  // Simular una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmployees.filter((emp) => emp.company_id === companyId))
    }, 500)
  })
}

const createEmployee = async (employeeData: Omit<Employee, "id">): Promise<Employee> => {
  // Simular una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmployee: Employee = {
        ...employeeData,
        id: `emp-${Date.now()}`,
      }
      resolve(newEmployee)
    }, 500)
  })
}

const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee | null> => {
  // Simular una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      const employee = mockEmployees.find((emp) => emp.id === id)
      if (!employee) {
        resolve(null)
        return
      }

      const updatedEmployee: Employee = {
        ...employee,
        ...updates,
      }
      resolve(updatedEmployee)
    }, 500)
  })
}

const deleteEmployee = async (id: string): Promise<boolean> => {
  // Simular una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

export default function ResultadosPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, login, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<ExamResult | null>(null)
  const [searchError, setSearchError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"patient" | "doctor" | "company" | null>(null)
  const [step, setStep] = useState<"select-type" | "login" | "search" | "results">("select-type")
  const [registeredUsers, setRegisteredUsers] = useState<StoredUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para empleados
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
  })

  // Formulario de búsqueda por código
  const [codeForm, setCodeForm] = useState({
    patientCode: "",
    orderNumber: "",
  })

  // Formulario de inicio de sesión
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  })

  // Referencia para controlar si ya se cargaron los empleados
  const employeesLoaded = useRef(false)

  // Verificar parámetros de URL para establecer el tipo de usuario
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "patient" || type === "doctor" || type === "company") {
      setUserType(type)
      setStep("login")
    }
  }, [searchParams])

  // Cargar usuario actual y usuarios registrados al iniciar
  useEffect(() => {
    // Verificar si hay un usuario con sesión iniciada
    if (user) {
      setUserType(user.userType as any)
      setStep("search")

      // Si el usuario es un paciente, prellenar el código de paciente
      if (user.userType === "patient" && user.patientCode) {
        setCodeForm((prev) => ({ ...prev, patientCode: user.patientCode }))
      }
    }

    // Cargar usuarios registrados
    const storedUsers = localStorage.getItem("roe_users")
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers))
    } else {
      // Si no hay usuarios, agregar el usuario demo
      const demoUser: StoredUser = {
        id: "demo-user",
        firstName: "Usuario",
        lastName: "Demo",
        email: "demo@roe.com",
        username: "demo",
        password: "password123",
        userType: "patient",
        patientCode: "ROE-12345-6789",
      }
      localStorage.setItem("roe_users", JSON.stringify([demoUser]))
      setRegisteredUsers([demoUser])
    }
  }, [user])

  // Cargar empleados cuando el usuario es una empresa
  useEffect(() => {
    const loadEmployees = async () => {
      if (user && user.userType === "company" && !employeesLoaded.current) {
        setIsLoading(true)
        try {
          const data = await getEmployees(user.id)
          if (data && data.length > 0) {
            setEmployees(data)
          } else {
            // Si no hay datos en la base de datos, usar los datos de ejemplo
            setEmployees(mockEmployees)
          }
          employeesLoaded.current = true
        } catch (error) {
          console.error("Error al cargar empleados:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar los empleados. Se usarán datos de ejemplo.",
            variant: "destructive",
          })
          setEmployees(mockEmployees)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadEmployees()
  }, [user, toast])

  // Filtrar empleados basados en el término de búsqueda
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCodeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCodeForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserTypeSelect = (type: "patient" | "doctor" | "company") => {
    setUserType(type)
    setStep("login")
  }

  const handleCodeSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSearchError("")
    setSearchResult(null)

    // Validar campos
    if (!codeForm.patientCode || !codeForm.orderNumber) {
      setSearchError("Por favor, ingresa el código de paciente y número de orden")
      setIsLoading(false)
      return
    }

    try {
      // Simular búsqueda en la base de datos con datos de ejemplo
      const result = mockResults.find(
        (r) => r.patient_code === codeForm.patientCode && r.order_number === codeForm.orderNumber,
      )

      if (result) {
        setSearchResult(result)
        setStep("results")
      } else {
        setSearchError("No se encontraron resultados con los datos proporcionados")
        toast({
          variant: "destructive",
          title: "No se encontraron resultados",
          description: "Verifica el código de paciente y número de orden ingresados.",
        })
      }
    } catch (error) {
      console.error("Error al buscar resultados:", error)
      setSearchError("Ocurrió un error al buscar los resultados. Intenta nuevamente.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al buscar los resultados. Intenta nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSearchError("")

    // Validar campos
    if (!loginForm.identifier || !loginForm.password) {
      setSearchError("Por favor, ingresa tu usuario o correo electrónico y contraseña")
      setIsLoading(false)
      return
    }

    try {
      const success = await login(loginForm.identifier, loginForm.password)

      if (success) {
        setStep("search")
      } else {
        setSearchError("Credenciales inválidas. Por favor, verifica tu usuario y contraseña.")
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setSearchError("Ocurrió un error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Funciones para gestionar empleados
  const handleEmployeeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmployeeFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEmployee = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const newEmployeeData = {
        company_id: user.id,
        name: employeeFormData.name,
        position: employeeFormData.position,
        department: employeeFormData.department,
        email: employeeFormData.email,
        phone: employeeFormData.phone,
        status: "active" as const,
        join_date: new Date().toISOString().split("T")[0],
      }

      const newEmployee = await createEmployee(newEmployeeData)

      if (newEmployee) {
        setEmployees([...employees, newEmployee])
        toast({
          title: "Empleado agregado",
          description: `${newEmployee.name} ha sido agregado correctamente.`,
        })
      } else {
        // Si hay un error en la base de datos, crear un ID local
        const localEmployee: Employee = {
          id: `emp-${String(employees.length + 1).padStart(3, "0")}`,
          name: employeeFormData.name,
          position: employeeFormData.position,
          department: employeeFormData.department,
          email: employeeFormData.email,
          phone: employeeFormData.phone,
          status: "active",
          join_date: new Date().toISOString().split("T")[0],
          company_id: user.id,
        }

        setEmployees([...employees, localEmployee])
        toast({
          title: "Empleado agregado localmente",
          description: `${localEmployee.name} ha sido agregado localmente. Los cambios no se han guardado en la base de datos.`,
        })
      }

      setEmployeeFormData({
        name: "",
        position: "",
        department: "",
        email: "",
        phone: "",
      })
      setIsAddEmployeeOpen(false)
    } catch (error) {
      console.error("Error al agregar empleado:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el empleado. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return

    setIsLoading(true)
    try {
      const updates = {
        name: employeeFormData.name,
        position: employeeFormData.position,
        department: employeeFormData.department,
        email: employeeFormData.email,
        phone: employeeFormData.phone,
      }

      const updatedEmployee = await updateEmployee(selectedEmployee.id, updates)

      if (updatedEmployee) {
        const updatedEmployees = employees.map((emp) => (emp.id === selectedEmployee.id ? updatedEmployee : emp))
        setEmployees(updatedEmployees)
        toast({
          title: "Empleado actualizado",
          description: `${updatedEmployee.name} ha sido actualizado correctamente.`,
        })
      } else {
        // Si hay un error en la base de datos, actualizar localmente
        const updatedEmployees = employees.map((emp) =>
          emp.id === selectedEmployee.id
            ? {
                ...emp,
                name: employeeFormData.name,
                position: employeeFormData.position,
                department: employeeFormData.department,
                email: employeeFormData.email,
                phone: employeeFormData.phone,
              }
            : emp,
        )

        setEmployees(updatedEmployees)
        toast({
          title: "Empleado actualizado localmente",
          description: `${employeeFormData.name} ha sido actualizado localmente. Los cambios no se han guardado en la base de datos.`,
        })
      }

      setIsEditEmployeeOpen(false)
      setSelectedEmployee(null)
    } catch (error) {
      console.error("Error al actualizar empleado:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el empleado. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return

    setIsLoading(true)
    try {
      const success = await deleteEmployee(selectedEmployee.id)

      if (success) {
        const updatedEmployees = employees.filter((emp) => emp.id !== selectedEmployee.id)
        setEmployees(updatedEmployees)
        toast({
          title: "Empleado eliminado",
          description: `El empleado ha sido eliminado correctamente.`,
        })
      } else {
        // Si hay un error en la base de datos, eliminar localmente
        const updatedEmployees = employees.filter((emp) => emp.id !== selectedEmployee.id)
        setEmployees(updatedEmployees)
        toast({
          title: "Empleado eliminado localmente",
          description: `El empleado ha sido eliminado localmente. Los cambios no se han guardado en la base de datos.`,
        })
      }

      setIsDeleteConfirmOpen(false)
      setSelectedEmployee(null)
    } catch (error) {
      console.error("Error al eliminar empleado:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el empleado. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleEmployeeStatus = async (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (!employee) return

    setIsLoading(true)
    try {
      const newStatus = employee.status === "active" ? "inactive" : "active"
      const updatedEmployee = await updateEmployee(employeeId, { status: newStatus as "active" | "inactive" })

      if (updatedEmployee) {
        const updatedEmployees = employees.map((emp) =>
          emp.id === employeeId ? { ...emp, status: newStatus as "active" | "inactive" } : emp,
        )

        setEmployees(updatedEmployees)
        toast({
          title: "Estado actualizado",
          description: `El estado del empleado ha sido actualizado a ${newStatus === "active" ? "activo" : "inactivo"}.`,
        })
      } else {
        // Si hay un error en la base de datos, actualizar localmente
        const updatedEmployees = employees.map((emp) =>
          emp.id === employeeId ? { ...emp, status: newStatus as "active" | "inactive" } : emp,
        )

        setEmployees(updatedEmployees)
        toast({
          title: "Estado actualizado localmente",
          description: `El estado del empleado ha sido actualizado localmente. Los cambios no se han guardado en la base de datos.`,
        })
      }
    } catch (error) {
      console.error("Error al actualizar estado del empleado:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del empleado. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setEmployeeFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
    })
    setIsEditEmployeeOpen(true)
  }

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDeleteConfirmOpen(true)
  }

  // Si está cargando la autenticación, mostrar spinner
  if (authLoading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
          <p className="mt-4 text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  // Contenido específico para empresas
  if (user && user.userType === "company") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Panel de Empresa</h1>
          <p className="text-gray-600">Gestiona la información de tus empleados de forma segura</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-lg font-medium">
                  Bienvenido, {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium">Empresa:</span> {user.companyName} |{" "}
                  <span className="font-medium">RUC:</span> {user.companyRuc}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                <Badge variant="outline">Empresa</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid grid-cols-1 mb-6">
            <TabsTrigger value="employees">Gestión de Empleados</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold">Lista de Empleados</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar empleado..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => setIsAddEmployeeOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Empleado
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg border shadow">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Nombre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Cargo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Departamento</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{employee.name}</td>
                          <td className="py-3 px-4">{employee.position}</td>
                          <td className="py-3 px-4">{employee.department}</td>
                          <td className="py-3 px-4">{employee.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={employee.status === "active" ? "success" : "secondary"}>
                              {employee.status === "active" ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleEmployeeStatus(employee.id)}
                              >
                                {employee.status === "active" ? (
                                  <X className="h-4 w-4 mr-1 text-red-500" />
                                ) : (
                                  <Check className="h-4 w-4 mr-1 text-green-500" />
                                )}
                                {employee.status === "active" ? "Desactivar" : "Activar"}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(employee)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(employee)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {employees.slice(0, 3).map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
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
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Inscrito
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => openEditDialog(employee)}
                      >
                        Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Diálogo para agregar empleado */}
        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo empleado. Haz clic en guardar cuando termines.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nombre completo"
                  value={employeeFormData.name}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Cargo en la empresa"
                  value={employeeFormData.position}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Departamento"
                  value={employeeFormData.department}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={employeeFormData.email}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="999-999-999"
                  value={employeeFormData.phone}
                  onChange={handleEmployeeFormChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEmployee} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar empleado */}
        <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Empleado</DialogTitle>
              <DialogDescription>
                Modifica los datos del empleado. Haz clic en guardar cuando termines.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre completo</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Nombre completo"
                  value={employeeFormData.name}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Cargo</Label>
                <Input
                  id="edit-position"
                  name="position"
                  placeholder="Cargo en la empresa"
                  value={employeeFormData.position}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Departamento</Label>
                <Input
                  id="edit-department"
                  name="department"
                  placeholder="Departamento"
                  value={employeeFormData.department}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Correo electrónico</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={employeeFormData.email}
                  onChange={handleEmployeeFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  placeholder="999-999-999"
                  value={employeeFormData.phone}
                  onChange={handleEmployeeFormChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditEmployee} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación para eliminar */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar a este empleado? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedEmployee && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="font-medium">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.position} - {selectedEmployee.department}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteEmployee} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col" id="top">
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">Consulta tus resultados</h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl">Revisa el estado y detalle de tus análisis</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {step === "select-type" && (
              <Card className="border-none shadow-lg">
                <CardHeader className="text-center bg-blue-50 rounded-t-lg">
                  <CardTitle className="text-2xl text-blue-900">¿Cómo deseas acceder?</CardTitle>
                  <CardDescription>Selecciona tu tipo de usuario para continuar</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 pb-6">
                  <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                    <p className="text-lg text-center text-blue-900 font-medium mb-2">Consulta tus resultados</p>
                    <p className="text-sm text-center text-gray-600 mb-4">Revisa el estado y detalle de tus análisis</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleUserTypeSelect("patient")}
                          className="w-24 h-24 rounded-full bg-[#1E5FAD] flex items-center justify-center hover:bg-blue-800 transition-colors mb-4"
                        >
                          <User className="h-12 w-12 text-white" />
                        </button>
                        <h3 className="font-medium text-xl mb-1">Pacientes</h3>
                        <p className="text-sm text-gray-500 text-center">Accede a tus resultados personales</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleUserTypeSelect("doctor")}
                          className="w-24 h-24 rounded-full bg-[#1E5FAD] flex items-center justify-center hover:bg-blue-800 transition-colors mb-4"
                        >
                          <Stethoscope className="h-12 w-12 text-white" />
                        </button>
                        <h3 className="font-medium text-xl mb-1">Médicos</h3>
                        <p className="text-sm text-gray-500 text-center">Consulta resultados de tus pacientes</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleUserTypeSelect("company")}
                          className="w-24 h-24 rounded-full bg-[#1E5FAD] flex items-center justify-center hover:bg-blue-800 transition-colors mb-4"
                        >
                          <Building className="h-12 w-12 text-white" />
                        </button>
                        <h3 className="font-medium text-xl mb-1">Empresas</h3>
                        <p className="text-sm text-gray-500 text-center">Accede a resultados de tus colaboradores</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "login" && (
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-blue-50 rounded-t-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setStep("select-type")}>
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </Button>
                    <CardTitle>
                      {userType === "patient"
                        ? "Acceso para pacientes"
                        : userType === "doctor"
                          ? "Acceso para médicos"
                          : "Acceso para empresas"}
                    </CardTitle>
                  </div>
                  <CardDescription>Inicia sesión para acceder a los resultados</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <Label htmlFor="identifier">Usuario o Email</Label>
                      <Input
                        id="identifier"
                        name="identifier"
                        placeholder="Ingresa tu usuario o email"
                        value={loginForm.identifier}
                        onChange={handleLoginFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                        <Link href="/recuperar-contrasena" className="text-sm text-blue-700 hover:text-blue-800">
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={handleLoginFormChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar sesión"
                      )}
                    </Button>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/registro" className="text-blue-700 hover:text-blue-800">
                          Regístrate
                        </Link>
                      </p>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-800 font-medium">Credenciales de demostración:</p>
                      <p className="text-xs text-blue-700 mt-1">Usuario: demo</p>
                      <p className="text-xs text-blue-700">Email: demo@roe.com</p>
                      <p className="text-xs text-blue-700">Contraseña: password123</p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "search" && user && (
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-blue-50 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Bienvenido, {user.firstName}</CardTitle>
                      <CardDescription className="mt-1">
                        {user.userType === "patient" ? "Paciente" : user.userType === "doctor" ? "Médico" : "Empresa"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {user.userType === "patient" ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                        <p className="text-sm text-blue-800 font-medium">Tu código de paciente:</p>
                        <p className="text-lg font-bold text-blue-900">{user.patientCode}</p>
                      </div>

                      <form className="space-y-4" onSubmit={handleCodeSearch}>
                        <div className="space-y-2">
                          <Label htmlFor="order-number">Número de orden</Label>
                          <Input
                            id="order-number"
                            name="orderNumber"
                            placeholder="Ej: ORD-001"
                            value={codeForm.orderNumber}
                            onChange={handleCodeFormChange}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Consultando...
                            </>
                          ) : (
                            "Consultar resultados"
                          )}
                        </Button>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-blue-800 font-medium">Datos de demostración:</p>
                          <p className="text-xs text-blue-700 mt-1">Número de orden: ORD-001</p>
                        </div>
                      </form>
                    </div>
                  ) : user.userType === "doctor" ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-blue-800 font-medium">Panel de médico</p>
                          <Button
                            size="sm"
                            onClick={() => router.push("/medicos/dashboard")}
                            className="bg-blue-700 hover:bg-blue-800"
                          >
                            Ir al panel completo
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Pacientes recientes</h3>
                        <div className="grid gap-4">
                          {mockDoctorPatients.slice(0, 3).map((patient) => (
                            <Card key={patient.id} className="overflow-hidden border-gray-200">
                              <CardContent className="p-0">
                                <div className="flex items-center justify-between p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{patient.name}</p>
                                      <p className="text-sm text-gray-500">{patient.patientCode}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-right text-sm">
                                      <p className="text-gray-500">Último resultado:</p>
                                      <p>{patient.lastResult}</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-blue-700 hover:bg-blue-800"
                                      onClick={() => router.push("/medicos/dashboard")}
                                    >
                                      Ver
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="pt-4 flex justify-center">
                          <Button
                            onClick={() => router.push("/medicos/dashboard")}
                            className="w-full md:w-auto bg-blue-700 hover:bg-blue-800"
                          >
                            Acceder al panel completo de médico
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {searchError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{searchError}</p>
              </div>
            )}

            {step === "results" && searchResult && (
              <div className="mt-6">
                <Card className="border-none shadow-lg overflow-hidden">
                  <CardHeader className="bg-blue-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{searchResult.patient_name}</CardTitle>
                        <CardDescription className="mt-1">
                          Fecha: {new Date(searchResult.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-white px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-700" />
                          <span className="text-sm font-medium text-blue-700">{searchResult.order_number}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {searchResult.status === "pending" ? (
                      <div className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                          <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Resultados en proceso</h3>
                        <p className="text-gray-500">
                          Tus análisis están siendo procesados. Los resultados estarán disponibles pronto.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Análisis</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Resultado</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                  Valores de referencia
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {searchResult.results.map((result, i) => (
                                <tr key={i} className="bg-white">
                                  <td className="px-4 py-3 text-sm text-gray-900">{result.name}</td>
                                  <td className="px-4 py-3 text-sm font-medium">{result.value}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{result.reference}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        result.status === "normal"
                                          ? "bg-green-100 text-green-800"
                                          : result.status === "high"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {result.status === "normal"
                                        ? "Normal"
                                        : result.status === "high"
                                          ? "Elevado"
                                          : "Bajo"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Descargar PDF
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Enviar por correo
                            </Button>
                          </div>
                          <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => setStep("search")}>
                            Volver a consulta
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

