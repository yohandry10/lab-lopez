"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { es } from "date-fns/locale"
import { Home, MapPin, Search } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useDynamicPricing } from "@/hooks/use-dynamic-pricing"
import { useAuth } from "@/contexts/auth-context"

interface SchedulingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: any, quantity: number) => void
  testName: string
  initialServiceType?: string
  programmingType?: string
  initialSelectedAnalyses?: SelectedAnalysis[]
  onAnalysesChange?: (analyses: SelectedAnalysis[]) => void
}

// Tipos para análisis
interface Analysis {
  id: number
  name: string
  price: number
  reference_price?: number
  show_public?: boolean
  category?: string
}

interface SelectedAnalysis extends Analysis {
  quantity: number
}

interface SedeInfo {
  address: string
  lat: number
  lng: number
  name: string
}

type SedesInfoType = {
  [key: string]: SedeInfo
}

// Definir las coordenadas y detalles de las sedes
const sedesInfo: SedesInfoType = {
  "Sede San Juan de Miraflores (dentro la Clínica Sagrada Familia del Sur)": {
    address: "Av. Miguel Iglesias 625, San Juan de Miraflores 15824",
    lat: -12.159346,
    lng: -76.972204,
    name: "Sede San Juan de Miraflores (dentro la Clínica Sagrada Familia del Sur)",
  },
  "Sede Santa Anita": {
    address: "María Parado de Bellido 110G, Santa Anita 15008",
    lat: -12.043387,
    lng: -76.975092,
    name: "Sede Santa Anita",
  },
}

