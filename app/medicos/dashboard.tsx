"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Calendar,
  User,
  Download,
  Mail,
  AlertCircle,
  ChevronDown,
  CheckCircle,
  FileUp,
  Printer,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Mock data for patients
const mockPatients = [
  {
    id: "LOP-2024-001",
    name: "Juan Pérez",
    age: 45,
    gender: "M",
    consultationReason: "Dolor de cabeza recurrente",
    lastVisit: "2024-03-10",
    status: "active",
    email: "juan.perez@example.com",
    phone: "999-888-777",
    address: "Av. Arequipa 123, Lima",
    bloodType: "O+",
    allergies: ["Penicilina", "Aspirina"],
    chronicConditions: ["Hipertensión"],
    paymentStatus: "paid",
    insuranceProvider: "Rimac",
    insuranceNumber: "RIM-123456",
    createdBy: "Dr. Carlos Mendoza",
    createdAt: "2024-01-15",
  },
  {
    id: "LOP-2024-002",
    name: "María García",
    age: 32,
    gender: "F",
    consultationReason: "Control de diabetes",
    lastVisit: "2024-03-15",
    status: "active",
    email: "maria.garcia@example.com",
    phone: "999-777-888",
    address: "Jr. Huallaga 456, Lima",
    bloodType: "A+",
    allergies: [],
    chronicConditions: ["Diabetes tipo 2"],
    paymentStatus: "paid",
    insuranceProvider: "Pacífico",
    insuranceNumber: "PAC-789012",
    createdBy: "Dra. María Sánchez",
    createdAt: "2024-01-20",
  },
  {
    id: "LOP-2024-003",
    name: "Carlos Rodríguez",
    age: 58,
    gender: "M",
    consultationReason: "Dolor articular",
    lastVisit: "2024-02-28",
    status: "active",
    email: "carlos.rodriguez@example.com",
    phone: "999-666-555",
    address: "Av. La Marina 789, Lima",
    bloodType: "B-",
    allergies: ["Sulfas"],
    chronicConditions: ["Artritis", "Hipertensión"],
    paymentStatus: "pending",
    insuranceProvider: "",
    insuranceNumber: "",
    createdBy: "Dr. Jorge Ramírez",
    createdAt: "2024-02-05",
  },
  {
    id: "LOP-2024-004",
    name: "Ana López",
    age: 27,
    gender: "F",
    consultationReason: "Migraña",
    lastVisit: "2024-03-05",
    status: "active",
    email: "ana.lopez@example.com",
    phone: "999-555-444",
    address: "Av. Brasil 321, Lima",
    bloodType: "AB+",
    allergies: ["Látex"],
    chronicConditions: [],
    paymentStatus: "paid",
    insuranceProvider: "Mapfre",
    insuranceNumber: "MAP-345678",
    createdBy: "Dra. Ana Torres",
    createdAt: "2024-02-10",
  },
  {
    id: "LOP-2024-005",
    name: "Roberto Gómez",
    age: 41,
    gender: "M",
    consultationReason: "Control de asma",
    lastVisit: "2024-02-20",
    status: "inactive",
    email: "roberto.gomez@example.com",
    phone: "999-444-333",
    address: "Jr. Cusco 654, Lima",
    bloodType: "O-",
    allergies: [],
    chronicConditions: ["Asma"],
    paymentStatus: "paid",
    insuranceProvider: "Rimac",
    insuranceNumber: "RIM-901234",
    createdBy: "Dr. Roberto Gómez",
    createdAt: "2024-02-15",
  },
]

// Mock data for exams
const mockExams = [
  {
    id: "E001",
    patientId: "LOP-2024-001",
    patientName: "Juan Pérez",
    examType: "Hemograma completo",
    date: "2024-03-10",
    status: "completed",
    results: [
      { name: "Hemoglobina", value: "14.5 g/dL", reference: "13.5 - 17.5 g/dL", status: "normal" },
      { name: "Leucocitos", value: "7.2 x10^9/L", reference: "4.5 - 11.0 x10^9/L", status: "normal" },
      { name: "Plaquetas", value: "250 x10^9/L", reference: "150 - 450 x10^9/L", status: "normal" },
    ],
    notes: "Resultados dentro de los rangos normales.",
    doctor: "Dr. Carlos Mendoza",
  },
  {
    id: "E002",
    patientId: "LOP-2024-001",
    patientName: "Juan Pérez",
    examType: "Perfil lipídico",
    date: "2024-03-10",
    status: "completed",
    results: [
      { name: "Colesterol total", value: "210 mg/dL", reference: "< 200 mg/dL", status: "high" },
      { name: "Colesterol HDL", value: "45 mg/dL", reference: "> 40 mg/dL", status: "normal" },
      { name: "Colesterol LDL", value: "130 mg/dL", reference: "< 130 mg/dL", status: "normal" },
      { name: "Triglicéridos", value: "180 mg/dL", reference: "< 150 mg/dL", status: "high" },
    ],
    notes: "Colesterol total y triglicéridos ligeramente elevados. Se recomienda dieta baja en grasas saturadas.",
    doctor: "Dr. Carlos Mendoza",
  },
  {
    id: "E003",
    patientId: "LOP-2024-002",
    patientName: "María García",
    examType: "Glucosa en ayunas",
    date: "2024-03-15",
    status: "completed",
    results: [{ name: "Glucosa", value: "110 mg/dL", reference: "70 - 100 mg/dL", status: "high" }],
    notes: "Glucosa ligeramente elevada. Continuar con medicación actual y control en 3 meses.",
    doctor: "Dra. María Sánchez",
  },
  {
    id: "E004",
    patientId: "LOP-2024-003",
    patientName: "Carlos Rodríguez",
    examType: "Perfil renal",
    date: "2024-02-28",
    status: "completed",
    results: [
      { name: "Creatinina", value: "1.1 mg/dL", reference: "0.7 - 1.3 mg/dL", status: "normal" },
      { name: "Urea", value: "35 mg/dL", reference: "15 - 40 mg/dL", status: "normal" },
      { name: "Ácido úrico", value: "6.5 mg/dL", reference: "3.5 - 7.2 mg/dL", status: "normal" },
    ],
    notes: "Función renal normal.",
    doctor: "Dr. Jorge Ramírez",
  },
  {
    id: "E005",
    patientId: "LOP-2024-004",
    patientName: "Ana López",
    examType: "Perfil tiroideo",
    date: "2024-03-05",
    status: "completed",
    results: [
      { name: "TSH", value: "2.5 mUI/L", reference: "0.4 - 4.0 mUI/L", status: "normal" },
      { name: "T4 libre", value: "1.2 ng/dL", reference: "0.8 - 1.8 ng/dL", status: "normal" },
      { name: "T3 total", value: "120 ng/dL", reference: "80 - 200 ng/dL", status: "normal" },
    ],
    notes: "Función tiroidea normal.",
    doctor: "Dra. Ana Torres",
  },
  {
    id: "E006",
    patientId: "LOP-2024-005",
    patientName: "Roberto Gómez",
    examType: "Espirometría",
    date: "2024-02-20",
    status: "completed",
    results: [
      { name: "FEV1", value: "75%", reference: "> 80%", status: "low" },
      { name: "FVC", value: "82%", reference: "> 80%", status: "normal" },
      { name: "FEV1/FVC", value: "0.72", reference: "> 0.7", status: "normal" },
    ],
    notes: "Ligera obstrucción de vías aéreas. Continuar con tratamiento para asma.",
    doctor: "Dr. Roberto Gómez",
  },
  {
    id: "E007",
    patientId: "LOP-2024-001",
    patientName: "Juan Pérez",
    examType: "Electrocardiograma",
    date: "2024-03-20",
    status: "pending",
    results: [],
    notes: "",
    doctor: "Dr. Carlos Mendoza",
  },
]

