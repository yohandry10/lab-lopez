"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function DebugSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      // Verificar variables de entorno
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "No configurado",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurado" : "No configurado",
      }

      // Probar conexión a Supabase
      const supabase = getSupabaseClient()

      // Probar una consulta simple
      const { data, error: queryError } = await supabase.from("services").select("*").limit(1)

      if (queryError) {
        throw new Error(`Error en la consulta: ${queryError.message}`)
      }

      // Probar permisos de escritura
      const testUser = {
        email: `test_${Date.now()}@example.com`,
        password: "password123",
      }

      const { data: authData, error: authError } = await supabase.auth.signUp(testUser)

      if (authError) {
        throw new Error(`Error en Auth: ${authError.message}`)
      }

      setResult({
        envVars,
        connectionSuccess: true,
        queryResult: data,
        authResult: authData,
      })
    } catch (err: any) {
      console.error("Error en la prueba:", err)
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Depuración de Supabase</CardTitle>
          <CardDescription>Esta página te ayuda a diagnosticar problemas con la conexión a Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testConnection} disabled={loading} className="mb-4">
            {loading ? "Probando..." : "Probar conexión"}
          </Button>

          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-medium">Variables de entorno</h3>
                <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(result.envVars, null, 2)}</pre>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-medium">Resultado de la consulta</h3>
                <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(result.queryResult, null, 2)}</pre>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-medium">Resultado de Auth</h3>
                <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(result.authResult, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

