"use client"

import { useState, useEffect, useMemo } from "react"
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
import { useDynamicPricing } from "@/hooks/use-dynamic-pricing"
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

interface SelectedAnalysis extends Analysis {
  quantity: number
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

function PriceDisplay({ analysisId }: { analysisId: number }) {
  const { getExamPrice, formatPrice, canSeePrice } = useDynamicPricing()
  const [priceInfo, setPriceInfo] = useState<{ price: number; tariff_name: string } | null>(null)
  useEffect(() => {
    if (!canSeePrice() || !analysisId) return
    getExamPrice(analysisId).then(setPriceInfo)
  }, [analysisId, getExamPrice, canSeePrice])
  if (!canSeePrice()) return null
  if (!priceInfo) return <span className="text-xs text-gray-500">No disponible</span>
  return <span className="font-medium text-blue-600">{formatPrice(priceInfo.price)}</span>
}

export function HeroSchedulingDialog({ isOpen, onClose }: HeroSchedulingDialogProps) {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState("sede")
  const [programmingType, setProgrammingType] = useState("horario")
  const [selectedTest, setSelectedTest] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([])
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([])
  const [selectedAnalyses, setSelectedAnalyses] = useState<SelectedAnalysis[]>([])
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false)
  // Si ya se escogió programación una vez, no la volvemos a pedir
  const [hasScheduled, setHasScheduled] = useState<boolean>(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [patientName, setPatientName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysisPrices, setAnalysisPrices] = useState<Record<string, { price: number; tariff_name: string }>>({})
  const { addItem } = useCart()
  const { user } = useAuth()
  const { getExamPrice, formatPrice, canSeePrice } = useDynamicPricing()

  useEffect(() => {
    if (isOpen) {
      fetchAnalyses()
    }
  }, [isOpen])

  const loadAnalysisPrices = async (analyses: Analysis[]) => {
    const pricesMap: Record<string, { price: number; tariff_name: string }> = {}
    
    for (const analysis of analyses.slice(0, 20)) {
      try {
        const priceInfo = await getExamPrice(analysis.id.toString())
        if (priceInfo) {
          pricesMap[analysis.id.toString()] = {
            price: priceInfo.price,
            tariff_name: priceInfo.tariff_name
          }
        }
      } catch (error) {
        console.error(`Error loading price for analysis ${analysis.id}:`, error)
      }
    }
    
    setAnalysisPrices(pricesMap)
  }

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
      
      setFilteredAnalyses(filtered.slice(0, 10))
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
        
        const filteredByRole = mappedAnalyses.filter(analysis => {
          if (!user) {
            return analysis.show_public === true
          } else {
            switch (user.user_type) {
              case "admin":
                return true
              case "patient":
                return true
              case "doctor":
              case "company":
                return analysis.show_public !== true
              default:
                return true
            }
          }
        })
        
        setAllAnalyses(filteredByRole)
        console.log("📋 Primeros 3 análisis:", mappedAnalyses.slice(0, 3))
        
        loadAnalysisPrices(filteredByRole)
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
    if (selectedAnalyses.length === 0) return

    // Si ya existe programación previa, saltamos el modal de horarios
    if (typeof window !== 'undefined' && localStorage.getItem('scheduling-data')) {
      addAnalysesDirectlyToCart()
    } else {
      onClose()
      setIsSchedulingOpen(true)
    }
  }

  const handleScheduleComplete = (data: PatientFormData) => {
    setIsSchedulingOpen(false)

    // Marcamos que ya se programó al menos una vez
    setHasScheduled(true)

    const fullName = `${data.firstName} ${data.lastName}`
    setPatientName(fullName)

    selectedAnalyses.forEach(analysis => {
      const dynamicPrice = analysisPrices[analysis.id.toString()]
      const finalPrice = dynamicPrice ? dynamicPrice.price : analysis.price
      
      addItem({
        id: analysis.id,
        name: analysis.name,
        price: finalPrice,
        patientDetails: data,
      })
    })

    setIsSuccessOpen(true)
  }

