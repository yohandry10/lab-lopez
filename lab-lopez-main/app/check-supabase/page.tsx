"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function CheckSupabasePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<"success" | "error" | null>(null)
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/check-supabase")
      const result = await response.json()

      if (result.success) {
        setStatus("success")
        setMessage(result.message)
        setDetails(result.data)
      } else {
        setStatus("error")
        setMessage(result.message)
        setDetails(result.error)
      }
    } catch (error: any) {
      setStatus("error")
      setMessage("Error al verificar la conexión")
      setDetails(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verificación de Supabase</CardTitle>
          <CardDescription>Comprueba la conexión con tu base de datos Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-4 text-gray-500">Verificando conexión...</p>
              </div>
            ) : status === "success" ? (
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <p className="mt-4 font-medium text-green-600">{message}</p>
                {details && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md w-full">
                    <pre className="text-xs overflow-auto">{JSON.stringify(details, null, 2)}</pre>
                  </div>
                )}
              </div>
            ) : status === "error" ? (
              <div className="flex flex-col items-center text-center">
                <XCircle className="h-10 w-10 text-red-600" />
                <p className="mt-4 font-medium text-red-600">{message}</p>
                {details && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md w-full">
                    <pre className="text-xs overflow-auto">{JSON.stringify(details, null, 2)}</pre>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={checkConnection} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar conexión"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

