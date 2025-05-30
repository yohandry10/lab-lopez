"use client"

import { useState, useEffect } from "react"
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
import { Home, MapPin } from "lucide-react"

interface SchedulingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: any) => void
  testName: string
  initialServiceType?: string
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
}: SchedulingFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedSedeInfo, setSelectedSedeInfo] = useState<SedeInfo | null>(null)
  const [formData, setFormData] = useState({
    serviceType: initialServiceType,
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

  // Actualizar el tipo de servicio cuando cambia initialServiceType
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      serviceType: initialServiceType,
    }))
  }, [initialServiceType])

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

  const timeSlots = [
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
        formData.date &&
        formData.timeSlot &&
        formData.location
      )
    } else {
      return (
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
      onComplete(patientData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Paso 1 de 2: Reserva la cita" : "Paso 2 de 2: Ingresa los datos del paciente"}
          </DialogTitle>
          <DialogDescription>{testName}</DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="py-4">
            <div className="space-y-6">
              <div>
                <Label htmlFor="serviceType" className="font-medium">
                  Escoge el tipo de atención *
                </Label>
                <RadioGroup
                  id="serviceType"
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  className="mt-2 flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sede" id="sede" />
                    <Label htmlFor="sede">Atención en sede</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="domicilio" id="domicilio" />
                    <Label htmlFor="domicilio" className="flex items-center gap-2">
                      Atención a domicilio <Home className="h-4 w-4" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>

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
                      disabled={(date) => date < new Date()}
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
                  </Label>
                  <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.timeSlot === time ? "default" : "outline"}
                        className={`text-sm ${
                          formData.timeSlot === time 
                            ? "bg-[#1e5fad] text-white hover:bg-[#1e5fad]/90" 
                            : "bg-[#EBF5FF] text-[#1e5fad] border-[#1e5fad] hover:bg-[#1e5fad]/10"
                        }`}
                        onClick={() => setFormData({ ...formData, timeSlot: time })}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {formData.serviceType === "sede" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location" className="font-medium">
                      Escoge la sede para la cita *
                    </Label>
                    <Select
                      value={formData.location}
                      onValueChange={handleSedeChange}
                    >
                      <SelectTrigger id="location" className="mt-2">
                        <SelectValue placeholder="Selecciona una sede" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSedeInfo && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-[#1e5fad] mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{selectedSedeInfo.name}</h4>
                          <p className="text-sm text-gray-600">{selectedSedeInfo.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección completa *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ingrese su dirección completa"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">Distrito *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => setFormData({ ...formData, district: value })}
                      >
                        <SelectTrigger id="district" className="mt-1">
                          <SelectValue placeholder="Selecciona un distrito" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="addressDetails">Detalles de la dirección</Label>
                      <Input
                        id="addressDetails"
                        name="addressDetails"
                        value={formData.addressDetails}
                        onChange={handleInputChange}
                        placeholder="Piso, departamento, etc."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reference">Referencia</Label>
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
            {step === 1 ? "Siguiente" : "Completar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

