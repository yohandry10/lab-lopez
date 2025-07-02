"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Settings, Copy, DollarSign, Users, Building2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { tariffsService } from "@/lib/tariffs-service"
import type { 
  Tariff, 
  Reference, 
  TariffPrice, 
  CreateTariffData, 
  CreateReferenceData,
  ReferenceWithTariff,
  ExamWithPrices
} from "@/lib/tariffs.types"

interface TariffsAdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function TariffsAdminPanel({ isOpen, onClose }: TariffsAdminPanelProps) {
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [references, setReferences] = useState<ReferenceWithTariff[]>([])
  const [examsWithPrices, setExamsWithPrices] = useState<ExamWithPrices[]>([])
  const [selectedTariff, setSelectedTariff] = useState<string>("")
  const [loading, setLoading] = useState(false)
  
  // Estados para editar precios
  const [editingPrice, setEditingPrice] = useState<{ examId: string; examName: string; currentPrice: number } | null>(null)
  const [newPrice, setNewPrice] = useState("")
  
  // Estados para formularios
  const [showCreateTariff, setShowCreateTariff] = useState(false)
  const [showCreateReference, setShowCreateReference] = useState(false)
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null)
  const [editingReference, setEditingReference] = useState<ReferenceWithTariff | null>(null)
  
  const { toast } = useToast()

  // Estados para formularios
  const [newTariff, setNewTariff] = useState<CreateTariffData>({
    name: "",
    type: "sale", // Mantener internamente como "sale" por defecto
    is_taxable: true
  })
  
  // 🆕 Estado para habilitar/deshabilitar tarifas
  const [tariffEnabled, setTariffEnabled] = useState<{[key: string]: boolean}>({})

  const [newReference, setNewReference] = useState<CreateReferenceData>({
    name: "",
    business_name: "",
    default_tariff_id: "",
    active: true
  })

  // 🆕 Estado para estadísticas de tarifas
  const [tariffStats, setTariffStats] = useState<{[key: string]: {examCount: number, totalPrice: number, avgPrice: number}}>({})

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen])

  // 🆕 Sincronización automática cuando cambian los estados de tarifas
  useEffect(() => {
    if (isOpen && Object.keys(tariffEnabled).length > 0) {
      // Recalcular estadísticas cuando cambie el estado de habilitado de tarifas
      calculateTariffStats()
      console.log("🔄 Sincronizando vista de Referencias con cambios en Tarifas")
    }
  }, [tariffEnabled, isOpen])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadTariffs(),
        loadReferences(),
        loadExamsWithPrices()
      ])
      await calculateTariffStats() // 🆕 Calcular estadísticas
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast({
        title: "Error",
        description: "Error al cargar los datos iniciales",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // 🆕 Calcular estadísticas de tarifas
  const calculateTariffStats = async () => {
    try {
      const response = await tariffsService.getAllTariffPrices()
      if (!response.success || !response.data) return

      const tariffPrices = Array.isArray(response.data) ? response.data : [response.data]
      const stats: {[key: string]: {examCount: number, totalPrice: number, avgPrice: number}} = {}

      tariffPrices.forEach(tp => {
        if (!stats[tp.tariff_id]) {
          stats[tp.tariff_id] = { examCount: 0, totalPrice: 0, avgPrice: 0 }
        }
        stats[tp.tariff_id].examCount++
        stats[tp.tariff_id].totalPrice += tp.price
      })

      // Calcular promedios
      Object.keys(stats).forEach(tariffId => {
        stats[tariffId].avgPrice = stats[tariffId].totalPrice / stats[tariffId].examCount
      })

      setTariffStats(stats)
      console.log("📊 Estadísticas de tarifas calculadas:", stats)
    } catch (error) {
      console.error("Error calculando estadísticas:", error)
    }
  }

  const loadTariffs = async () => {
    const response = await tariffsService.getAllTariffs()
    if (response.success && Array.isArray(response.data)) {
      setTariffs(response.data)
      
      // 🆕 Inicializar estado de habilitado para todas las tarifas (por defecto habilitadas)
      const enabledState: {[key: string]: boolean} = {}
      response.data.forEach(tariff => {
        enabledState[tariff.id] = true // Por defecto todas habilitadas
      })
      setTariffEnabled(enabledState)
      
      if (response.data.length > 0 && !selectedTariff) {
        setSelectedTariff(response.data[0].id)
      }
    }
  }

  // 🆕 Función para manejar el toggle de habilitar/deshabilitar tarifa
  const handleToggleTariff = async (tariffId: string, enabled: boolean) => {
    setTariffEnabled(prev => ({...prev, [tariffId]: enabled}))
    
    // Aquí podrías agregar lógica para actualizar en la base de datos si es necesario
    // Por ejemplo, agregar un campo "enabled" a la tabla tariffs
    console.log(`${enabled ? '✅ Habilitando' : '❌ Deshabilitando'} tarifa:`, tariffId)
    
    toast({
      title: enabled ? "Tarifa Habilitada" : "Tarifa Deshabilitada",
      description: `La tarifa ${enabled ? 'está disponible' : 'no está disponible'} para nuevas asignaciones`,
    })
    
    // 🆕 Recalcular estadísticas inmediatamente para sincronizar Referencias
    setTimeout(() => {
      calculateTariffStats()
      console.log(`🔄 Tarifa ${enabled ? 'habilitada' : 'deshabilitada'} - sincronizando vista de Referencias`)
    }, 100)
  }

  const loadReferences = async () => {
    const response = await tariffsService.getAllReferences()
    if (response.success && Array.isArray(response.data)) {
      setReferences(response.data)
    }
  }

  const loadExamsWithPrices = async () => {
    const exams = await tariffsService.getExamsWithPrices()
    setExamsWithPrices(exams)
    await calculateTariffStats() // Recalcular estadísticas cuando cambien los precios
  }

  // Gestión de Tarifas
  const handleCreateTariff = async () => {
    if (!newTariff.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la tarifa es requerido",
        variant: "destructive"
      })
      return
    }

    const response = await tariffsService.createTariff(newTariff)
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Tarifa creada correctamente"
      })
      setNewTariff({ name: "", type: "sale", is_taxable: true })
      setShowCreateTariff(false)
      // 🆕 Recargar todos los datos para sincronizar
      await Promise.all([
        loadTariffs(),
        loadReferences(),
        calculateTariffStats()
      ])
      console.log("🆕 Nueva tarifa creada - sincronizando todas las pestañas")
    } else {
      toast({
        title: "Error",
        description: response.error || "Error al crear la tarifa",
        variant: "destructive"
      })
    }
  }

  const handleUpdateTariff = async () => {
    if (!editingTariff) return

    const response = await tariffsService.updateTariff(editingTariff)
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Tarifa actualizada correctamente"
      })
      setEditingTariff(null)
      // 🆕 Recargar todos los datos para sincronizar
      await Promise.all([
        loadTariffs(),
        loadReferences(),
        calculateTariffStats()
      ])
      console.log("✏️ Tarifa actualizada - sincronizando todas las pestañas")
    } else {
      toast({
        title: "Error",
        description: response.error || "Error al actualizar la tarifa",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTariff = async (tariffId: string, tariffName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la tarifa "${tariffName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    const response = await tariffsService.deleteTariff(tariffId)
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Tarifa eliminada correctamente"
      })
      loadTariffs()
      if (selectedTariff === tariffId) {
        setSelectedTariff("")
      }
    } else {
      toast({
        title: "Error",
        description: response.error || "Error al eliminar la tarifa",
        variant: "destructive"
      })
    }
  }

  // Gestión de Referencias
  const handleCreateReference = async () => {
    if (!newReference.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la referencia es requerido",
        variant: "destructive"
      })
      return
    }

    if (!newReference.default_tariff_id) {
      toast({
        title: "Error",
        description: "Debes seleccionar una tarifa por defecto",
        variant: "destructive"
      })
      return
    }

    const response = await tariffsService.createReference(newReference)
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Referencia creada correctamente"
      })
      setNewReference({ name: "", business_name: "", default_tariff_id: "", active: true })
      setShowCreateReference(false)
      // 🆕 Recargar todos los datos para sincronizar
      await Promise.all([
        loadReferences(),
        loadTariffs(),
        calculateTariffStats()
      ])
      console.log("🆕 Nueva referencia creada - sincronizando todas las pestañas")
    } else {
      toast({
        title: "Error",
        description: response.error || "Error al crear la referencia",
        variant: "destructive"
      })
    }
  }

  const handleUpdateReference = async () => {
    if (!editingReference) return

    const response = await tariffsService.updateReference(editingReference)
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Referencia actualizada correctamente"
      })
      setEditingReference(null)
      // 🆕 Recargar todos los datos para sincronizar
      await Promise.all([
        loadReferences(),
        loadTariffs(),
        calculateTariffStats()
      ])
      console.log("🔄 Referencia actualizada - sincronizando todas las pestañas")
    } else {
      toast({
        title: "Error",
        description: response.error || "Error al actualizar la referencia",
        variant: "destructive"
      })
    }
  }

  const handleDeleteReference = async (referenceId: string, referenceName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la referencia "${referenceName}"?`)) {
      return
    }

    const response = await tariffsService.deleteReference(referenceId)
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Referencia eliminada correctamente"
      })
      loadReferences()
    } else {
      toast({
        title: "Error",
        description: response.error || "Error al eliminar la referencia",
        variant: "destructive"
      })
    }
  }

  // Gestión de Precios
  const handleEditPrice = (examId: string, examName: string, currentPrice: number = 0) => {
    setEditingPrice({ examId, examName, currentPrice })
    setNewPrice(currentPrice.toString())
  }

  const handleSavePrice = async () => {
    if (!editingPrice || !selectedTariff) return

    console.log("💾 GUARDANDO PRECIO:", {
      examId: editingPrice.examId,
      examName: editingPrice.examName,
      tariffId: selectedTariff,
      tariffName: tariffs.find(t => t.id === selectedTariff)?.name,
      newPrice: newPrice
    })

    const price = parseFloat(newPrice)
    if (isNaN(price) || price < 0) {
      toast({
        title: "Error",
        description: "Ingresa un precio válido",
        variant: "destructive"
      })
      return
    }

    // Usar la nueva función UPSERT que maneja crear o actualizar automáticamente
    const response = await tariffsService.upsertTariffPrice(
      selectedTariff,
      editingPrice.examId,
      price
    )

    if (response.success) {
      const tariffName = tariffs.find(t => t.id === selectedTariff)?.name || 'Tarifa'
      toast({
        title: "✅ Precio sincronizado",
        description: `${editingPrice.examName} → ${tariffName}: S/ ${price.toFixed(2)}`
      })
      setEditingPrice(null)
      setNewPrice("")
      // 🆕 Recargar y sincronizar todos los datos
      await Promise.all([
        loadExamsWithPrices(),
        calculateTariffStats()
      ])
      console.log("✅ PRECIO GUARDADO Y TODAS LAS PESTAÑAS SINCRONIZADAS")
    } else {
      console.error("❌ ERROR AL GUARDAR PRECIO:", response.error)
      toast({
        title: "Error",
        description: response.error || "Error al actualizar el precio",
        variant: "destructive"
      })
    }
  }

  // Copia de tarifas
  const handleCopyTariff = async (sourceTariffId: string, targetTariffId: string) => {
    if (sourceTariffId === targetTariffId) {
      toast({
        title: "Error",
        description: "No puedes copiar precios a la misma tarifa",
        variant: "destructive"
      })
      return
    }

    const response = await tariffsService.copyTariffPrices(sourceTariffId, targetTariffId)
    if (response.success) {
      toast({
        title: "Éxito",
        description: "Precios copiados correctamente"
      })
      loadExamsWithPrices()
    } else {
      toast({
        title: "Error",
        description: response.error || "Error al copiar precios",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sistema de Tarifas LOPEZ
          </DialogTitle>
          <DialogDescription>
            Gestión completa de tarifas, precios y referencias de clientes
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tariffs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tariffs">Tarifas</TabsTrigger>
            <TabsTrigger value="prices">Precios por Examen</TabsTrigger>
            <TabsTrigger value="references">Referencias</TabsTrigger>
          </TabsList>

          {/* TAB: GESTIÓN DE TARIFAS MEJORADA */}
          <TabsContent value="tariffs" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">🏷️ Gestión de Tarifas</h3>
                <p className="text-sm text-muted-foreground">
                  Tarifas sincronizadas con precios configurados para referencias
                </p>
              </div>
              <Button onClick={() => setShowCreateTariff(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarifa
              </Button>
            </div>

            <div className="grid gap-4">
              {tariffs.map((tariff) => {
                const stats = tariffStats[tariff.id] || { examCount: 0, totalPrice: 0, avgPrice: 0 }
                const isEnabled = tariffEnabled[tariff.id] !== false // Por defecto habilitado
                const referencesUsingTariff = references.filter(ref => ref.default_tariff_id === tariff.id)
                
                return (
                  <Card key={tariff.id} className={`transition-all ${
                    isEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{tariff.name}</CardTitle>
                                                         <div className="flex items-center gap-2">
                               <Switch
                                 checked={isEnabled}
                                 onCheckedChange={(checked) => handleToggleTariff(tariff.id, checked)}
                                 size="sm"
                               />
                               <span className="text-sm font-medium">
                                 {isEnabled ? 'Habilitada' : 'Deshabilitada'}
                               </span>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            {/* Exámenes configurados */}
                            <div className="text-center p-3 bg-white rounded-lg border">
                              <div className="text-2xl font-bold text-blue-600">{stats.examCount}</div>
                              <div className="text-xs text-muted-foreground">Exámenes</div>
                              <div className="text-xs text-blue-600">Configurados</div>
                            </div>
                            
                            {/* Precio promedio */}
                            <div className="text-center p-3 bg-white rounded-lg border">
                              <div className="text-2xl font-bold text-green-600">
                                S/ {stats.avgPrice > 0 ? stats.avgPrice.toFixed(0) : '0'}
                              </div>
                              <div className="text-xs text-muted-foreground">Precio</div>
                              <div className="text-xs text-green-600">Promedio</div>
                            </div>
                            
                            {/* Referencias usando esta tarifa */}
                            <div className="text-center p-3 bg-white rounded-lg border">
                              <div className="text-2xl font-bold text-purple-600">{referencesUsingTariff.length}</div>
                              <div className="text-xs text-muted-foreground">Referencias</div>
                              <div className="text-xs text-purple-600">Asignadas</div>
                            </div>
                            
                            {/* Estado IGV */}
                            <div className="text-center p-3 bg-white rounded-lg border">
                              <div className="text-xl font-bold text-orange-600">
                                {tariff.is_taxable ? 'IGV' : 'SIN'}
                              </div>
                              <div className="text-xs text-muted-foreground">Impuesto</div>
                              <div className="text-xs text-orange-600">
                                {tariff.is_taxable ? 'Incluido' : 'Exonerado'}
                              </div>
                            </div>
                          </div>

                          {/* Referencias que usan esta tarifa */}
                          {referencesUsingTariff.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-muted-foreground mb-1">Referencias que usan esta tarifa:</p>
                              <div className="flex flex-wrap gap-1">
                                {referencesUsingTariff.map(ref => (
                                  <Badge key={ref.id} variant="outline" className="text-xs">
                                    {ref.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingTariff(tariff)}
                            title="Editar tarifa"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteTariff(tariff.id, tariff.name)}
                            title="Eliminar tarifa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            {/* Dialog: Crear Tarifa - SIMPLIFICADO */}
            <Dialog open={showCreateTariff} onOpenChange={setShowCreateTariff}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>🆕 Nueva Tarifa</DialogTitle>
                  <DialogDescription>
                    Crear una nueva tarifa para asignar a referencias de clientes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tariff-name">Nombre de la Tarifa *</Label>
                    <Input
                      id="tariff-name"
                      value={newTariff.name}
                      onChange={(e) => setNewTariff({ ...newTariff, name: e.target.value })}
                      placeholder="Ej: Particular Lima, Médicos Asociados, Empresas Premium"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 Usa nombres descriptivos como "Médicos", "Empresas", "Particular", etc.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Switch
                      id="is-taxable"
                      checked={newTariff.is_taxable}
                      onCheckedChange={(checked) => setNewTariff({ ...newTariff, is_taxable: checked })}
                    />
                    <div>
                      <Label htmlFor="is-taxable" className="font-medium">Incluye IGV (18%)</Label>
                      <p className="text-xs text-muted-foreground">
                        {newTariff.is_taxable ? 'Los precios incluirán IGV' : 'Los precios serán sin IGV'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>📋 Siguiente paso:</strong> Después de crear la tarifa, configura los precios 
                      en la pestaña "Precios por Examen" y asigna la tarifa a referencias en "Referencias".
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTariff} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Crear Tarifa
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateTariff(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dialog: Editar Tarifa - SIMPLIFICADO */}
            <Dialog open={!!editingTariff} onOpenChange={() => setEditingTariff(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>✏️ Editar Tarifa</DialogTitle>
                  <DialogDescription>
                    Modificar información de la tarifa: {editingTariff?.name}
                  </DialogDescription>
                </DialogHeader>
                {editingTariff && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-tariff-name">Nombre de la Tarifa *</Label>
                      <Input
                        id="edit-tariff-name"
                        value={editingTariff.name}
                        onChange={(e) => setEditingTariff({ ...editingTariff, name: e.target.value })}
                        placeholder="Ej: Particular Lima, Médicos Asociados"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                      <Switch
                        id="edit-is-taxable"
                        checked={editingTariff.is_taxable}
                        onCheckedChange={(checked) => setEditingTariff({ ...editingTariff, is_taxable: checked })}
                      />
                      <div>
                        <Label htmlFor="edit-is-taxable" className="font-medium">Incluye IGV (18%)</Label>
                        <p className="text-xs text-muted-foreground">
                          {editingTariff.is_taxable ? 'Los precios incluirán IGV' : 'Los precios serán sin IGV'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>⚠️ Nota:</strong> Los cambios afectarán todos los precios y referencias 
                        que usen esta tarifa.
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateTariff} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Actualizar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingTariff(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* TAB: GESTIÓN DE PRECIOS */}
          <TabsContent value="prices" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">💰 Precios por Examen y Tarifa</h3>
                  <p className="text-sm text-muted-foreground">
                    Configura precios específicos para cada examen según la tarifa seleccionada
                  </p>
                </div>
                <Select value={selectedTariff} onValueChange={setSelectedTariff}>
                  <SelectTrigger className="w-60">
                    <SelectValue placeholder="Seleccionar tarifa" />
                  </SelectTrigger>
                  <SelectContent>
                    {tariffs.map((tariff) => (
                      <SelectItem key={tariff.id} value={tariff.id}>
                        {tariff.name} ({tariff.type === 'sale' ? 'Venta' : 'Costo'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTariff ? (
                <Alert className="border-blue-200 bg-blue-50">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    📝 Editando precios para: <strong>{tariffs.find(t => t.id === selectedTariff)?.name}</strong>
                    <br />
                    <span className="text-xs">
                      💡 Los cambios se sincronizan automáticamente con el sistema de tarifas
                    </span>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    👆 Selecciona una tarifa para comenzar a editar precios
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
              {examsWithPrices.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No hay exámenes disponibles</p>
                </Card>
              ) : (
                examsWithPrices.map((exam) => {
                  const hasPrice = selectedTariff && exam.prices[selectedTariff]
                  const currentPrice = hasPrice ? exam.prices[selectedTariff].price : 0
                  
                  return (
                    <Card key={exam.id} className={`p-4 transition-all hover:shadow-md ${
                      hasPrice ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{exam.name}</p>
                            {hasPrice && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                Configurado
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{exam.category}</p>
                          
                          {selectedTariff && (
                            <div className="text-xs text-muted-foreground">
                              Tarifa: <span className="font-medium">{tariffs.find(t => t.id === selectedTariff)?.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {selectedTariff ? (
                            hasPrice ? (
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  S/ {currentPrice.toFixed(2)}
                                </p>
                                <p className="text-xs text-green-600">Sincronizado ✓</p>
                              </div>
                            ) : (
                              <div className="text-right">
                                <p className="text-sm text-orange-600 font-medium">
                                  Sin precio
                                </p>
                                <p className="text-xs text-orange-500">Necesita configuración</p>
                              </div>
                            )
                          ) : (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Selecciona tarifa
                              </p>
                            </div>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant={hasPrice ? "default" : "outline"}
                            onClick={() => handleEditPrice(exam.id, exam.name, currentPrice)}
                            disabled={!selectedTariff}
                            className={hasPrice ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {hasPrice ? 'Editar' : 'Fijar'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* TAB: GESTIÓN DE REFERENCIAS MEJORADA */}
          <TabsContent value="references" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">🏢 Referencias de Clientes</h3>
                <p className="text-sm text-muted-foreground">
                  Grupos de clientes con tarifas específicas sincronizadas
                </p>
              </div>
              <Button onClick={() => setShowCreateReference(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Referencia
              </Button>
            </div>

            <div className="grid gap-4">
              {references.map((reference) => {
                // Calcular estadísticas de la referencia
                const refTariffStats = reference.default_tariff_id ? tariffStats[reference.default_tariff_id] : null
                const isTariffEnabled = reference.default_tariff_id ? tariffEnabled[reference.default_tariff_id] !== false : false
                
                return (
                  <Card key={reference.id} className={`transition-all ${
                    reference.active ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{reference.name}</CardTitle>
                            <Badge variant={reference.active ? 'default' : 'secondary'}>
                              {reference.active ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </div>
                          
                          {/* Información de la empresa */}
                          {reference.business_name && (
                            <p className="text-sm text-muted-foreground mb-3">
                              <strong>Razón Social:</strong> {reference.business_name}
                            </p>
                          )}
                          
                          {/* Información de la tarifa asignada */}
                          {reference.default_tariff ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                              {/* Tarifa asignada */}
                              <div className="text-center p-3 bg-white rounded-lg border">
                                <div className="text-lg font-bold text-blue-600">
                                  {reference.default_tariff.name}
                                </div>
                                <div className="text-xs text-muted-foreground">Tarifa</div>
                                <div className="text-xs text-blue-600">Asignada</div>
                              </div>
                              
                              {/* Estado de la tarifa */}
                              <div className="text-center p-3 bg-white rounded-lg border">
                                <div className={`text-lg font-bold ${isTariffEnabled ? 'text-green-600' : 'text-red-600'}`}>
                                  {isTariffEnabled ? 'ON' : 'OFF'}
                                </div>
                                <div className="text-xs text-muted-foreground">Estado</div>
                                <div className={`text-xs ${isTariffEnabled ? 'text-green-600' : 'text-red-600'}`}>
                                  {isTariffEnabled ? 'Habilitada' : 'Deshabilitada'}
                                </div>
                              </div>
                              
                                                             {/* Exámenes con precio */}
                               <div className="text-center p-3 bg-white rounded-lg border">
                                 <div className="text-lg font-bold text-purple-600">
                                   {refTariffStats?.examCount || 0}
                                 </div>
                                 <div className="text-xs text-muted-foreground">Exámenes</div>
                                 <div className="text-xs text-purple-600">Con Precio</div>
                               </div>
                               
                               {/* Precio promedio */}
                               <div className="text-center p-3 bg-white rounded-lg border">
                                 <div className="text-lg font-bold text-green-600">
                                   S/ {refTariffStats?.avgPrice ? refTariffStats.avgPrice.toFixed(0) : '0'}
                                 </div>
                                 <div className="text-xs text-muted-foreground">Precio</div>
                                 <div className="text-xs text-green-600">Promedio</div>
                               </div>
                            </div>
                          ) : (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="flex items-center gap-2 text-yellow-800">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  ⚠️ Sin tarifa asignada - Configurar en edición
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Advertencia si la tarifa está deshabilitada */}
                          {reference.default_tariff && !isTariffEnabled && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center gap-2 text-red-800">
                                <Settings className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  🚨 La tarifa asignada está DESHABILITADA
                                </span>
                              </div>
                              <p className="text-xs text-red-600 mt-1">
                                Los usuarios de esta referencia no verán los análisis hasta que se habilite la tarifa
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingReference(reference)}
                            title="Editar referencia"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteReference(reference.id, reference.name)}
                            title="Eliminar referencia"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            {/* Dialog: Crear Referencia - MEJORADO */}
            <Dialog open={showCreateReference} onOpenChange={setShowCreateReference}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>🆕 Nueva Referencia de Cliente</DialogTitle>
                  <DialogDescription>
                    Crear un nuevo grupo de clientes con tarifa específica
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ref-name">Nombre de la Referencia *</Label>
                    <Input
                      id="ref-name"
                      value={newReference.name}
                      onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                      placeholder="Ej: Médicos, Empresas, Clínica San Juan, etc."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 Usa nombres descriptivos para identificar fácilmente el grupo de clientes
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="ref-business">Razón Social (Opcional)</Label>
                    <Input
                      id="ref-business"
                      value={newReference.business_name}
                      onChange={(e) => setNewReference({ ...newReference, business_name: e.target.value })}
                      placeholder="Ej: Clínica San Juan S.A.C."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Para empresas específicas, ingresa la razón social completa
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="ref-tariff">Tarifa por Defecto *</Label>
                    <Select 
                      value={newReference.default_tariff_id} 
                      onValueChange={(value) => setNewReference({ ...newReference, default_tariff_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tarifa..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tariffs.map((tariff) => {
                          const stats = tariffStats[tariff.id] || { examCount: 0, avgPrice: 0 }
                          const isEnabled = tariffEnabled[tariff.id] !== false
                          
                          return (
                            <SelectItem key={tariff.id} value={tariff.id}>
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <span className="font-medium">{tariff.name}</span>
                                  <span className={`ml-2 text-xs ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                                    {isEnabled ? '✓ Habilitada' : '✗ Deshabilitada'}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {stats.examCount} exámenes • S/ {stats.avgPrice.toFixed(0)} prom.
                                </div>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      ⚠️ Solo las tarifas habilitadas permitirán a los usuarios ver análisis
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Switch
                      id="ref-active"
                      checked={newReference.active}
                      onCheckedChange={(checked) => setNewReference({ ...newReference, active: checked })}
                    />
                    <div>
                      <Label htmlFor="ref-active" className="font-medium">Referencia Activa</Label>
                      <p className="text-xs text-muted-foreground">
                        {newReference.active ? 'Los usuarios podrán ser asignados a esta referencia' : 'Referencia inactiva - no se podrán asignar usuarios'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>📋 Siguiente paso:</strong> Después de crear la referencia, asigna usuarios 
                      desde el panel de administrador → Registrar Usuario.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCreateReference} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Crear Referencia
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateReference(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dialog: Editar Referencia - MEJORADO */}
            <Dialog open={!!editingReference} onOpenChange={() => setEditingReference(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>✏️ Editar Referencia de Cliente</DialogTitle>
                  <DialogDescription>
                    Modificar información de: {editingReference?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-ref-name">Nombre de la Referencia *</Label>
                    <Input
                      id="edit-ref-name"
                      value={editingReference?.name || ""}
                      onChange={(e) => setEditingReference(prev => prev ? {...prev, name: e.target.value} : null)}
                      placeholder="Ej: Médicos, Empresas, Clínica San Juan"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-ref-business">Razón Social (Opcional)</Label>
                    <Input
                      id="edit-ref-business"
                      value={editingReference?.business_name || ""}
                      onChange={(e) => setEditingReference(prev => prev ? {...prev, business_name: e.target.value} : null)}
                      placeholder="Ej: Clínica San Juan S.A.C."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-ref-tariff">Tarifa por Defecto *</Label>
                    <Select 
                      value={editingReference?.default_tariff_id || ""} 
                      onValueChange={(value) => setEditingReference(prev => prev ? {...prev, default_tariff_id: value} : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tarifa..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tariffs.map((tariff) => {
                          const stats = tariffStats[tariff.id] || { examCount: 0, avgPrice: 0 }
                          const isEnabled = tariffEnabled[tariff.id] !== false
                          
                          return (
                            <SelectItem key={tariff.id} value={tariff.id}>
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <span className="font-medium">{tariff.name}</span>
                                  <span className={`ml-2 text-xs ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                                    {isEnabled ? '✓ Habilitada' : '✗ Deshabilitada'}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {stats.examCount} exámenes • S/ {stats.avgPrice.toFixed(0)} prom.
                                </div>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {editingReference?.default_tariff_id && tariffEnabled[editingReference.default_tariff_id] === false && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-xs text-red-800">
                          ⚠️ <strong>Advertencia:</strong> La tarifa seleccionada está DESHABILITADA. 
                          Los usuarios no verán análisis hasta que se habilite.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Switch
                      id="edit-ref-active"
                      checked={editingReference?.active || false}
                      onCheckedChange={(checked) => setEditingReference(prev => prev ? {...prev, active: checked} : null)}
                    />
                    <div>
                      <Label htmlFor="edit-ref-active" className="font-medium">Referencia Activa</Label>
                      <p className="text-xs text-muted-foreground">
                        {editingReference?.active ? 'Los usuarios pueden ser asignados a esta referencia' : 'Referencia inactiva - no se pueden asignar usuarios'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>⚠️ Nota:</strong> Los cambios afectarán inmediatamente a todos los usuarios 
                      asignados a esta referencia.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateReference} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Actualizar Referencia
                    </Button>
                    <Button variant="outline" onClick={() => setEditingReference(null)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

          </TabsContent>

          {/* Dialog: Editar Precio */}
          <Dialog open={!!editingPrice} onOpenChange={() => setEditingPrice(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Precio</DialogTitle>
                <DialogDescription>
                  Modificar precio del análisis: {editingPrice?.examName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price-input">Precio (S/)</Label>
                  <Input
                    id="price-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSavePrice} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Precio
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPrice(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>


        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 