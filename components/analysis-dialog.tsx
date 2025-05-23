"use client"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"

interface AnalysisDialogProps {
  isOpen: boolean
  onClose: () => void
  analysis: {
    id: number
    name: string
    price: number
    conditions: string
    sample: string
    protocol: string
    suggestions?: string
    comments?: string
  } | null
  user: any
}

export function AnalysisDialog({ isOpen, onClose, analysis, user }: AnalysisDialogProps) {
  const { addItem } = useCart()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "",
    documentType: "DNI",
    documentNumber: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    reference: "",
    serviceType: "sede",
    location: "",
    date: "",
    time: "",
    observations: "",
    latitude: 0,
    longitude: 0,
  })

  const districts = [
    "Miraflores", "San Isidro", "Barranco", "Surco", "San Borja", "La Molina",
    "Jesús María", "Lince", "Magdalena", "Pueblo Libre", "San Miguel",
  ]

  const locations = [
    "Sede San Juan de Miraflores (Av. Miguel Iglesias 625, San Juan de Miraflores 15824)",
    "Sede Santa Anita (María Parado de Bellido 1109, Santa Anita 15008)",
  ]

  const timeSlots = [
    "07:00", "07:30", "08:00", "08:15", "08:30", "08:45",
    "09:00", "09:15", "09:30", "09:45", "10:00", "10:15",
    "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",
    "12:00", "12:30", "13:30", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:45", "16:00", "16:15", "16:30",
    "16:45", "17:00", "17:15"
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Reset form when analysis changes or dialog opens/closes, if user is present
    if (user && analysis && isOpen) {
      setFormData({
        patientName: "", patientAge: "", patientGender: "", documentType: "DNI", documentNumber: "",
        email: "", phone: "", address: "", district: "", reference: "", serviceType: "sede",
        location: "", date: "", time: "", observations: "", latitude: 0, longitude: 0,
      })
    }
  }, [isOpen, analysis?.id, user?.id]) // Use stable identifiers instead of full objects

  if (!mounted || !analysis) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!user) return;
    addItem({
      id: analysis.id,
      name: analysis.name,
      price: analysis.price,
      patientDetails: formData,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={user ? "max-w-2xl" : "max-w-lg"}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-lg font-medium pr-8">{analysis.name}</DialogTitle>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {user && (
          <div className="bg-blue-50 -mx-6 px-6 py-2 text-right text-sm">
            Precio S/. {analysis.price.toFixed(2)} incluido IGV
          </div>
        )}
        
        <div className="space-y-4 pt-2">
          <div>
            <h4 className="font-medium mb-1">Condiciones (ayunas)</h4>
            <p className="text-gray-600 text-sm">{analysis.conditions}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Muestra preferida</h4>
            <p className="text-gray-600 text-sm">{analysis.sample}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Protocolo toma muestra</h4>
            <p className="text-gray-600 text-sm">{analysis.protocol}</p>
          </div>
          {analysis.suggestions && (
            <div>
              <h4 className="font-medium mb-1">Análisis sugeridos</h4>
              <p className="text-gray-600 text-sm">{analysis.suggestions}</p>
            </div>
          )}
          {analysis.comments && (
            <div>
              <h4 className="font-medium mb-1">Comentarios</h4>
              <p className="text-gray-600 text-sm">{analysis.comments || "(ninguno)"}</p>
            </div>
          )}

          {user && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-4">Datos del Paciente</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="documentType">Tipo de Documento</Label>
                    <Select value={formData.documentType} onValueChange={(value) => handleSelectChange("documentType", value)}>
                      <SelectTrigger id="documentType"><SelectValue placeholder="Tipo de documento" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="CE">Carné de Extranjería</SelectItem>
                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="documentNumber">Número de Documento</Label>
                    <Input id="documentNumber" name="documentNumber" value={formData.documentNumber} onChange={handleInputChange} placeholder="Ingrese número" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patientName">Nombre Completo</Label>
                  <Input id="patientName" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="Ingrese nombre completo" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientAge">Edad</Label>
                    <Input id="patientAge" name="patientAge" value={formData.patientAge} onChange={handleInputChange} placeholder="Edad" type="number"/>
                  </div>
                  <div>
                    <Label htmlFor="patientGender">Género</Label>
                    <Select value={formData.patientGender} onValueChange={(value) => handleSelectChange("patientGender", value)}>
                      <SelectTrigger id="patientGender"><SelectValue placeholder="Seleccione género" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                         <SelectItem value="O">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Número de contacto" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="serviceType">Tipo de Servicio</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleSelectChange("serviceType", value)}>
                    <SelectTrigger id="serviceType"><SelectValue placeholder="Seleccione tipo de servicio" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sede">Atención en sede</SelectItem>
                      <SelectItem value="domicilio">Atención a domicilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.serviceType === "sede" ? (
                  <div>
                    <Label htmlFor="location">Sede</Label>
                    <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                      <SelectTrigger id="location"><SelectValue placeholder="Seleccione una sede" /></SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="address">Dirección completa</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ingrese su dirección completa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">Distrito</Label>
                      <Select value={formData.district} onValueChange={(value) => handleSelectChange("district", value)}>
                        <SelectTrigger id="district"><SelectValue placeholder="Seleccione distrito" /></SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (<SelectItem key={district} value={district}>{district}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reference">Referencia</Label>
                      <Input id="reference" name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Referencias para ubicar la dirección (piso, departamento, etc.)" />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Fecha</Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Select value={formData.time} onValueChange={(value) => handleSelectChange("time", value)}>
                      <SelectTrigger id="time"><SelectValue placeholder="Seleccione hora" /></SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (<SelectItem key={time} value={time}>{time}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observations">Observaciones</Label>
                  <Input id="observations" name="observations" value={formData.observations} onChange={handleInputChange} placeholder="Observaciones adicionales" />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          {user ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-[#3DA64A] hover:bg-[#1E5FAD]">
                Agregar al Carrito
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

