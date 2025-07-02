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
import { useDynamicPricing } from "@/hooks/use-dynamic-pricing"

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
  const { getExamPrice, formatPrice, canSeePrice } = useDynamicPricing()
  const [mounted, setMounted] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<{ price: number; tariff_name: string } | null>(null)
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

  // Cargar precio dinámico cuando se abra el modal
  useEffect(() => {
    if (isOpen && analysis?.id) {
      const loadPrice = async () => {
        try {
          const priceInfo = await getExamPrice(analysis.id.toString())
          setCurrentPrice(priceInfo)
        } catch (error) {
          console.error('Error loading dynamic price:', error)
          setCurrentPrice(null)
        }
      }
      loadPrice()
    }
  }, [isOpen, analysis?.id, getExamPrice])

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
    
    // Usar precio dinámico si está disponible, sino usar precio legacy
    const finalPrice = currentPrice ? currentPrice.price : analysis.price
    
    addItem({
      id: analysis.id,
      name: analysis.name,
      price: finalPrice,
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
        
        {/* Mostrar precio usando sistema dinámico de tarifas */}
        {canSeePrice() && (
          <div className="bg-blue-50 -mx-6 px-6 py-2 text-right text-sm">
            {currentPrice ? (
              <>
                <span className="font-medium">
                  Precio: {formatPrice(currentPrice.price)}
                </span>
                <span className="text-gray-600"> (incluido IGV)</span>
                {currentPrice.tariff_name && (
                  <div className="text-xs text-gray-500 mt-1">
                    Tarifa: {currentPrice.tariff_name}
                  </div>
                )}
              </>
            ) : (
              // Fallback a precio legacy si no se puede cargar precio dinámico
              <>
                <span className="font-medium">
                  Precio: S/. {analysis.price.toFixed(2)}
                </span>
                <span className="text-gray-600"> (incluido IGV)</span>
                <div className="text-xs text-gray-500 mt-1">
                  Precio base
                </div>
              </>
            )}
          </div>
        )}
        
        <div className="space-y-4 pt-2">
          {/* 1. CONDICIONES PREANALÍTICAS */}
          <div>
            <h4 className="font-medium mb-1">Condiciones</h4>
            <p className="text-gray-600 text-sm">{analysis.conditions}</p>
          </div>
          
          {/* 2. CONTENEDOR */}
          <div>
            <h4 className="font-medium mb-1">Protocolo toma muestra</h4>
            <p className="text-gray-600 text-sm">{analysis.protocol}</p>
          </div>
          
          {/* 3. MUESTRA REQUERIDA */}
          <div>
            <h4 className="font-medium mb-1">Muestra preferida</h4>
            <p className="text-gray-600 text-sm">{analysis.sample}</p>
          </div>
          
          {/* 4. CANTIDAD DE MUESTRA */}
          <div>
            <h4 className="font-medium mb-1">Comentarios</h4>
            <p className="text-gray-600 text-sm">{analysis.comments}</p>
          </div>
          
          {/* 5. TIEMPO DE ENTREGA */}
          <div>
            <h4 className="font-medium mb-1">⏱️ Tiempo de entrega</h4>
            <p className="text-green-600 text-sm font-medium">{analysis.deliveryTime}</p>
          </div>
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

