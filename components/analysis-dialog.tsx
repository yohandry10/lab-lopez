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

// Función para obtener tiempo de entrega según categoría
const getDeliveryTimeByCategory = (category: string, analysisName?: string): string => {
  // Caso especial para ANDROSTENEDIONA
  if (analysisName === "ANDROSTENEDIONA") {
    return "19 días hábiles";
  }
  
  switch (category) {
    case "Bioquímica":
    case "Coagulación":
      return "2-4 horas";
    case "Hematología":
    case "Hormonas":
    case "Marcadores Tumorales":
      return "24-48 horas";
    case "Inmunología":
      return "3-5 días hábiles";
    case "Microbiología":
      return "24-48 horas";
    case "Genética":
      return "10-15 días hábiles";
    case "Nutrición":
      return "24-48 horas";
    default:
      return "24-48 horas";
  }
};

interface AnalysisDialogProps {
  isOpen: boolean
  onClose: () => void
  analysis: {
    id: number
    name: string
    price: number
    reference_price?: number
    show_public?: boolean
    conditions: string
    sample: string
    protocol: string
    suggestions?: string
    comments?: string
    category: string
    deliveryTime?: string
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
    "Sede San Juan de Miraflores (dentro la Clínica Sagrada Familia del Sur) (Av. Miguel Iglesias 625, San Juan de Miraflores 15824)",
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{analysis.name}</DialogTitle>
        </DialogHeader>
        
        {/* Mostrar precio según segmentación de roles */}
        {(user || analysis.show_public) && (
        <div className="bg-blue-50 -mx-6 px-6 py-2 text-right text-sm">
            {/* Precio para usuarios NO logueados (público) */}
            {!user && analysis.show_public && (
              <>
                <span className="font-medium">Precio: S/. {analysis.price.toFixed(2)}</span>
                <span className="text-gray-600"> (incluido IGV)</span>
              </>
            )}
            
            {/* Precio para médicos/empresas (solo análisis NO públicos) */}
            {user && (user.user_type === "doctor" || user.user_type === "company") && (
              <>
                <span className="font-medium">Precio: S/. {(analysis.reference_price || analysis.price * 0.8).toFixed(2)}</span>
                <span className="text-gray-600"> (incluido IGV) - Precio referencial</span>
              </>
            )}
            
            {/* Precio para pacientes autenticados */}
            {user && user.user_type === "patient" && (
              <>
                <span className="font-medium">Precio: S/. {analysis.price.toFixed(2)}</span>
                <span className="text-gray-600"> (incluido IGV)</span>
              </>
            )}
            
            {/* Precio para admin */}
            {user && user.user_type === "admin" && (
              <>
                <span className="font-medium">Precio: S/. {analysis.price.toFixed(2)}</span>
                <span className="text-gray-600"> (incluido IGV)</span>
              </>
            )}
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
          {analysis.deliveryTime && (
            <div>
              <h4 className="font-medium mb-1">⏱️ Tiempo de entrega</h4>
              <p className="text-green-600 text-sm font-medium">{analysis.deliveryTime}</p>
            </div>
          )}
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
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

