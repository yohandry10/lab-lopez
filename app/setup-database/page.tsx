"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SetupDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
  }>({
    supabaseUrl: false,
    supabaseKey: false,
  })

  useEffect(() => {
    // Verificar si las variables de entorno están configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvStatus({
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
    })
  }, [])

  const setupDatabase = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/setup-database")
      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || "Error al configurar la base de datos")
      }
    } catch (err) {
      setError("Error al conectar con el servidor: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsLoading(false)
    }
  }

  const seedData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/seed-data")
      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || "Error al insertar datos de ejemplo")
      }
    } catch (err) {
      setError("Error al conectar con el servidor: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Configuración de la Base de Datos</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado de las Variables de Entorno</CardTitle>
          <CardDescription>
            Verifica que las variables de entorno necesarias estén configuradas correctamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              {envStatus.supabaseUrl ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span>NEXT_PUBLIC_SUPABASE_URL: {envStatus.supabaseUrl ? "Configurado" : "No configurado"}</span>
            </div>
            <div className="flex items-center">
              {envStatus.supabaseKey ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envStatus.supabaseKey ? "Configurado" : "No configurado"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {!envStatus.supabaseUrl || !envStatus.supabaseKey ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Debes configurar las variables de entorno de Supabase antes de continuar. Agrega las variables
                NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY a tu proyecto.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Listo</AlertTitle>
              <AlertDescription>Las variables de entorno están configuradas correctamente.</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurar Tablas</CardTitle>
            <CardDescription>Crea las tablas necesarias en la base de datos Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Este proceso creará las siguientes tablas:</p>
            <ul className="list-disc pl-5 text-sm text-gray-500">
              <li>users - Usuarios del sistema</li>
              <li>employees - Empleados de empresas</li>
              <li>appointments - Citas médicas</li>
              <li>services - Servicios ofrecidos</li>
              <li>patients - Información de pacientes</li>
              <li>exams - Exámenes médicos</li>
              <li>diagnoses - Diagnósticos médicos</li>
              <li>orders - Órdenes de servicio</li>
              <li>home_services - Servicios a domicilio</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={setupDatabase}
              disabled={isLoading || !envStatus.supabaseUrl || !envStatus.supabaseKey}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configurando...
                </>
              ) : (
                "Configurar Tablas"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insertar Datos de Ejemplo</CardTitle>
            <CardDescription>Inserta datos de ejemplo en las tablas para pruebas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Este proceso insertará datos de ejemplo en las siguientes tablas:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-500">
              <li>Usuarios (paciente, médico, empresa)</li>
              <li>Empleados para la empresa de ejemplo</li>
              <li>Datos de paciente</li>
              <li>Exámenes médicos</li>
              <li>Citas médicas</li>
              <li>Órdenes de servicio</li>
              <li>Servicios a domicilio</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={seedData}
              disabled={isLoading || !envStatus.supabaseUrl || !envStatus.supabaseKey}
              className="w-full bg-green-700 hover:bg-green-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Insertando datos...
                </>
              ) : (
                "Insertar Datos de Ejemplo"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {success && (
        <Alert className="mt-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>La operación se completó correctamente.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

