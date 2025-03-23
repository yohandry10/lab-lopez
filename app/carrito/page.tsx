"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, ArrowLeft, Calendar } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function CarritoPage() {
  const { items, removeItem, clearCart, itemCount } = useCart()
  const { toast } = useToast()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Calcular el total
  const total = items.reduce((sum, item) => sum + item.price, 0)

  // Manejar el checkout
  const handleCheckout = () => {
    toast({
      title: "Análisis agendados",
      description: "Tus análisis han sido agendados correctamente. Recibirás un correo con los detalles.",
    })
    clearCart()
    setIsCheckoutOpen(false)
  }

  if (itemCount === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-8">No has agregado ningún análisis a tu carrito.</p>
          <Link href="/analisis">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir a Análisis
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Tu carrito</h1>
        <p className="text-gray-500">
          {itemCount} {itemCount === 1 ? "análisis" : "análisis"} en tu carrito
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Análisis seleccionados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Código: {item.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">S/. {item.price.toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={clearCart}>
                Vaciar carrito
              </Button>
              <Link href="/analisis">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Seguir comprando
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>S/. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IGV (18%)</span>
                  <span>Incluido</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>S/. {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar análisis
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Agendar análisis</DialogTitle>
                    <DialogDescription>Completa la información para agendar tus análisis</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombres</Label>
                        <Input id="nombre" placeholder="Ingresa tus nombres" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido">Apellidos</Label>
                        <Input id="apellido" placeholder="Ingresa tus apellidos" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" placeholder="999 999 999" />
                    </div>
                    <div className="space-y-2">
                      <Label>Modalidad</Label>
                      <RadioGroup defaultValue="sede">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sede" id="sede" />
                          <Label htmlFor="sede">En sede</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="domicilio" id="domicilio" />
                          <Label htmlFor="domicilio">A domicilio</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCheckout}>
                      Confirmar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

