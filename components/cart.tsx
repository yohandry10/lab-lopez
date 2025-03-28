"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function Cart() {
  const { items, removeItem, clearCart, itemCount, total } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {itemCount}
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrito de Análisis</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex h-[calc(100vh-8rem)] flex-col gap-4">
          <ScrollArea className="flex-1">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No hay análisis en el carrito
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(item.price)}
                      </div>
                      {item.patientInfo && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div>Paciente: {item.patientInfo.patientName}</div>
                          <div>Edad: {item.patientInfo.patientAge}</div>
                          <div>Género: {item.patientInfo.patientGender}</div>
                          {item.patientInfo.observations && (
                            <div>
                              Observaciones: {item.patientInfo.observations}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          {items.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between text-lg font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => clearCart()}
                >
                  Vaciar
                </Button>
                <Button className="flex-1">Pagar</Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 