// Mock data for diagnoses
const mockDiagnoses = [
  {
    id: "D001",
    patientId: "LOP-2024-001",
    patientName: "Juan Pérez",
    date: "2024-03-10",
    diagnosis: "Hipertensión arterial controlada",
    notes: "Mantener medicación actual. Control en 3 meses.",
    doctor: "Dr. Carlos Mendoza",
    relatedExams: ["E001", "E002"],
    treatment: "Losartán 50mg 1 vez al día",
    followUp: "2024-06-10",
  },
  {
    id: "D002",
    patientId: "LOP-2024-002",
    patientName: "María García",
    date: "2024-03-15",
    diagnosis: "Diabetes mellitus tipo 2",
    notes: "Ajustar dosis de metformina. Control en 1 mes.",
    doctor: "Dra. María Sánchez",
    relatedExams: ["E003"],
    treatment: "Metformina 850mg 2 veces al día",
    followUp: "2024-04-15",
  },
  {
    id: "D003",
    patientId: "LOP-2024-003",
    patientName: "Carlos Rodríguez",
    date: "2024-02-28",
    diagnosis: "Artritis reumatoide",
    notes: "Continuar con tratamiento actual. Evaluación por reumatología.",
    doctor: "Dr. Jorge Ramírez",
    relatedExams: ["E004"],
    treatment: "Prednisona 5mg 1 vez al día, Metotrexato 15mg semanal",
    followUp: "2024-03-28",
  },
  {
    id: "D004",
    patientId: "LOP-2024-004",
    patientName: "Ana López",
    date: "2024-03-05",
    diagnosis: "Migraña sin aura",
    notes: "Iniciar tratamiento preventivo. Evitar desencadenantes.",
    doctor: "Dra. Ana Torres",
    relatedExams: ["E005"],
    treatment: "Sumatriptán 50mg según necesidad, Propranolol 40mg 1 vez al día",
    followUp: "2024-04-05",
  },
  {
    id: "D005",
    patientId: "LOP-2024-005",
    patientName: "Roberto Gómez",
    date: "2024-02-20",
    diagnosis: "Asma bronquial moderada",
    notes: "Ajustar dosis de inhaladores. Control en 2 meses.",
    doctor: "Dr. Roberto Gómez",
    relatedExams: ["E006"],
    treatment: "Salbutamol inhalador 2 puff cada 6 horas según necesidad, Fluticasona 250mcg 2 puff cada 12 horas",
    followUp: "2024-04-20",
  },
]

// Mock data for appointments
const mockAppointments = [
  {
    id: "A001",
    patientId: "LOP-2024-001",
    patientName: "Juan Pérez",
    date: "2024-04-10",
    time: "09:00",
    status: "scheduled",
    type: "Control",
    notes: "Control de hipertensión",
    doctor: "Dr. Carlos Mendoza",
    location: "Consultorio 101",
    duration: 30,
  },
  {
    id: "A002",
    patientId: "LOP-2024-002",
    patientName: "María García",
    date: "2024-04-15",
    time: "10:30",
    status: "scheduled",
    type: "Control",
    notes: "Control de diabetes",
    doctor: "Dra. María Sánchez",
    location: "Consultorio 102",
    duration: 30,
  },
  {
    id: "A003",
    patientId: "LOP-2024-003",
    patientName: "Carlos Rodríguez",
    date: "2024-04-05",
    time: "11:00",
    status: "scheduled",
    type: "Evaluación",
    notes: "Evaluación de dolor articular",
    doctor: "Dr. Jorge Ramírez",
    location: "Consultorio 103",
    duration: 45,
  },
  {
    id: "A004",
    patientId: "LOP-2024-004",
    patientName: "Ana López",
    date: "2024-03-25",
    time: "15:00",
    status: "completed",
    type: "Control",
    notes: "Control de migraña",
    doctor: "Dra. Ana Torres",
    location: "Consultorio 104",
    duration: 30,
  },
  {
    id: "A005",
    patientId: "LOP-2024-005",
    patientName: "Roberto Gómez",
    date: "2024-03-18",
    time: "16:30",
    status: "cancelled",
    type: "Control",
    notes: "Control de asma",
    doctor: "Dr. Roberto Gómez",
    location: "Consultorio 105",
    duration: 30,
  },
]