  // Utilidad para agregar análisis seleccionados al carrito sin volver a preguntar horarios
  const addAnalysesDirectlyToCart = () => {
    if (selectedAnalyses.length === 0) return

    // Intentar recuperar datos de paciente y nombre previamente guardados
    let storedPatient: any = null
    if (typeof window !== 'undefined') {
      try {
        storedPatient = JSON.parse(localStorage.getItem('patient-data') || 'null')
      } catch {}
    }

    const fullName = storedPatient ? `${storedPatient.firstName || ''} ${storedPatient.lastName || ''}`.trim() : patientName
    if (fullName) setPatientName(fullName)

    selectedAnalyses.forEach((analysis) => {
      const dynamicPrice = analysisPrices[analysis.id.toString()]
      const finalPrice = dynamicPrice ? dynamicPrice.price : analysis.price

      addItem({
        id: analysis.id,
        name: analysis.name,
        price: finalPrice,
        patientDetails: storedPatient || {},
        quantity: analysis.quantity,
      })
    })

    setIsSuccessOpen(true)
  }

  const handleSuccessClose = () => {
    setIsSuccessOpen(false)
    setSelectedAnalyses([])
    setSearchTerm("")
  }

  const handleSelectAnalysis = (analysis: Analysis) => {
    console.log("✅ Análisis seleccionado:", analysis)
    const existing = selectedAnalyses.find(item => item.id === analysis.id)

    if (existing) {
      // increment quantity
      setSelectedAnalyses(selectedAnalyses.map(item => item.id === analysis.id ? {...item, quantity: item.quantity + 1} : item))
    } else {
      setSelectedAnalyses([...selectedAnalyses, {...analysis, quantity: 1}])
    }

    setSearchTerm("")
    setFilteredAnalyses([])
  }

  const handleRemoveAnalysis = (analysisId: number) => {
    const existing = selectedAnalyses.find(a => a.id === analysisId)
    if (!existing) return
    if (existing.quantity === 1) {
      // remove item
      setSelectedAnalyses(selectedAnalyses.filter(a => a.id !== analysisId))
    } else {
      // decrement
      setSelectedAnalyses(selectedAnalyses.map(a => a.id === analysisId ? {...a, quantity: a.quantity - 1} : a))
    }
  }

  const calculateTotal = () => {
    return selectedAnalyses.reduce((total, analysis) => {
      const dynamicPrice = analysisPrices[analysis.id.toString()]
      const finalPrice = dynamicPrice ? dynamicPrice.price : analysis.price
      return total + finalPrice * analysis.quantity
    }, 0)
  }

  const quotationItems = selectedAnalyses.map((analysis) => {
    const dynamicPrice = analysisPrices[analysis.id.toString()]
    const finalPrice = dynamicPrice ? dynamicPrice.price : analysis.price
    return { name: `${analysis.name} x${analysis.quantity}`, price: canSeePrice() ? finalPrice * analysis.quantity : undefined }
  })

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{user ? "PROGRAMA TU RECOJO" : "AGENDA TU ANÁLISIS"}</DialogTitle>
            <DialogDescription>Busca y selecciona los análisis para programar el recojo de muestras</DialogDescription>
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
              
