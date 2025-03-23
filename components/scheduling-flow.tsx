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
import { GoogleMapPicker } from "./google-map-picker"

interface SchedulingFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: any) => void
  testName: string
  initialServiceType?: string
}

export function SchedulingFlow({
  isOpen,
  onClose,
  onComplete,
  testName,
  initialServiceType = "sede",
}: SchedulingFlowProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Appointment details
    serviceType: initialServiceType,
    date: null,
    location: "",
    timeSlot: "",

    // Step 2: Patient details
    documentType: "DNI",
    documentNumber: "",
    firstName: "",
    lastName: "",
    maternalLastName: "",
    gender: "",
    birthDate: "",
    email: "",
    mobile: "",
    phone: "",
    acceptTerms: false,

    // Domicilio details
    address: "",
    addressDetails: "",
    district: "",
    reference: "",
    latitude: 0,
    longitude: 0,
  })

  // Actualizar el tipo de servicio cuando cambia initialServiceType
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      serviceType: initialServiceType,
    }))
  }, [initialServiceType])

  const locations = [
    "Sede Armendáriz (Av. Armendáriz 500, Miraflores)",
    "Sede San Isidro",
    "Sede Miraflores",
    "Sede San Borja",
    "Sede La Molina",
  ]

  const districts = [
    "Miraflores",
    "San Isidro",
    "Barranco",
    "Surco",
    "San Borja",
    "La Molina",
    "Jesús María",
    "Lince",
    "Magdalena",
    "Pueblo Libre",
    "San Miguel",
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    })
  }

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng,
    })
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    onComplete(formData)
  }

  const isStep1Valid = () => {
    if (formData.serviceType === "sede") {
      return formData.date && formData.location && formData.timeSlot
    } else {
      return formData.date && formData.timeSlot && formData.address && formData.district
    }
  }

  const isStep2Valid = () => {
    return (
      formData.documentNumber &&
      formData.firstName &&
      formData.lastName &&
      formData.maternalLastName &&
      formData.gender &&
      formData.email &&
      formData.mobile &&
      formData.acceptTerms
    )
  }

  // Resetear la ubicación cuando cambia el tipo de servicio
  useEffect(() => {
    if (formData.serviceType === "sede") {
      setFormData((prev) => ({
        ...prev,
        address: "",
        addressDetails: "",
        district: "",
        reference: "",
        latitude: 0,
        longitude: 0,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        location: "",
      }))
    }
  }, [formData.serviceType])

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
                    <Label htmlFor="domicilio">Atención a domicilio</Label>
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
                      ISOWeek
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeSlot" className="font-medium">
                    Elige un turno *
                  </Label>
                  <div className="mt-2 grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.timeSlot === time ? "default" : "outline"}
                        className={`text-sm ${formData.timeSlot === time ? "bg-blue-600" : ""}`}
                        onClick={() => setFormData({ ...formData, timeSlot: time })}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {formData.serviceType === "sede" ? (
                <div>
                  <Label htmlFor="location" className="font-medium">
                    Escoge la sede para la cita *
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
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
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Selecciona tu ubicación en el mapa *</Label>
                    <div className="mt-2">
                      <GoogleMapPicker onLocationSelect={handleLocationSelect} initialAddress={formData.address} />
                    </div>
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
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-900 mb-2">Datos del paciente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="documentType" className="text-sm">
                      Tipo *
                    </Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                    >
                      <SelectTrigger id="documentType" className="mt-1">
                        <SelectValue placeholder="Tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="CE">Carné de Extranjería</SelectItem>
                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="documentNumber" className="text-sm">
                      N° Documento *
                    </Label>
                    <Input
                      id="documentNumber"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={handleInputChange}
                      placeholder="Su documento"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm">
                    Nombres *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Sus nombres"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">
                    Apellido paterno *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Su primer apellido"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maternalLastName" className="text-sm">
                    Apellido materno *
                  </Label>
                  <Input
                    id="maternalLastName"
                    name="maternalLastName"
                    value={formData.maternalLastName}
                    onChange={handleInputChange}
                    placeholder="Su segundo apellido"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender" className="text-sm">
                    Género *
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="gender" className="mt-1">
                      <SelectValue placeholder="Elija el género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthDate" className="text-sm">
                    Fecha de nacimiento *
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Su correo electrónico"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mobile" className="text-sm">
                    Móvil *
                  </Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Su móvil"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Su fijo"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  He leído y acepto el tratamiento de mis datos personales para finalidades adicionales
                </Label>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-[#1E5FAD] text-[#1E5FAD] hover:bg-[#1E5FAD]/10"
              >
                Anterior
              </Button>
              <Button onClick={handleNext} disabled={!isStep1Valid()} className="bg-[#1E5FAD] hover:bg-[#3DA64A]">
                Siguiente
              </Button>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-[#1E5FAD] text-[#1E5FAD] hover:bg-[#1E5FAD]/10"
              >
                Anterior
              </Button>
              <Button onClick={handleSubmit} disabled={!isStep2Valid()} className="bg-[#1E5FAD] hover:bg-[#3DA64A]">
                Siguiente
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

