"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function CheckConnectionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  const checkConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/check-connection")
      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message,
        error: data.error,
      })
    } catch (err) {
      setResult({
        success: false,
        message: "Error al realizar la petición",
        error: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Verificar automáticamente al cargar la página
    checkConnection()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Verificación de Conexión a Supabase</h1>

      <Card>
        <CardHeader>
          <CardTitle>Estado de la Conexión</CardTitle>
          <CardDescription>
            Verifica si la aplicación puede conectarse correctamente a la base de datos Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
              <p className="text-center text-lg font-medium">Verificando conexión...</p>
            </div>
          ) : result ? (
            result.success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle>Conexión Exitosa</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error de Conexión</AlertTitle>
                <AlertDescription>
                  {result.message}
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-sm">
                      <code>{result.error}</code>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )
          ) : null}
        </CardContent>
        <CardFooter>
          <Button onClick={checkConnection} disabled={isLoading} className="w-full bg-blue-700 hover:bg-blue-800">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Conexión"
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Pasos siguientes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Si la conexión es exitosa, puedes proceder a{" "}
            <a href="/setup-database" className="text-blue-600 hover:underline">
              configurar la base de datos
            </a>
            .
          </li>
          <li>
            Si hay un error, verifica que las variables de entorno estén configuradas correctamente en el archivo{" "}
            <code>.env.local</code>.
          </li>
          <li>Asegúrate de que tu proyecto Supabase esté activo y funcionando correctamente.</li>
        </ul>
      </div>
    </div>
  )
}

