"use client"

import { useState, useEffect } from "react"
import { getServices } from "@/lib/database-service"
import type { Service } from "@/lib/supabase-client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface ServicesListProps {
  onAddToCart?: (service: Service) => void
  showAddButton?: boolean
}

export function ServicesList({ onAddToCart, showAddButton = true }: ServicesListProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        setIsLoading(true)
        const data = await getServices()
        setServices(data)
      } catch (err) {
        console.error("Error al cargar servicios:", err)
        setError("No se pudieron cargar los servicios. Intente nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No hay servicios disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <Badge variant="outline">{service.category}</Badge>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500 mb-2">{service.description}</p>
            {service.duration && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Duración:</span> {service.duration} minutos
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-2">
            <p className="font-bold">S/ {service.price.toFixed(2)}</p>
            {showAddButton && onAddToCart && (
              <Button size="sm" onClick={() => onAddToCart(service)}>
                Agregar al carrito
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

