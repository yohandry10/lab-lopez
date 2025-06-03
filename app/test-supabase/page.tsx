"use client"

import { useState } from "react"
import { getSupabaseClient } from "../../lib/supabase-client"

export default function TestSupabasePage() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("🔄 Probando conexión...")
    
    try {
      const supabase = getSupabaseClient()
      console.log("🔗 Cliente obtenido")
      
      // Test 1: Obtener análisis
      console.log("📡 Obteniendo análisis...")
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .limit(5)
      
      if (error) {
        console.error("❌ Error:", error)
        setResult(`❌ ERROR: ${error.message}`)
        return
      }
      
      console.log("✅ Datos obtenidos:", data)
      setResult(`✅ CONEXIÓN EXITOSA!\n\nDatos obtenidos: ${data?.length || 0} análisis\n\nPrimer análisis: ${JSON.stringify(data?.[0], null, 2)}`)
      
    } catch (err) {
      console.error("💥 Error inesperado:", err)
      setResult(`💥 ERROR INESPERADO: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testUpdate = async () => {
    setLoading(true)
    setResult("🔄 Probando actualización...")
    
    try {
      const supabase = getSupabaseClient()
      
      // Intentar actualizar el primer análisis
      const { data, error } = await supabase
        .from("analyses")
        .update({ 
          price: 999.99
        })
        .eq("id", 1)
        .select()
        .single()
      
      if (error) {
        console.error("❌ Error en actualización:", error)
        setResult(`❌ ERROR EN ACTUALIZACIÓN: ${error.message}`)
        return
      }
      
      console.log("✅ Actualización exitosa:", data)
      setResult(`✅ ACTUALIZACIÓN EXITOSA!\n\nDatos actualizados: ${JSON.stringify(data, null, 2)}`)
      
    } catch (err) {
      console.error("💥 Error en actualización:", err)
      setResult(`💥 ERROR EN ACTUALIZACIÓN: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">🧪 TEST SUPABASE</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          {loading ? "⏳ Probando..." : "🔗 Probar Conexión"}
        </button>
        
        <button
          onClick={testUpdate}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "⏳ Actualizando..." : "💾 Probar Actualización"}
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">📊 Resultado:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result || "Presiona un botón para probar..."}</pre>
      </div>
    </div>
  )
} 