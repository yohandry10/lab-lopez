"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Database, DollarSign, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase-client"
import { tariffsService } from "@/lib/tariffs-service"

interface MigrationStatus {
  totalAnalyses: number
  totalTariffPrices: number
  totalTariffs: number
  migrationNeeded: boolean
  tariffBreakdown: Record<string, number>
  isSystemReady: boolean
}

export default function MigrateTariffsPage() {
  const { user } = useAuth()
  const [status, setStatus] = useState<MigrationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationLog, setMigrationLog] = useState<string[]>([])

  useEffect(() => {
    if (user?.user_type === "admin") {
      checkMigrationStatus()
    }
  }, [user])

  const checkMigrationStatus = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseClient()
      
      const [analysesResult, tariffPricesResult, tariffsResult] = await Promise.all([
        supabase.from('analyses').select('id').gt('price', 0),
        supabase.from('tariff_prices').select('id, tariff_id, tariff:tariffs(name)'),
        supabase.from('tariffs').select('id, name, type')
      ])
      
      const tariffBreakdown = tariffPricesResult.data?.reduce((acc, item) => {
        const tariffName = (item.tariff as any)?.name || 'Desconocido'
        acc[tariffName] = (acc[tariffName] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}
      
      const totalAnalyses = analysesResult.data?.length || 0
      const totalTariffPrices = tariffPricesResult.data?.length || 0
      const totalTariffs = tariffsResult.data?.length || 0
      
      const migrationNeeded = totalAnalyses > 0 && totalTariffPrices === 0
      const isSystemReady = totalTariffs > 0 && totalTariffPrices > 0
      
      setStatus({
        totalAnalyses,
        totalTariffPrices,
        totalTariffs,
        migrationNeeded,
        tariffBreakdown,
        isSystemReady
      })
      
    } catch (error) {
      console.error('Error checking migration status:', error)
      addLog('❌ Error verificando estado de migración: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const addLog = (message: string) => {
    setMigrationLog(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`])
  }

  const runMigration = async () => {
    setIsMigrating(true)
    setMigrationLog([])
    addLog('🚀 Iniciando migración de precios al sistema de tarifas...')
    
    try {
      const supabase = getSupabaseClient()
      
      // 1. Verificar tarifas
      addLog('📋 Verificando tarifas disponibles...')
      const { data: tariffs } = await supabase
        .from('tariffs')
        .select('id, name, type')
        .order('name')
      
      if (!tariffs || tariffs.length === 0) {
        throw new Error('No se encontraron tarifas. Ejecutar primero create-tariffs-system.sql')
      }
      
      const baseTariff = tariffs.find(t => t.name === 'Base' && t.type === 'sale')
      const referenceTariff = tariffs.find(t => t.name === 'Referencial con IGV' && t.type === 'sale')
      
      if (!baseTariff || !referenceTariff) {
        throw new Error('No se encontraron las tarifas Base y Referencial necesarias')
      }
      
      addLog(`✅ Tarifas encontradas: Base (${baseTariff.id}) y Referencial (${referenceTariff.id})`)
      
      // 2. Obtener análisis
      addLog('📊 Cargando análisis para migrar...')
      const { data: analyses } = await supabase
        .from('analyses')
        .select('id, name, price, reference_price')
        .gt('price', 0)
        .order('name')
      
      if (!analyses || analyses.length === 0) {
        addLog('⚠️ No se encontraron análisis con precios para migrar')
        return
      }
      
      addLog(`✅ ${analyses.length} análisis encontrados para migrar`)
      
      // 3. Migrar en lotes
      addLog('🔄 Iniciando migración de precios...')
      let migratedCount = 0
      const batchSize = 20
      
      for (let i = 0; i < analyses.length; i += batchSize) {
        const batch = analyses.slice(i, i + batchSize)
        
        for (const analysis of batch) {
          try {
            // Precio base
            await tariffsService.createTariffPrice({
              tariff_id: baseTariff.id,
              exam_id: analysis.id,
              price: analysis.price
            })
            
            // Precio referencial
            const referencePrice = analysis.reference_price || (analysis.price * 0.8)
            await tariffsService.createTariffPrice({
              tariff_id: referenceTariff.id,
              exam_id: analysis.id,
              price: referencePrice
            })
            
            migratedCount++
            
          } catch (error) {
            addLog(`❌ Error migrando ${analysis.name}: ${error}`)
          }
        }
        
        addLog(`📈 Progreso: ${migratedCount}/${analyses.length} análisis migrados`)
      }
      
      // 4. Configurar referencias
      addLog('🔧 Configurando referencias por defecto...')
      try {
        const { data: references } = await supabase
          .from('references')
          .select('id, name')
          .in('name', ['Público General', 'Médicos', 'Empresas'])
        
        if (references) {
          for (const ref of references) {
            let tariffId = baseTariff.id
            if (ref.name === 'Médicos' || ref.name === 'Empresas') {
              tariffId = referenceTariff.id
            }
            
            await supabase
              .from('references')
              .update({ default_tariff_id: tariffId })
              .eq('id', ref.id)
          }
          
          addLog('✅ Referencias configuradas correctamente')
        }
      } catch (error) {
        addLog(`⚠️ Error configurando referencias: ${error}`)
      }
      
      addLog('🎉 ¡Migración completada exitosamente!')
      addLog(`📊 Total: ${migratedCount} análisis migrados`)
      
      // Recargar estado
      await checkMigrationStatus()
      
    } catch (error) {
      addLog('💥 Error en la migración: ' + error)
    } finally {
      setIsMigrating(false)
    }
  }

  if (!user || user.user_type !== "admin") {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Solo los administradores pueden acceder a esta página.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Migración de Precios al Sistema de Tarifas</h1>
        <p className="text-gray-600 mt-2">
          Migra los precios existentes de la tabla analyses al nuevo sistema de tarifas dinámicas
        </p>
      </div>

      {/* Estado del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
          <CardDescription>
            Verificación del estado actual de la migración
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Verificando estado...
            </div>
          ) : status ? (
            <div className="space-y-4">
              {/* Indicadores de estado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{status.totalAnalyses}</div>
                  <div className="text-sm text-gray-600">Análisis con precios</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{status.totalTariffPrices}</div>
                  <div className="text-sm text-gray-600">Precios en tarifas</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{status.totalTariffs}</div>
                  <div className="text-sm text-gray-600">Tarifas disponibles</div>
                </div>
              </div>

              {/* Estado de migración */}
              <div className="space-y-2">
                {status.isSystemReady ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✅ Sistema de tarifas configurado y funcionando correctamente
                    </AlertDescription>
                  </Alert>
                ) : status.migrationNeeded ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      ⚠️ Se requiere migración: hay análisis con precios pero no están en el sistema de tarifas
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      ℹ️ Sistema parcialmente configurado
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Desglose por tarifa */}
              {Object.keys(status.tariffBreakdown).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Precios por tarifa:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(status.tariffBreakdown).map(([tariff, count]) => (
                      <Badge key={tariff} variant="outline">
                        {tariff}: {count} precios
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">Error cargando estado del sistema</div>
          )}
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Acciones de Migración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runMigration} 
              disabled={isMigrating || !status?.migrationNeeded}
              className="bg-green-600 hover:bg-green-700"
            >
              {isMigrating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Migrando...
                </>
              ) : (
                'Ejecutar Migración'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={checkMigrationStatus}
              disabled={isLoading}
            >
              Verificar Estado
            </Button>
          </div>

          {!status?.migrationNeeded && status?.isSystemReady && (
            <div className="text-sm text-gray-600">
              La migración ya fue ejecutada correctamente. El sistema de tarifas está funcionando.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log de migración */}
      {migrationLog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Log de Migración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {migrationLog.join('\n')}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 