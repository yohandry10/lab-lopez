"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { SchedulingFlow } from "./scheduling-flow"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { SuccessDialog } from "./success-dialog"
import { Home, Search } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"

interface HeroSchedulingDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface Analysis {
  id: number
  name: string
  price: number
  reference_price?: number
  show_public?: boolean
  category?: string
}

interface PatientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  birthDate: string
  gender: string
  address?: string
  district?: string
  province?: string
  department?: string
  reference?: string
  coordinates?: {
    lat: number
    lng: number
    address: string
  }
}

export function HeroSchedulingDialog({ isOpen, onClose }: HeroSchedulingDialogProps) {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState("sede")
  const [selectedTest, setSelectedTest] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([])
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [patientName, setPatientName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()

  // Cargar análisis desde Supabase al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchAnalyses()
    }
  }, [isOpen])

  // Filtrar análisis basado en la búsqueda
  useEffect(() => {
    console.log("🔍 Filtrado:", { searchTerm, allAnalysesCount: allAnalyses.length })
    
    if (searchTerm.trim() === "") {
      setFilteredAnalyses([])
      console.log("❌ Búsqueda vacía, limpiando resultados")
    } else {
      const filtered = allAnalyses.filter(analysis => {
        const nameMatch = analysis.name.toLowerCase().includes(searchTerm.toLowerCase())
        const categoryMatch = analysis.category && analysis.category.toLowerCase().includes(searchTerm.toLowerCase())
        return nameMatch || categoryMatch
      })
      
      console.log("📋 Resultados filtrados:", {
        searchTerm,
        totalAnalyses: allAnalyses.length,
        filtered: filtered.length,
        firstResults: filtered.slice(0, 3).map(a => a.name)
      })
      
      setFilteredAnalyses(filtered.slice(0, 10)) // Limitar a 10 resultados
    }
  }, [searchTerm, allAnalyses])

  const fetchAnalyses = async () => {
    console.log("🔄 Cargando análisis desde base de datos...")
    setIsLoading(true)
    
    try {
      const supabase = getSupabaseClient()
      console.log("🔌 Conectando con Supabase...")
      
      const { data, error } = await supabase
        .from("analyses")
        .select("id, name, price, reference_price, show_public, category")
        .order("name", { ascending: true })

      console.log("📊 Respuesta de Supabase:", { data: data?.length, error })

      if (error) {
        console.error("❌ Error cargando análisis desde Supabase:", error)
        setAllAnalyses([])
        return
      }

      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Datos cargados desde BD:", data.length, "análisis")
        const mappedAnalyses: Analysis[] = data.map(item => ({
          id: Number(item.id),
          name: String(item.name || '').trim(),
          price: Number(item.price || 0),
          reference_price: item.reference_price ? Number(item.reference_price) : undefined,
          show_public: Boolean(item.show_public),
          category: String(item.category || '').trim()
        }))
        
        // Aplicar segmentación de precios según rol de usuario
        const filteredByRole = mappedAnalyses.filter(analysis => {
          if (!user) {
            // Usuario NO logueado: solo ve análisis públicos
            return analysis.show_public === true
          } else {
            // Usuarios autenticados: lógica por rol
            switch (user.user_type) {
              case "admin":
                return true // Admin ve todos
              case "patient":
                return true // Pacientes ven todos
              case "doctor":
              case "company":
                // Médicos/Empresas NO ven análisis marcados como públicos
                return analysis.show_public !== true
              default:
                return true
            }
          }
        })
        
        setAllAnalyses(filteredByRole)
        console.log("📋 Primeros 3 análisis:", mappedAnalyses.slice(0, 3))
      } else {
        console.log("⚠️ No hay datos en la base de datos")
        setAllAnalyses([])
      }
    } catch (err) {
      console.error("💥 Error conectando con Supabase:", err)
      setAllAnalyses([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (selectedAnalysis) {
      onClose()
      setIsSchedulingOpen(true)
    }
  }

  const handleScheduleComplete = (data: PatientFormData) => {
    setIsSchedulingOpen(false)

    // Extract patient name from form data
    const fullName = `${data.firstName} ${data.lastName}`
    setPatientName(fullName)

    // Add item to cart with correct price based on user role
    if (selectedAnalysis) {
      let priceToUse = selectedAnalysis.price // Default to public price
      
      // Determine price based on user role
      if (user && (user.user_type === "doctor" || user.user_type === "company")) {
        priceToUse = selectedAnalysis.reference_price || selectedAnalysis.price * 0.8
      }
      
      addItem({
        id: selectedAnalysis.id,
        name: selectedAnalysis.name,
        price: priceToUse,
        patientDetails: data,
      })
    }

    // Show success dialog
    setIsSuccessOpen(true)
  }

  const handleSuccessClose = () => {
    setIsSuccessOpen(false)
    setSelectedAnalysis(null)
    setSearchTerm("")
    setServiceType("sede")
  }

  const handleSelectAnalysis = (analysis: Analysis) => {
    console.log("✅ Análisis seleccionado:", analysis)
    setSelectedAnalysis(analysis)
    setSearchTerm("")
    setFilteredAnalyses([])
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agenda tu análisis</DialogTitle>
            <DialogDescription>Busca y selecciona el análisis que necesitas</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div>
              <Label className="font-medium">Buscar análisis</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Escribe el nombre del análisis..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Información de estado */}
              {isLoading && (
                <div className="mt-1 text-xs text-blue-600">
                  🔄 Cargando análisis desde base de datos...
                </div>
              )}
              
              {!isLoading && allAnalyses.length === 0 && (
                <div className="mt-1 text-xs text-red-600">
                  ❌ No se pudieron cargar análisis desde la base de datos
                </div>
              )}
              
              {!isLoading && allAnalyses.length > 0 && searchTerm && filteredAnalyses.length > 0 && (
                <div className="mt-1 text-xs text-green-600">
                  ✅ Encontrados {filteredAnalyses.length} análisis
                </div>
              )}
              
              {/* Resultados de búsqueda */}
              {filteredAnalyses.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto border rounded-md bg-white shadow-lg">
                  {filteredAnalyses.map((analysis) => (
                    <button
                      key={analysis.id}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
                      onClick={() => handleSelectAnalysis(analysis)}
                    >
                      <div className="font-medium text-gray-900">{analysis.name}</div>
                      <div className="text-sm text-gray-600 flex justify-between">
                        <span>{analysis.category}</span>
                        {/* Mostrar precio según rol de usuario */}
                        {!user && analysis.show_public && (
                          <span className="font-medium text-green-600">S/. {analysis.price.toFixed(2)}</span>
                        )}
                        {user && (user.user_type === "doctor" || user.user_type === "company") && (
                          <span className="font-medium text-blue-600">S/. {(analysis.reference_price || analysis.price * 0.8).toFixed(2)}</span>
                        )}
                        {user && (user.user_type === "patient" || user.user_type === "admin") && (
                          <span className="font-medium text-green-600">S/. {analysis.price.toFixed(2)}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Mensaje cuando no hay resultados pero sí hay búsqueda */}
              {searchTerm && filteredAnalyses.length === 0 && allAnalyses.length > 0 && !selectedAnalysis && (
                <div className="mt-2 p-3 text-center text-gray-500 text-sm border rounded-md">
                  No se encontraron análisis que coincidan con "{searchTerm}"
                </div>
              )}
              
              {/* Análisis seleccionado */}
              {selectedAnalysis && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="font-medium text-blue-900">{selectedAnalysis.name}</div>
                  <div className="text-sm text-blue-700 flex justify-between">
                    <span>{selectedAnalysis.category}</span>
                    {/* Mostrar precio según rol de usuario */}
                    {!user && selectedAnalysis.show_public && (
                      <span className="font-medium">S/. {selectedAnalysis.price.toFixed(2)}</span>
                    )}
                    {user && (user.user_type === "doctor" || user.user_type === "company") && (
                      <span className="font-medium">S/. {(selectedAnalysis.reference_price || selectedAnalysis.price * 0.8).toFixed(2)}</span>
                    )}
                    {user && (user.user_type === "patient" || user.user_type === "admin") && (
                    <span className="font-medium">S/. {selectedAnalysis.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label className="font-medium">Tipo de atención</Label>
              <RadioGroup value={serviceType} onValueChange={setServiceType} className="mt-2 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sede" id="hero-sede" />
                  <Label htmlFor="hero-sede" className="flex items-center gap-2">
                    Atención en sede
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domicilio" id="hero-domicilio" />
                  <Label htmlFor="hero-domicilio" className="flex items-center gap-2">
                    Atención a domicilio <Home className="h-4 w-4" />
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleNext} disabled={!selectedAnalysis} className="bg-[#1E5FAD] hover:bg-[#3DA64A]">
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedAnalysis && (
        <SchedulingFlow
          isOpen={isSchedulingOpen}
          onClose={() => setIsSchedulingOpen(false)}
          onComplete={handleScheduleComplete}
          testName={selectedAnalysis.name}
          initialServiceType={serviceType}
        />
      )}

      <SuccessDialog
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        testName={selectedAnalysis?.name || ""}
        patientName={patientName}
        onContinueShopping={handleSuccessClose}
        onNewPatient={handleSuccessClose}
        onViewCart={() => {
          handleSuccessClose()
          window.location.href = "/carrito"
        }}
      />
    </>
  )
}