export function SchedulingFlow({
  isOpen,
  onClose,
  onComplete,
  testName,
  initialServiceType = "sede",
  programmingType = "horario",
  initialSelectedAnalyses = [],
  onAnalysesChange,
}: SchedulingFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedSedeInfo, setSelectedSedeInfo] = useState<SedeInfo | null>(null)
  const [formData, setFormData] = useState({
    serviceType: initialServiceType,
    programmingType: programmingType,
    date: undefined as Date | undefined,
    timeSlot: "",
    location: "",
    district: "",
    address: "",
    addressDetails: "",
    reference: "",
    latitude: 0,
    longitude: 0,
    // Paso 2
    firstName: "",
    lastName: "",
    documentType: "dni",
    documentNumber: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
  })

  const [quantity, setQuantity] = useState<number>(1)

  const { user } = useAuth()
  const skipPatientForm = !!user // Logged-in users do not need to fill patient form

  // --- Estados para selección de análisis ---
  const [searchTerm, setSearchTerm] = useState("")
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([])
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([])
  const [showAvailable, setShowAvailable] = useState(false)
  const [selectedAnalyses, setSelectedAnalyses] = useState<SelectedAnalysis[]>(initialSelectedAnalyses)
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false)
  const [analysisPrices, setAnalysisPrices] = useState<Record<string, { price: number; tariff_name: string }>>({})

  const { getExamPrice, formatPrice, canSeePrice } = useDynamicPricing()

  // Price helper
  function PriceDisplay({ analysis }: { analysis: Analysis }) {
    const [priceInfo, setPriceInfo] = useState<{ price: number; tariff_name: string } | null>(null)
    useEffect(() => {
      if (!canSeePrice() || !analysis?.id) return
      getExamPrice(analysis.id).then(setPriceInfo)
    }, [analysis?.id])
    if (!canSeePrice()) return null
    const finalPrice = priceInfo ? priceInfo.price : analysis.price
    return <span className="font-medium text-blue-600">{formatPrice(finalPrice)}</span>
  }

  // Cargar análisis al abrir modal
  useEffect(() => {
    if (isOpen) fetchAnalyses()
  }, [isOpen])

  const loadAnalysisPrices = async (analyses: Analysis[]) => {
    if (!user) return
    const pricesMap: Record<string, { price: number; tariff_name: string }> = {}
    for (const analysis of analyses) {
      try {
        const priceInfo = await getExamPrice(analysis.id.toString())
        if (priceInfo) {
          pricesMap[analysis.id.toString()] = {
            price: priceInfo.price,
            tariff_name: priceInfo.tariff_name,
          }
        }
      } catch (error) {
        console.error(`Error loading price for analysis ${analysis.id}:`, error)
      }
    }
    setAnalysisPrices(pricesMap)
  }

  // Cargar (o actualizar) el precio de un solo análisis
  const loadSingleAnalysisPrice = async (analysis: Analysis) => {
    try {
      const priceInfo = await getExamPrice(analysis.id.toString())
      if (priceInfo) {
        setAnalysisPrices((prev) => ({
          ...prev,
          [analysis.id.toString()]: {
            price: priceInfo.price,
            tariff_name: priceInfo.tariff_name,
          },
        }))
      }
    } catch (error) {
      console.error(`Error loading price for analysis ${analysis.id}:`, error)
    }
  }

  const fetchAnalyses = async () => {
    setIsLoadingAnalyses(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("analyses")
        .select("id, name, price, reference_price, show_public, category")
        .order("name", { ascending: true })
      if (error) {
        console.error("Error fetching analyses:", error)
        setAllAnalyses([])
        return
      }
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: Analysis[] = data.map((item: any) => ({
          id: Number(item.id),
          name: String(item.name || "").trim(),
          price: Number(item.price || 0),
          reference_price: item.reference_price ? Number(item.reference_price) : undefined,
          show_public: Boolean(item.show_public),
          category: String(item.category || "").trim(),
        }))
        const filteredByRole = mapped.filter((a) => {
          if (!user) return a.show_public === true
          switch (user.user_type) {
            case "admin":
            case "patient":
            case "doctor":
            case "company":
              return true
            default:
              return true
          }
        })
        setAllAnalyses(filteredByRole)
        loadAnalysisPrices(filteredByRole)
      }
    } catch (err) {
      console.error(err)
      setAllAnalyses([])
    } finally {
      setIsLoadingAnalyses(false)
    }
  }

  // Filtrado según término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAnalyses([])
    } else {
      const filtered = allAnalyses.filter((analysis) => {
        const nameMatch = analysis.name.toLowerCase().includes(searchTerm.toLowerCase())
        const categoryMatch = analysis.category && analysis.category.toLowerCase().includes(searchTerm.toLowerCase())
        return nameMatch || categoryMatch
      })
      setFilteredAnalyses(filtered.slice(0, 10))
    }
  }, [searchTerm, allAnalyses])

  // Restablecer listado cuando se escriba en búsqueda
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setShowAvailable(false)
    }
  }, [searchTerm])

  // Actualizar cantidad total y propagar cambios
  useEffect(() => {
    setQuantity(selectedAnalyses.reduce((s, a) => s + a.quantity, 0))
    if (onAnalysesChange) onAnalysesChange(selectedAnalyses)
  }, [selectedAnalyses])

  const handleSelectAnalysis = (analysis: Analysis) => {
    const existing = selectedAnalyses.find((a) => a.id === analysis.id)
    if (existing) {
      setSelectedAnalyses(
        selectedAnalyses.map((a) => (a.id === analysis.id ? { ...a, quantity: a.quantity + 1 } : a))
      )
    } else {
      setSelectedAnalyses([...selectedAnalyses, { ...analysis, quantity: 1 }])
    }
    // Intentar cargar/actualizar el precio del análisis recién seleccionado
    loadSingleAnalysisPrice(analysis)

    setSearchTerm("")
    setFilteredAnalyses([])
  }

  const handleRemoveAnalysis = (analysisId: number) => {
    setSelectedAnalyses(selectedAnalyses.filter((a) => a.id !== analysisId))
  }

  const calculateTotal = () => {
    return selectedAnalyses.reduce((total, analysis) => {
      const dynamicPrice = analysisPrices[analysis.id.toString()]
      const finalPrice = dynamicPrice ? dynamicPrice.price : analysis.price
      return total + finalPrice * analysis.quantity
    }, 0)
  }

  // Actualizar el tipo de servicio y programación cuando cambian
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      serviceType: initialServiceType,
      programmingType: programmingType,
    }))
  }, [initialServiceType, programmingType])

  const locations = [
    "Sede San Juan de Miraflores (dentro la Clínica Sagrada Familia del Sur)",
    "Sede Santa Anita",
  ]

  const districts = [
    "San Juan de Miraflores",
    "Villa María del Triunfo",
    "Villa El Salvador",
    "Chorrillos",
    "Surco",
    "San Borja",
    "Santa Anita",
    "Ate",
    "La Molina",
  ]

  // Horarios según el tipo de programación
  const getTimeSlots = () => {
    // Ahora "urgente" solo muestra los turnos limitados y "horario" muestra todos
    if (formData.programmingType === "urgente") {
      // Urgente: solo 10:00 y 13:00
      return ["10:00", "13:00"]
    }

    // Según horario: horarios ampliados
    return [
      "07:00",
      "07:30",
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
    ]
  }

  // Manejar el cambio de sede seleccionada
  const handleSedeChange = (value: string) => {
    const sedeInfo = sedesInfo[value]
    if (sedeInfo) {
      setSelectedSedeInfo(sedeInfo)
      setFormData({
        ...formData,
        location: value,
        address: sedeInfo.address,
        latitude: sedeInfo.lat,
        longitude: sedeInfo.lng,
      })
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, date })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const isStep1Valid = () => {
    if (formData.serviceType === "sede") {
      return (
        formData.programmingType &&
        formData.date &&
        formData.timeSlot &&
        formData.location
      )
    } else {
      return (
        formData.programmingType &&
        formData.date &&
        formData.timeSlot &&
        formData.district &&
        formData.address
      )
    }
  }

  const isStep2Valid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.documentNumber &&
      formData.phone &&
      formData.email
    )
  }

  const handleNext = () => {
    // 👉 Paso Único para usuarios logeados (sin formulario de paciente)
    if (skipPatientForm) {
      if (isStep1Valid()) {
        // Construir datos mínimos de paciente usando la sesión
        const patientData = {
          firstName: user?.first_name || "",
          lastName: user?.last_name || "",
          documentType: "",
          documentNumber: "",
          phone: "",
          email: user?.email || "",
        }

        // Guardar datos en localStorage para EmailJS (mantener mismo formato)
        const schedulingData = {
          programmingType: formData.programmingType,
          selectedDate: formData.date?.toLocaleDateString('es-PE') || new Date().toLocaleDateString('es-PE'),
          selectedTime: formData.timeSlot,
          serviceType: formData.serviceType,
          address: formData.serviceType === "domicilio" ? formData.address : (formData.location || 'Sede'),
          clientReference: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Usuario Logeado'
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('scheduling-data', JSON.stringify(schedulingData))
          localStorage.setItem('patient-data', JSON.stringify(patientData))
          console.log("📦 Datos guardados en localStorage para EmailJS (usuario logeado):", { schedulingData, patientData })
        }

        onComplete(patientData, quantity)
      }
      return
    }

    // 👉 Flujo original para usuarios no logeados
    if (step === 1 && isStep1Valid()) {
      setStep(2)
    } else if (step === 2 && isStep2Valid()) {
      const patientData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
        gender: formData.gender,
        address: formData.address,
        district: formData.district,
        reference: formData.reference,
        coordinates: formData.serviceType === "domicilio" ? {
          lat: formData.latitude,
          lng: formData.longitude,
          address: formData.address,
        } : undefined
      }

      // Guardar datos en localStorage para usar en el carrito con EmailJS
      const schedulingData = {
        programmingType: formData.programmingType,
        selectedDate: formData.date?.toLocaleDateString('es-PE') || new Date().toLocaleDateString('es-PE'),
        selectedTime: formData.timeSlot,
        serviceType: formData.serviceType,
        address: formData.serviceType === "domicilio" ? formData.address : (formData.location || 'Sede'),
        clientReference: 'Público General' // Por defecto, se puede modificar según el usuario
      }
      
      const patientDataForEmail = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate
      }
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('scheduling-data', JSON.stringify(schedulingData))
        localStorage.setItem('patient-data', JSON.stringify(patientDataForEmail))
        console.log("📦 Datos guardados en localStorage para EmailJS:", { schedulingData, patientDataForEmail })
      }

      onComplete(patientData, quantity)
    }
  }

  const groupedAnalyses = useMemo(() => {
    const groups: Record<string, Analysis[]> = {}
    allAnalyses.forEach((a) => {
      const key = a.category || "Otros"
      if (!groups[key]) groups[key] = []
      groups[key].push(a)
    })
    // Ordenar claves alfabéticamente
    return Object.keys(groups)
      .sort()
      .reduce((obj: Record<string, Analysis[]>, key) => {
        obj[key] = groups[key]
        return obj
      }, {})
  }, [allAnalyses])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {skipPatientForm
              ? "Reserva la cita"
              : step === 1
                ? "Paso 1 de 2: Reserva la cita"
                : "Paso 2 de 2: Ingresa los datos del paciente"}
          </DialogTitle>
          <DialogDescription>{testName}</DialogDescription>
        </DialogHeader>

        {/* El selector de cantidad se eliminó: siempre se asume 1 por programación */}

        {step === 1 && (
          <div className="py-4">
            <div className="space-y-6">
              {/* SELECCIONAR ANÁLISIS */}
              <div>
                <div className="flex justify-between items-center">
                  <Label className="font-medium text-base">Análisis</Label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAvailable((prev) => !prev)}
                  >
                    {showAvailable ? "Volver" : "Análisis disponibles"}
                  </Button>
                </div>

                {isLoadingAnalyses && (
                  <div className="mt-2 text-xs text-blue-600">🔄 Cargando análisis...</div>
                )}

                {showAvailable ? (
                  <div className="mt-2 max-h-48 overflow-y-auto border rounded-md bg-white shadow-lg divide-y">
                    {Object.entries(groupedAnalyses).map(([cat, list]) => (
                      <div key={cat}>
                        <div className="sticky top-0 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 uppercase z-10">
                          {cat}
                        </div>
                        {list.map((analysis) => {
                          const isSelected = selectedAnalyses.some((s) => s.id === analysis.id)
                          return (
                            <button
                              key={analysis.id}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 focus:outline-none ${
                                isSelected ? "bg-blue-50" : "bg-white"
                              }`}
                              onClick={() => handleSelectAnalysis(analysis)}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-900 truncate max-w-[60%]">{analysis.name}</span>
                                {canSeePrice() && <PriceDisplay analysis={analysis} />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  null /* sin buscador ni resultados filtrados */
                )}

                {selectedAnalyses.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="font-medium">Análisis seleccionados:</Label>
                    {selectedAnalyses.map((analysis) => {
                      const dynamicPrice = analysisPrices[analysis.id.toString()]
                      const finalPrice = dynamicPrice ? dynamicPrice.price : analysis.price
                      return (
                        <div
                          key={analysis.id}
                          className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md"
                        >
                          <div className="font-medium text-blue-900 truncate max-w-[140px] sm:max-w-none">
                            {analysis.name}
                          </div>
                          <div className="flex items-center gap-3">
                            {canSeePrice() && (
                              <span className="text-blue-900 text-sm font-medium">S/. {(finalPrice * analysis.quantity).toFixed(2)}</span>
                            )}
                            <button
                              onClick={() => handleSelectAnalysis(analysis)}
                              className="text-green-600 hover:text-green-800 text-lg leading-none"
                              title="Agregar uno más"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemoveAnalysis(analysis.id)}
                              className="text-red-600 hover:text-red-800 text-xs underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}

                    {canSeePrice() && (
                      <div className="p-3 bg-purple-100 border border-purple-200 rounded-md">
                        <div className="font-bold text-purple-900 text-sm sm:text-lg">
                          TOTAL: {selectedAnalyses.reduce((s, a) => s + a.quantity, 0)} ANÁLISIS - S/. {calculateTotal().toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CAMPOS DE PROGRAMACIÓN Y SERVICIO */}
              {!showAvailable && (
              <>
              <div>
                <Label htmlFor="programmingType" className="font-medium">
                  Tipo de programaciones *
                </Label>
                <RadioGroup
                  id="programmingType"
                  value={formData.programmingType}
                  onValueChange={(value) => setFormData({ ...formData, programmingType: value })}
                  className="mt-2 flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="horario" id="horario" />
                    <Label htmlFor="horario" className="flex items-center gap-2">
                      📅 Según horario <span className="text-sm text-gray-600">(10:00 y 13:00 horas)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgente" id="urgente" />
                    <Label htmlFor="urgente" className="flex items-center gap-2">
                      ⚡ Urgente <span className="text-sm text-orange-600">(cuando la referencia lo necesita)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* TIPO DE SERVICIO */}
              <div>
                <Label htmlFor="serviceType" className="font-medium">
                  Lugar del recojo *
                </Label>
                <RadioGroup
                  id="serviceType"
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  className="mt-2 flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sede" id="sede" />
                    <Label htmlFor="sede">🏥 Recojo en sede</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="domicilio" id="domicilio" />
                    <Label htmlFor="domicilio" className="flex items-center gap-2">
                      🏠 Recojo a domicilio <Home className="h-4 w-4" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* NUEVO: CAMPOS DEPENDIENTES DEL TIPO DE SERVICIO */}
              {formData.serviceType === "sede" && (
                <div className="mt-4">
                  <Label htmlFor="location" className="font-medium">
                    Escoge la sede para la cita *
                  </Label>
                  <Select value={formData.location} onValueChange={handleSedeChange}>
                    <SelectTrigger id="location" className="mt-1">
                      <SelectValue placeholder="Selecciona una sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.serviceType === "domicilio" && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="font-medium">
                      Dirección completa *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu dirección completa"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="district" className="font-medium">
                      Distrito *
                    </Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                    >
                      <SelectTrigger id="district" className="mt-1">
                        <SelectValue placeholder="Selecciona un distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="addressDetails" className="font-medium">
                      Detalles de la dirección
                    </Label>
                    <Input
                      id="addressDetails"
                      name="addressDetails"
                      value={formData.addressDetails}
                      onChange={handleInputChange}
                      placeholder="Piso, departamento, etc."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reference" className="font-medium">
                      Referencia
                    </Label>
                    <Input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Cerca a..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              </>
              )}

              {!showAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date" className="font-medium">
                    Elige una fecha *
                  </Label>
                  <div className="mt-2 border rounded-md p-4 overflow-x-auto">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      locale={es}
                      disabled={(date) => {
                        const today = new Date()
                        const yesterday = new Date(today)
                        yesterday.setDate(yesterday.getDate() - 1)
                        // Permitir seleccionar desde hoy en adelante (incluyendo el mismo día)
                        return date < yesterday
                      }}
                      className="mx-auto"
                      weekStartsOn={1}
                      showOutsideDays={false}
                      fixedWeeks
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeSlot" className="font-medium">
                    Elige un turno * 
                    {formData.programmingType === "horario" && (
                      <span className="text-sm text-gray-600 block mt-1">
                        Horarios de programaciones según horario
                      </span>
                    )}
                    {formData.programmingType === "urgente" && (
                      <span className="text-sm text-orange-600 block mt-1">
                        Horarios urgentes disponibles
                      </span>
                    )}
                  </Label>
                  <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {getTimeSlots().map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.timeSlot === time ? "default" : "outline"}
                        className={`text-sm ${
                          formData.timeSlot === time 
                            ? formData.programmingType === "urgente"
                              ? "bg-orange-600 text-white hover:bg-orange-600/90"
                              : "bg-[#1e5fad] text-white hover:bg-[#1e5fad]/90"
                            : formData.programmingType === "urgente"
                              ? "bg-orange-50 text-orange-600 border-orange-300 hover:bg-orange-100"
                              : "bg-[#EBF5FF] text-[#1e5fad] border-[#1e5fad] hover:bg-[#1e5fad]/10"
                        }`}
                        onClick={() => setFormData({ ...formData, timeSlot: time })}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  {formData.programmingType === "urgente" && (
                    <div className="mt-2 text-xs text-gray-500">
                      Solo disponible en horarios de 10:00 y 13:00 horas
                    </div>
                  )}
                  {formData.programmingType === "horario" && (
                    <div className="mt-2 text-xs text-orange-600">
                      Horarios disponibles según programación
                    </div>
                  )}
                </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="documentType">Tipo de documento *</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                >
                  <SelectTrigger id="documentType" className="mt-1">
                    <SelectValue placeholder="Selecciona el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dni">DNI</SelectItem>
                    <SelectItem value="passport">Pasaporte</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="documentNumber">Número de documento *</Label>
                <Input
                  id="documentNumber"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  type="date"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">Género</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger id="gender" className="mt-1">
                    <SelectValue placeholder="Selecciona el género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
            >
              Atrás
            </Button>
          )}
          <Button
            type="button"
            onClick={handleNext}
            disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()}
          >
            {skipPatientForm
              ? "Completar"
              : step === 1
                ? "Siguiente"
                : "Completar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