              {filteredAnalyses.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto border rounded-md bg-white shadow-lg">
                  {filteredAnalyses.map((analysis) => {
                    const isSelected = selectedAnalyses.some(selected => selected.id === analysis.id)
                    return (
                      <button
                        key={analysis.id}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-100 border-b last:border-b-0 focus:outline-none focus:bg-gray-100 ${
                          isSelected ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => handleSelectAnalysis(analysis)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {analysis.name}
                              {isSelected && <span className="text-blue-600 text-sm">✓ Seleccionado</span>}
                            </div>
                            <div className="text-sm text-gray-600">{analysis.category}</div>
                          </div>
                          {canSeePrice() && (
                            <PriceDisplay analysisId={analysis.id} />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
              
              {searchTerm && filteredAnalyses.length === 0 && allAnalyses.length > 0 && (
                <div className="mt-2 p-3 text-center text-gray-500 text-sm border rounded-md">
                  No se encontraron análisis que coincidan con "{searchTerm}"
                </div>
              )}
              
              {selectedAnalyses.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label className="font-medium">Análisis seleccionados:</Label>
                  {selectedAnalyses.map((analysis) => {
                    const dynamicPrice = analysisPrices[analysis.id.toString()]
                    const finalPrice = dynamicPrice ? dynamicPrice.price : analysis.price
                    return (
                      <div key={analysis.id} className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div>
                          <div className="font-medium text-blue-900 truncate max-w-[140px] sm:max-w-none">{analysis.name}</div>
                          <div className="text-sm text-blue-700">{analysis.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {canSeePrice() && (
                            <span className="text-blue-900 text-sm font-medium">S/. {(finalPrice * analysis.quantity).toFixed(2)}</span>
                          )}
                          <button
                            onClick={() => handleSelectAnalysis(analysis)}
                            className="text-green-600 hover:text-green-800 text-lg leading-none px-1"
                            title="Agregar uno más"
                          >
                            +
                          </button>
                          <button
                            onClick={() => setSelectedAnalyses(selectedAnalyses.filter(a => a.id !== analysis.id))}
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
                      <div className="font-bold text-purple-900 text-lg">
                        TOTAL: {selectedAnalyses.reduce((s,a)=>s+a.quantity,0)} {selectedAnalyses.reduce((s,a)=>s+a.quantity,0) === 1 ? 'ANÁLISIS' : 'ANÁLISIS'} - S/. {calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="font-medium">Tipo de programaciones *</Label>
              <RadioGroup value={programmingType} onValueChange={setProgrammingType} className="mt-2 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="horario" id="hero-horario" />
                  <Label htmlFor="hero-horario" className="flex items-center gap-2">
                    📅 Según horario <span className="text-sm text-gray-600">(10:00 y 13:00 horas)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgente" id="hero-urgente" />
                  <Label htmlFor="hero-urgente" className="flex items-center gap-2">
                    ⚡ Urgente <span className="text-sm text-orange-600">(cuando la referencia lo necesita)</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="font-medium">Lugar del recojo *</Label>
              <RadioGroup value={serviceType} onValueChange={setServiceType} className="mt-2 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sede" id="hero-sede" />
                  <Label htmlFor="hero-sede" className="flex items-center gap-2">
                    🏥 Recojo en sede
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domicilio" id="hero-domicilio" />
                  <Label htmlFor="hero-domicilio" className="flex items-center gap-2">
                    🏠 Recojo a domicilio <Home className="h-4 w-4" />
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={selectedAnalyses.length === 0} 
              className="bg-[#1E5FAD] hover:bg-[#3DA64A]"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedAnalyses.length > 0 && (
        <SchedulingFlow
          isOpen={isSchedulingOpen}
          onClose={() => setIsSchedulingOpen(false)}
          onComplete={handleScheduleComplete}
          testName={selectedAnalyses.map(analysis => analysis.name).join(', ')}
          initialServiceType={serviceType}
          programmingType={programmingType}
          initialSelectedAnalyses={selectedAnalyses}
          onAnalysesChange={(analyses) => setSelectedAnalyses(analyses)}
        />
      )}

      <SuccessDialog
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        testName={selectedAnalyses.map((a) => a.name).join(', ')}
        patientName={patientName}
        onContinueShopping={handleSuccessClose}
        onNewPatient={handleSuccessClose}
        onViewCart={() => {
          handleSuccessClose()
          window.location.href = "/carrito"
        }}
        items={quotationItems}
        showWhatsAppButton={!user}
      />
    </>
  )
}