// Function to generate a new patient ID
const generatePatientId = (patients) => {
  const currentYear = new Date().getFullYear()
  const yearPrefix = `LOP-${currentYear}-`

  // Find the highest number for the current year
  const existingIds = patients
    .filter((p) => p.id.startsWith(yearPrefix))
    .map((p) => Number.parseInt(p.id.replace(yearPrefix, "")))

  const highestNumber = existingIds.length > 0 ? Math.max(...existingIds) : 0
  const newNumber = highestNumber + 1

  // Format with leading zeros (e.g., 001, 002, etc.)
  return `${yearPrefix}${String(newNumber).padStart(3, "0")}`
}

export default function DoctorDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState(mockPatients)
  const [exams, setExams] = useState(mockExams)
  const [diagnoses, setDiagnoses] = useState(mockDiagnoses)
  const [appointments, setAppointments] = useState(mockAppointments)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedExam, setSelectedExam] = useState(null)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null)
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false)
  const [isAddExamOpen, setIsAddExamOpen] = useState(false)
  const [isAddDiagnosisOpen, setIsAddDiagnosisOpen] = useState(false)
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [patientFormData, setPatientFormData] = useState({
    name: "",
    age: "",
    gender: "",
    consultationReason: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    allergies: "",
    chronicConditions: "",
    paymentStatus: "pending",
    insuranceProvider: "",
    insuranceNumber: "",
  })
  const [examFormData, setExamFormData] = useState({
    patientId: "",
    examType: "",
    date: "",
    notes: "",
  })
  const [diagnosisFormData, setDiagnosisFormData] = useState({
    patientId: "",
    diagnosis: "",
    notes: "",
    treatment: "",
    followUp: "",
    relatedExams: [],
  })
  const [appointmentFormData, setAppointmentFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    type: "",
    notes: "",
    location: "",
    duration: "30",
  })
  const [patientFilter, setPatientFilter] = useState({
    status: "all",
    paymentStatus: "all",
  })
  const [statsData, setStatsData] = useState({
    totalPatients: mockPatients.length,
    activePatients: mockPatients.filter((p) => p.status === "active").length,
    pendingPayments: mockPatients.filter((p) => p.paymentStatus === "pending").length,
    upcomingAppointments: mockAppointments.filter((a) => a.status === "scheduled").length,
  })

  // Check if user is logged in and is a doctor
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.userType !== "doctor") {
      router.push("/")
    }
  }, [user, router])

  // Update stats when data changes
  useEffect(() => {
    setStatsData({
      totalPatients: patients.length,
      activePatients: patients.filter((p) => p.status === "active").length,
      pendingPayments: patients.filter((p) => p.paymentStatus === "pending").length,
      upcomingAppointments: appointments.filter((a) => a.status === "scheduled").length,
    })
  }, [patients, appointments])

  // Filter patients based on search term and filters
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = patientFilter.status === "all" || patient.status === patientFilter.status

    const matchesPayment =
      patientFilter.paymentStatus === "all" || patient.paymentStatus === patientFilter.paymentStatus

    return matchesSearch && matchesStatus && matchesPayment
  })

  // Handle patient form input change
  const handlePatientFormChange = (e) => {
    const { name, value } = e.target
    setPatientFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle exam form input change
  const handleExamFormChange = (e) => {
    const { name, value } = e.target
    setExamFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle diagnosis form input change
  const handleDiagnosisFormChange = (e) => {
    const { name, value } = e.target
    setDiagnosisFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle appointment form input change
  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target
    setAppointmentFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add new patient
  const handleAddPatient = () => {
    const newPatientId = generatePatientId(patients)

    const newPatient = {
      id: newPatientId,
      name: patientFormData.name,
      age: Number.parseInt(patientFormData.age),
      gender: patientFormData.gender,
      consultationReason: patientFormData.consultationReason,
      lastVisit: new Date().toISOString().split("T")[0],
      status: "active",
      email: patientFormData.email,
      phone: patientFormData.phone,
      address: patientFormData.address,
      bloodType: patientFormData.bloodType,
      allergies: patientFormData.allergies ? patientFormData.allergies.split(",").map((item) => item.trim()) : [],
      chronicConditions: patientFormData.chronicConditions
        ? patientFormData.chronicConditions.split(",").map((item) => item.trim())
        : [],
      paymentStatus: patientFormData.paymentStatus,
      insuranceProvider: patientFormData.insuranceProvider,
      insuranceNumber: patientFormData.insuranceNumber,
      createdBy: user ? `${user.firstName} ${user.lastName}` : "Doctor",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setPatients([...patients, newPatient])
    setPatientFormData({
      name: "",
      age: "",
      gender: "",
      consultationReason: "",
      email: "",
      phone: "",
      address: "",
      bloodType: "",
      allergies: "",
      chronicConditions: "",
      paymentStatus: "pending",
      insuranceProvider: "",
      insuranceNumber: "",
    })
    setIsAddPatientOpen(false)
    toast({
      title: "Paciente agregado",
      description: `${newPatient.name} ha sido agregado correctamente con ID ${newPatient.id}.`,
    })
  }

  // Edit patient
  const handleEditPatient = () => {
    const updatedPatients = patients.map((patient) =>
      patient.id === selectedPatient.id
        ? {
            ...patient,
            name: patientFormData.name,
            age: Number.parseInt(patientFormData.age),
            gender: patientFormData.gender,
            consultationReason: patientFormData.consultationReason,
            email: patientFormData.email,
            phone: patientFormData.phone,
            address: patientFormData.address,
            bloodType: patientFormData.bloodType,
            allergies: patientFormData.allergies ? patientFormData.allergies.split(",").map((item) => item.trim()) : [],
            chronicConditions: patientFormData.chronicConditions
              ? patientFormData.chronicConditions.split(",").map((item) => item.trim())
              : [],
            paymentStatus: patientFormData.paymentStatus,
            insuranceProvider: patientFormData.insuranceProvider,
            insuranceNumber: patientFormData.insuranceNumber,
          }
        : patient,
    )

    setPatients(updatedPatients)
    setIsEditPatientOpen(false)
    toast({
      title: "Paciente actualizado",
      description: `${patientFormData.name} ha sido actualizado correctamente.`,
    })
  }

  // Add new exam
  const handleAddExam = () => {
    const patient = patients.find((p) => p.id === examFormData.patientId)
    const newExam = {
      id: `E${String(exams.length + 1).padStart(3, "0")}`,
      patientId: examFormData.patientId,
      patientName: patient ? patient.name : "",
      examType: examFormData.examType,
      date: examFormData.date,
      status: "pending",
      results: [],
      notes: examFormData.notes,
      doctor: user ? `${user.firstName} ${user.lastName}` : "Doctor",
    }

    setExams([...exams, newExam])
    setExamFormData({
      patientId: "",
      examType: "",
      date: "",
      notes: "",
    })
    setIsAddExamOpen(false)
    toast({
      title: "Examen agregado",
      description: `Examen de ${newExam.examType} para ${newExam.patientName} ha sido agregado correctamente.`,
    })
  }

  // Add new diagnosis
  const handleAddDiagnosis = () => {
    const patient = patients.find((p) => p.id === diagnosisFormData.patientId)
    const newDiagnosis = {
      id: `D${String(diagnoses.length + 1).padStart(3, "0")}`,
      patientId: diagnosisFormData.patientId,
      patientName: patient ? patient.name : "",
      date: new Date().toISOString().split("T")[0],
      diagnosis: diagnosisFormData.diagnosis,
      notes: diagnosisFormData.notes,
      treatment: diagnosisFormData.treatment,
      followUp: diagnosisFormData.followUp,
      doctor: user ? `${user.firstName} ${user.lastName}` : "Doctor",
      relatedExams: diagnosisFormData.relatedExams,
    }

    setDiagnoses([...diagnoses, newDiagnosis])
    setDiagnosisFormData({
      patientId: "",
      diagnosis: "",
      notes: "",
      treatment: "",
      followUp: "",
      relatedExams: [],
    })
    setIsAddDiagnosisOpen(false)
    toast({
      title: "Diagnóstico agregado",
      description: `Diagnóstico para ${newDiagnosis.patientName} ha sido agregado correctamente.`,
    })
  }

  // Add new appointment
  const handleAddAppointment = () => {
    const patient = patients.find((p) => p.id === appointmentFormData.patientId)
    const newAppointment = {
      id: `A${String(appointments.length + 1).padStart(3, "0")}`,
      patientId: appointmentFormData.patientId,
      patientName: patient ? patient.name : "",
      date: appointmentFormData.date,
      time: appointmentFormData.time,
      status: "scheduled",
      type: appointmentFormData.type,
      notes: appointmentFormData.notes,
      location: appointmentFormData.location,
      duration: Number.parseInt(appointmentFormData.duration),
      doctor: user ? `${user.firstName} ${user.lastName}` : "Doctor",
    }

    setAppointments([...appointments, newAppointment])
    setAppointmentFormData({
      patientId: "",
      date: "",
      time: "",
      type: "",
      notes: "",
      location: "",
      duration: "30",
    })
    setIsAddAppointmentOpen(false)
    toast({
      title: "Cita agregada",
      description: `Cita para ${newAppointment.patientName} ha sido agregada correctamente.`,
    })
  }

  // Delete patient
  const handleDeletePatient = (patientId) => {
    setPatients(patients.filter((patient) => patient.id !== patientId))
    toast({
      title: "Paciente eliminado",
      description: "El paciente ha sido eliminado correctamente.",
    })
  }

  // Get patient exams
  const getPatientExams = (patientId) => {
    return exams.filter((exam) => exam.patientId === patientId)
  }

  // Get patient diagnoses
  const getPatientDiagnoses = (patientId) => {
    return diagnoses.filter((diagnosis) => diagnosis.patientId === patientId)
  }

  // Get patient appointments
  const getPatientAppointments = (patientId) => {
    return appointments.filter((appointment) => appointment.patientId === patientId)
  }

  // Update appointment status
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
    )

    setAppointments(updatedAppointments)
    toast({
      title: "Estado de cita actualizado",
      description: `La cita ha sido marcada como ${newStatus === "completed" ? "completada" : newStatus === "cancelled" ? "cancelada" : "programada"}.`,
    })
  }

  // Update patient status
  const updatePatientStatus = (patientId, newStatus) => {
    const updatedPatients = patients.map((patient) =>
      patient.id === patientId ? { ...patient, status: newStatus } : patient,
    )

    setPatients(updatedPatients)
    toast({
      title: "Estado de paciente actualizado",
      description: `El paciente ha sido marcado como ${newStatus === "active" ? "activo" : "inactivo"}.`,
    })
  }

  // Update patient payment status
  const updatePatientPaymentStatus = (patientId, newStatus) => {
    const updatedPatients = patients.map((patient) =>
      patient.id === patientId ? { ...patient, paymentStatus: newStatus } : patient,
    )

    setPatients(updatedPatients)
    toast({
      title: "Estado de pago actualizado",
      description: `El estado de pago ha sido actualizado a ${newStatus === "paid" ? "pagado" : "pendiente"}.`,
    })
  }

  // If user is not logged in or not a doctor, show loading
  if (!user || user.userType !== "doctor") {
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
            <h1 className="text-2xl font-bold text-gray-900">Panel de Médico</h1>
            <p className="text-gray-500">
              Bienvenido, {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddPatientOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Button>
            <Button onClick={() => setIsAddAppointmentOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Pacientes</p>
                <h3 className="text-3xl font-bold">{statsData.totalPatients}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pacientes Activos</p>
                <h3 className="text-3xl font-bold">{statsData.activePatients}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pagos Pendientes</p>
                <h3 className="text-3xl font-bold">{statsData.pendingPayments}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Citas Programadas</p>
                <h3 className="text-3xl font-bold">{statsData.upcomingAppointments}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="exams">Exámenes</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnósticos</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Lista de Pacientes</CardTitle>
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar pacientes..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={patientFilter.status}
                        onValueChange={(value) => setPatientFilter({ ...patientFilter, status: value })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="active">Activos</SelectItem>
                          <SelectItem value="inactive">Inactivos</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={patientFilter.paymentStatus}
                        onValueChange={(value) => setPatientFilter({ ...patientFilter, paymentStatus: value })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="paid">Pagado</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() => setPatientFilter({ status: "all", paymentStatus: "all" })}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
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
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Motivo de consulta</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Última Visita</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Pago</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <tr key={patient.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{patient.id}</td>
                            <td className="py-3 px-4">{patient.name}</td>
                            <td className="py-3 px-4">{patient.consultationReason}</td>
                            <td className="py-3 px-4">{patient.lastVisit}</td>
                            <td className="py-3 px-4">
                              <Badge variant={patient.status === "active" ? "success" : "secondary"}>
                                {patient.status === "active" ? "Activo" : "Inactivo"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={patient.paymentStatus === "paid" ? "success" : "outline"}>
                                {patient.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(patient)}>
                                  Ver
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPatient(patient)
                                    setPatientFormData({
                                      name: patient.name,
                                      age: patient.age.toString(),
                                      gender: patient.gender,
                                      consultationReason: patient.consultationReason,
                                      email: patient.email,
                                      phone: patient.phone,
                                      address: patient.address,
                                      bloodType: patient.bloodType,
                                      allergies: patient.allergies.join(", "),
                                      chronicConditions: patient.chronicConditions.join(", "),
                                      paymentStatus: patient.paymentStatus,
                                      insuranceProvider: patient.insuranceProvider,
                                      insuranceNumber: patient.insuranceNumber,
                                    })
                                    setIsEditPatientOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeletePatient(patient.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-500">
                            No se encontraron pacientes
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Exámenes</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Buscar exámenes..." className="pl-10" />
                    </div>
                    <Button onClick={() => setIsAddExamOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Examen
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
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Paciente</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo de Examen</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.length > 0 ? (
                        exams.map((exam) => (
                          <tr key={exam.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{exam.id}</td>
                            <td className="py-3 px-4">{exam.patientName}</td>
                            <td className="py-3 px-4">{exam.examType}</td>
                            <td className="py-3 px-4">{exam.date}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  exam.status === "completed"
                                    ? "success"
                                    : exam.status === "pending"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {exam.status === "completed" ? "Completado" : "Pendiente"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedExam(exam)}>
                                  Ver Resultados
                                </Button>
                                {exam.status === "pending" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Logic to upload results would go here
                                      toast({
                                        title: "Función en desarrollo",
                                        description: "La carga de resultados estará disponible próximamente.",
                                      })
                                    }}
                                  >
                                    <FileUp className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            No hay exámenes registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagnoses Tab */}
          <TabsContent value="diagnoses">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Diagnósticos</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Buscar diagnósticos..." className="pl-10" />
                    </div>
                    <Button onClick={() => setIsAddDiagnosisOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Diagnóstico
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
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Paciente</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnóstico</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Médico</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnoses.length > 0 ? (
                        diagnoses.map((diagnosis) => (
                          <tr key={diagnosis.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{diagnosis.id}</td>
                            <td className="py-3 px-4">{diagnosis.patientName}</td>
                            <td className="py-3 px-4">{diagnosis.diagnosis}</td>
                            <td className="py-3 px-4">{diagnosis.date}</td>
                            <td className="py-3 px-4">{diagnosis.doctor}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedDiagnosis(diagnosis)}>
                                  Ver Detalles
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Logic to print diagnosis would go here
                                    toast({
                                      title: "Función en desarrollo",
                                      description: "La impresión de diagnósticos estará disponible próximamente.",
                                    })
                                  }}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            No hay diagnósticos registrados
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
                  <CardTitle>Citas</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Buscar citas..." className="pl-10" />
                    </div>
                    <Button onClick={() => setIsAddAppointmentOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Cita
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
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Paciente</th>
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
                            <td className="py-3 px-4">{appointment.patientName}</td>
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Acciones
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Logic to view appointment details would go here
                                      toast({
                                        title: "Detalles de cita",
                                        description: `Cita ${appointment.id} para ${appointment.patientName}`,
                                      })
                                    }}
                                  >
                                    Ver detalles
                                  </DropdownMenuItem>
                                  {appointment.status === "scheduled" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                                      >
                                        Marcar como completada
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                                      >
                                        Cancelar cita
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-500">
                            No hay citas registradas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={selectedPatient !== null} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalles del Paciente</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="exams">Exámenes</TabsTrigger>
                <TabsTrigger value="diagnoses">Diagnósticos</TabsTrigger>
                <TabsTrigger value="appointments">Citas</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Información Personal</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">ID:</span>
                        <span className="font-medium">{selectedPatient.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nombre:</span>
                        <span className="font-medium">{selectedPatient.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Edad:</span>
                        <span className="font-medium">{selectedPatient.age} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Género:</span>
                        <span className="font-medium">{selectedPatient.gender === "M" ? "Masculino" : "Femenino"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Motivo de consulta:</span>
                        <span className="font-medium">{selectedPatient.consultationReason}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Última visita:</span>
                        <span className="font-medium">{selectedPatient.lastVisit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado:</span>
                        <Badge variant={selectedPatient.status === "active" ? "success" : "secondary"}>
                          {selectedPatient.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado de pago:</span>
                        <Badge variant={selectedPatient.paymentStatus === "paid" ? "success" : "outline"}>
                          {selectedPatient.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Información de Contacto</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{selectedPatient.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Teléfono:</span>
                        <span className="font-medium">{selectedPatient.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dirección:</span>
                        <span className="font-medium">{selectedPatient.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Seguro:</span>
                        <span className="font-medium">{selectedPatient.insuranceProvider || "No registrado"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Número de seguro:</span>
                        <span className="font-medium">{selectedPatient.insuranceNumber || "No registrado"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Creado por:</span>
                        <span className="font-medium">{selectedPatient.createdBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha de creación:</span>
                        <span className="font-medium">{selectedPatient.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Información Médica</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo de sangre:</span>
                      <span className="font-medium">{selectedPatient.bloodType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Alergias:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedPatient.allergies.length > 0 ? (
                          selectedPatient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="outline">
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">No registradas</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Condiciones crónicas:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedPatient.chronicConditions.length > 0 ? (
                          selectedPatient.chronicConditions.map((condition, index) => (
                            <Badge key={index} variant="outline">
                              {condition}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">No registradas</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <div>
                    <Button
                      variant={selectedPatient.status === "active" ? "destructive" : "outline"}
                      onClick={() => {
                        updatePatientStatus(
                          selectedPatient.id,
                          selectedPatient.status === "active" ? "inactive" : "active",
                        )
                        setSelectedPatient(null)
                      }}
                    >
                      {selectedPatient.status === "active" ? "Desactivar paciente" : "Activar paciente"}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPatient.paymentStatus === "pending" ? "outline" : "secondary"}
                      onClick={() => {
                        updatePatientPaymentStatus(
                          selectedPatient.id,
                          selectedPatient.paymentStatus === "pending" ? "paid" : "pending",
                        )
                        setSelectedPatient(null)
                      }}
                    >
                      {selectedPatient.paymentStatus === "pending" ? "Marcar como pagado" : "Marcar como pendiente"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPatient(null)
                        setPatientFormData({
                          name: selectedPatient.name,
                          age: selectedPatient.age.toString(),
                          gender: selectedPatient.gender,
                          consultationReason: selectedPatient.consultationReason,
                          email: selectedPatient.email,
                          phone: selectedPatient.phone,
                          address: selectedPatient.address,
                          bloodType: selectedPatient.bloodType,
                          allergies: selectedPatient.allergies.join(", "),
                          chronicConditions: selectedPatient.chronicConditions.join(", "),
                          paymentStatus: selectedPatient.paymentStatus,
                          insuranceProvider: selectedPatient.insuranceProvider,
                          insuranceNumber: selectedPatient.insuranceNumber,
                        })
                        setIsEditPatientOpen(true)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar paciente
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="exams" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo de Examen</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPatientExams(selectedPatient.id).length > 0 ? (
                        getPatientExams(selectedPatient.id).map((exam) => (
                          <tr key={exam.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{exam.id}</td>
                            <td className="py-3 px-4">{exam.examType}</td>
                            <td className="py-3 px-4">{exam.date}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  exam.status === "completed"
                                    ? "success"
                                    : exam.status === "pending"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {exam.status === "completed" ? "Completado" : "Pendiente"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPatient(null)
                                  setSelectedExam(exam)
                                }}
                              >
                                Ver Resultados
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            No hay exámenes registrados para este paciente
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      setSelectedPatient(null)
                      setExamFormData({
                        ...examFormData,
                        patientId: selectedPatient.id,
                      })
                      setIsAddExamOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Examen
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="diagnoses" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Diagnóstico</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Médico</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPatientDiagnoses(selectedPatient.id).length > 0 ? (
                        getPatientDiagnoses(selectedPatient.id).map((diagnosis) => (
                          <tr key={diagnosis.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{diagnosis.id}</td>
                            <td className="py-3 px-4">{diagnosis.diagnosis}</td>
                            <td className="py-3 px-4">{diagnosis.date}</td>
                            <td className="py-3 px-4">{diagnosis.doctor}</td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPatient(null)
                                  setSelectedDiagnosis(diagnosis)
                                }}
                              >
                                Ver Detalles
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            No hay diagnósticos registrados para este paciente
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      setSelectedPatient(null)
                      setDiagnosisFormData({
                        ...diagnosisFormData,
                        patientId: selectedPatient.id,
                      })
                      setIsAddDiagnosisOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Diagnóstico
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="appointments" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Hora</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPatientAppointments(selectedPatient.id).length > 0 ? (
                        getPatientAppointments(selectedPatient.id).map((appointment) => (
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Acciones
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Logic to view appointment details would go here
                                      toast({
                                        title: "Detalles de cita",
                                        description: `Cita ${appointment.id} para ${appointment.patientName}`,
                                      })
                                    }}
                                  >
                                    Ver detalles
                                  </DropdownMenuItem>
                                  {appointment.status === "scheduled" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          updateAppointmentStatus(appointment.id, "completed")
                                          setSelectedPatient(null)
                                        }}
                                      >
                                        Marcar como completada
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          updateAppointmentStatus(appointment.id, "cancelled")
                                          setSelectedPatient(null)
                                        }}
                                      >
                                        Cancelar cita
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            No hay citas registradas para este paciente
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      setSelectedPatient(null)
                      setAppointmentFormData({
                        ...appointmentFormData,
                        patientId: selectedPatient.id,
                      })
                      setIsAddAppointmentOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Cita
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Exam Details Dialog */}
      <Dialog open={selectedExam !== null} onOpenChange={() => setSelectedExam(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Resultados de Examen</DialogTitle>
            <DialogDescription>
              {selectedExam?.examType} - {selectedExam?.patientName}
            </DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">ID: {selectedExam.id}</p>
                  <p className="text-sm text-gray-500">Fecha: {selectedExam.date}</p>
                  <p className="text-sm text-gray-500">Médico: {selectedExam.doctor}</p>
                </div>
                <Badge
                  variant={
                    selectedExam.status === "completed"
                      ? "success"
                      : selectedExam.status === "pending"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {selectedExam.status === "completed" ? "Completado" : "Pendiente"}
                </Badge>
              </div>
              {selectedExam.status === "completed" ? (
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
                      {selectedExam.results.map((result, index) => (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Los resultados aún no están disponibles</p>
                </div>
              )}
              {selectedExam.notes && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Notas</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedExam.notes}</p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar por correo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diagnosis Details Dialog */}
      <Dialog open={selectedDiagnosis !== null} onOpenChange={() => setSelectedDiagnosis(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Diagnóstico</DialogTitle>
            <DialogDescription>{selectedDiagnosis?.patientName}</DialogDescription>
          </DialogHeader>
          {selectedDiagnosis && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">ID: {selectedDiagnosis.id}</p>
                  <p className="text-sm text-gray-500">Fecha: {selectedDiagnosis.date}</p>
                  <p className="text-sm text-gray-500">Médico: {selectedDiagnosis.doctor}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Diagnóstico</h4>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg font-medium">{selectedDiagnosis.diagnosis}</p>
              </div>
              {selectedDiagnosis.treatment && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Tratamiento</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedDiagnosis.treatment}</p>
                </div>
              )}
              {selectedDiagnosis.notes && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Notas</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedDiagnosis.notes}</p>
                </div>
              )}
              {selectedDiagnosis.followUp && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Próximo control</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedDiagnosis.followUp}</p>
                </div>
              )}
              {selectedDiagnosis.relatedExams.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Exámenes relacionados</h4>
                  <div className="space-y-2">
                    {selectedDiagnosis.relatedExams.map((examId) => {
                      const exam = exams.find((e) => e.id === examId)
                      return exam ? (
                        <div key={examId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="font-medium">{exam.examType}</p>
                            <p className="text-sm text-gray-500">Fecha: {exam.date}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDiagnosis(null)
                              setSelectedExam(exam)
                            }}
                          >
                            Ver Resultados
                          </Button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar por correo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
            <DialogDescription>Ingresa la información del nuevo paciente</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={patientFormData.name}
                  onChange={handlePatientFormChange}
                  placeholder="Nombre completo del paciente"
                />
              </div>
              <div>
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={patientFormData.age}
                  onChange={handlePatientFormChange}
                  placeholder="Edad del paciente"
                />
              </div>
              <div>
                <Label htmlFor="gender">Género</Label>
                <Select
                  name="gender"
                  value={patientFormData.gender}
                  onValueChange={(value) => setPatientFormData({ ...patientFormData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consultationReason">Motivo de consulta</Label>
                <Textarea
                  id="consultationReason"
                  name="consultationReason"
                  value={patientFormData.consultationReason}
                  onChange={handlePatientFormChange}
                  placeholder="Motivo de la consulta"
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Tipo de sangre</Label>
                <Select
                  name="bloodType"
                  value={patientFormData.bloodType}
                  onValueChange={(value) => setPatientFormData({ ...patientFormData, bloodType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de sangre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={patientFormData.email}
                  onChange={handlePatientFormChange}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={patientFormData.phone}
                  onChange={handlePatientFormChange}
                  placeholder="999-999-999"
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={patientFormData.address}
                  onChange={handlePatientFormChange}
                  placeholder="Dirección completa"
                />
              </div>
              <div>
                <Label htmlFor="paymentStatus">Estado de pago</Label>
                <Select
                  name="paymentStatus"
                  value={patientFormData.paymentStatus}
                  onValueChange={(value) => setPatientFormData({ ...patientFormData, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insuranceProvider">Proveedor de seguro</Label>
                <Input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  value={patientFormData.insuranceProvider}
                  onChange={handlePatientFormChange}
                  placeholder="Nombre del seguro (opcional)"
                />
              </div>
              <div>
                <Label htmlFor="insuranceNumber">Número de seguro</Label>
                <Input
                  id="insuranceNumber"
                  name="insuranceNumber"
                  value={patientFormData.insuranceNumber}
                  onChange={handlePatientFormChange}
                  placeholder="Número de póliza (opcional)"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="allergies">Alergias (separadas por comas)</Label>
              <Input
                id="allergies"
                name="allergies"
                value={patientFormData.allergies}
                onChange={handlePatientFormChange}
                placeholder="Ej: Penicilina, Aspirina"
              />
            </div>
            <div>
              <Label htmlFor="chronicConditions">Condiciones crónicas (separadas por comas)</Label>
              <Input
                id="chronicConditions"
                name="chronicConditions"
                value={patientFormData.chronicConditions}
                onChange={handlePatientFormChange}
                placeholder="Ej: Hipertensión, Diabetes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPatient}>Agregar Paciente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditPatientOpen} onOpenChange={setIsEditPatientOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>Actualiza la información del paciente</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={patientFormData.name}
                  onChange={handlePatientFormChange}
                  placeholder="Nombre completo del paciente"
                />
              </div>
              <div>
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={patientFormData.age}
                  onChange={handlePatientFormChange}
                  placeholder="Edad del paciente"
                />
              </div>
              <div>
                <Label htmlFor="gender">Género</Label>
                <Select
                  name="gender"
                  value={patientFormData.gender}
                  onValueChange={(value) => setPatientFormData({ ...patientFormData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consultationReason">Motivo de consulta</Label>
                <Textarea
                  id="consultationReason"
                  name="consultationReason"
                  value={patientFormData.consultationReason}
                  onChange={handlePatientFormChange}
                  placeholder="Motivo de la consulta"
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Tipo de sangre</Label>
                <Select
                  name="bloodType"
                  value={patientFormData.bloodType}
                  onValueChange={(value) => setPatientFormData({ ...patientFormData, bloodType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de sangre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={patientFormData.email}
                  onChange={handlePatientFormChange}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={patientFormData.phone}
                  onChange={handlePatientFormChange}
                  placeholder="999-999-999"
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={patientFormData.address}
                  onChange={handlePatientFormChange}
                  placeholder="Dirección completa"
                />
              </div>
              <div>
                <Label htmlFor="paymentStatus">Estado de pago</Label>
                <Select
                  name="paymentStatus"
                  value={patientFormData.paymentStatus}
                  onValueChange={(value) => setPatientFormData({ ...patientFormData, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insuranceProvider">Proveedor de seguro</Label>
                <Input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  value={patientFormData.insuranceProvider}
                  onChange={handlePatientFormChange}
                  placeholder="Nombre del seguro (opcional)"
                />
              </div>
              <div>
                <Label htmlFor="insuranceNumber">Número de seguro</Label>
                <Input
                  id="insuranceNumber"
                  name="insuranceNumber"
                  value={patientFormData.insuranceNumber}
                  onChange={handlePatientFormChange}
                  placeholder="Número de póliza (opcional)"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="allergies">Alergias (separadas por comas)</Label>
              <Input
                id="allergies"
                name="allergies"
                value={patientFormData.allergies}
                onChange={handlePatientFormChange}
                placeholder="Ej: Penicilina, Aspirina"
              />
            </div>
            <div>
              <Label htmlFor="chronicConditions">Condiciones crónicas (separadas por comas)</Label>
              <Input
                id="chronicConditions"
                name="chronicConditions"
                value={patientFormData.chronicConditions}
                onChange={handlePatientFormChange}
                placeholder="Ej: Hipertensión, Diabetes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPatientOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditPatient}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Exam Dialog */}
      <Dialog open={isAddExamOpen} onOpenChange={setIsAddExamOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Examen</DialogTitle>
            <DialogDescription>Ingresa la información del nuevo examen</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientId">Paciente</Label>
              <Select
                name="patientId"
                value={examFormData.patientId}
                onValueChange={(value) => setExamFormData({ ...examFormData, patientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="examType">Tipo de examen</Label>
              <Select
                name="examType"
                value={examFormData.examType}
                onValueChange={(value) => setExamFormData({ ...examFormData, examType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de examen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hemograma completo">Hemograma completo</SelectItem>
                  <SelectItem value="Perfil lipídico">Perfil lipídico</SelectItem>
                  <SelectItem value="Glucosa en ayunas">Glucosa en ayunas</SelectItem>
                  <SelectItem value="Perfil renal">Perfil renal</SelectItem>
                  <SelectItem value="Perfil hepático">Perfil hepático</SelectItem>
                  <SelectItem value="Perfil tiroideo">Perfil tiroideo</SelectItem>
                  <SelectItem value="Electrocardiograma">Electrocardiograma</SelectItem>
                  <SelectItem value="Espirometría">Espirometría</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" value={examFormData.date} onChange={handleExamFormChange} />
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                name="notes"
                value={examFormData.notes}
                onChange={handleExamFormChange}
                placeholder="Notas adicionales sobre el examen"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExamOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddExam}>Agregar Examen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Diagnosis Dialog */}
      <Dialog open={isAddDiagnosisOpen} onOpenChange={setIsAddDiagnosisOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Diagnóstico</DialogTitle>
            <DialogDescription>Ingresa la información del nuevo diagnóstico</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientId">Paciente</Label>
              <Select
                name="patientId"
                value={diagnosisFormData.patientId}
                onValueChange={(value) => setDiagnosisFormData({ ...diagnosisFormData, patientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Input
                id="diagnosis"
                name="diagnosis"
                value={diagnosisFormData.diagnosis}
                onChange={handleDiagnosisFormChange}
                placeholder="Diagnóstico del paciente"
              />
            </div>
            <div>
              <Label htmlFor="treatment">Tratamiento</Label>
              <Textarea
                id="treatment"
                name="treatment"
                value={diagnosisFormData.treatment}
                onChange={handleDiagnosisFormChange}
                placeholder="Tratamiento recomendado"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                name="notes"
                value={diagnosisFormData.notes}
                onChange={handleDiagnosisFormChange}
                placeholder="Notas adicionales sobre el diagnóstico"
              />
            </div>
            <div>
              <Label htmlFor="followUp">Fecha de próximo control</Label>
              <Input
                id="followUp"
                name="followUp"
                type="date"
                value={diagnosisFormData.followUp}
                onChange={handleDiagnosisFormChange}
              />
            </div>
            <div>
              <Label>Exámenes relacionados</Label>
              <div className="mt-2 space-y-2">
                {diagnosisFormData.patientId &&
                  getPatientExams(diagnosisFormData.patientId).map((exam) => (
                    <div key={exam.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={exam.id}
                        checked={diagnosisFormData.relatedExams.includes(exam.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDiagnosisFormData({
                              ...diagnosisFormData,
                              relatedExams: [...diagnosisFormData.relatedExams, exam.id],
                            })
                          } else {
                            setDiagnosisFormData({
                              ...diagnosisFormData,
                              relatedExams: diagnosisFormData.relatedExams.filter((id) => id !== exam.id),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={exam.id} className="cursor-pointer">
                        {exam.examType} - {exam.date}
                      </Label>
                    </div>
                  ))}
                {diagnosisFormData.patientId && getPatientExams(diagnosisFormData.patientId).length === 0 && (
                  <p className="text-sm text-gray-500">No hay exámenes disponibles para este paciente</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDiagnosisOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDiagnosis}>Agregar Diagnóstico</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Cita</DialogTitle>
            <DialogDescription>Ingresa la información de la nueva cita</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientId">Paciente</Label>
              <Select
                name="patientId"
                value={appointmentFormData.patientId}
                onValueChange={(value) => setAppointmentFormData({ ...appointmentFormData, patientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <div>
              <Label htmlFor="type">Tipo de cita</Label>
              <Select
                name="type"
                value={appointmentFormData.type}
                onValueChange={(value) => setAppointmentFormData({ ...appointmentFormData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de cita" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Control">Control</SelectItem>
                  <SelectItem value="Evaluación">Evaluación</SelectItem>
                  <SelectItem value="Consulta">Consulta</SelectItem>
                  <SelectItem value="Procedimiento">Procedimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                value={appointmentFormData.location}
                onChange={handleAppointmentFormChange}
                placeholder="Ej: Consultorio 101"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duración (minutos)</Label>
              <Select
                name="duration"
                value={appointmentFormData.duration}
                onValueChange={(value) => setAppointmentFormData({ ...appointmentFormData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                name="notes"
                value={appointmentFormData.notes}
                onChange={handleAppointmentFormChange}
                placeholder="Notas adicionales sobre la cita"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAppointmentOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAppointment}>Agregar Cita</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

