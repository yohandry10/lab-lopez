"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useMemo } from "react"

interface SuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  testName: string
  patientName: string
  onContinueShopping: () => void
  onNewPatient: () => void
  onViewCart: () => void
  items?: Array<{ name: string; price?: number; quantity?: number }>
  showWhatsAppButton?: boolean
  whatsappNumber?: string
}

export function SuccessDialog({
  isOpen,
  onClose,
  testName,
  patientName,
  onContinueShopping,
  onNewPatient,
  onViewCart,
  items = [],
  showWhatsAppButton = false,
  whatsappNumber = "51900649599",
}: SuccessDialogProps) {

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity ?? 1), 0)
  }, [items])

  const whatsappMessage = useMemo(() => {
    if (!showWhatsAppButton) return ""
    const list = items
      .map((it) => {
        const qty = it.quantity ?? 1
        const label = qty > 1 ? `${it.name} × ${qty}` : it.name
        const linePrice = it.price ? ` - S/. ${(it.price * qty).toFixed(2)}` : ""
        return `• ${label}${linePrice}`
      })
      .join("%0A")
    const totalLine = totalPrice ? `%0A%0ATotal: S/. ${totalPrice.toFixed(2)}` : ""
    return encodeURIComponent(
      `Hola, quisiera solicitar el recojo de las siguientes pruebas:%0A${list}${totalLine}`
    )
  }, [items, totalPrice, showWhatsAppButton])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Análisis agregado al carrito</DialogTitle>
          <DialogDescription className="sr-only">
            Confirmación de análisis agregado al carrito de compras
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-6">
          <div className="mx-auto w-24 h-24 bg-[#1e5fad]/10 rounded-full flex items-center justify-center mb-4">
            <Check className="h-12 w-12 text-[#1e5fad]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Listo,</h3>
          <p className="text-gray-600 mb-4">
            Hemos agregado a tu carrito de compras <span className="text-[#1e5fad]">{testName}</span>{" "}
            {patientName && (
              <>
                para <span className="font-medium">{patientName}</span>
              </>
            )}
          </p>

          {/* Cotización Preview */}
          {items.length > 0 && (
            <div className="mb-6 text-left max-h-48 overflow-y-auto border rounded-md p-4 bg-gray-50">
              <ul className="text-sm space-y-1">
                {items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.name}{item.quantity && item.quantity > 1 ? ` × ${item.quantity}` : ""}</span>
                    {item.price !== undefined && (
                      <span className="font-medium">S/. {(item.price * (item.quantity ?? 1)).toFixed(2)}</span>
                    )}
                  </li>
                ))}
              </ul>
              {totalPrice > 0 && (
                <div className="mt-3 pt-3 border-t flex justify-between font-bold text-[#1e5fad]">
                  <span>Total</span>
                  <span>S/. {totalPrice.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={onContinueShopping} className="w-full bg-[#1e5fad] hover:bg-[#3DA64A]">
              {`Seguir agregando${patientName ? ` para ${patientName}` : ""}`}
            </Button>
            {showWhatsAppButton && (
              <Button
                asChild
                className="w-full bg-[#25d366] hover:bg-[#128C7E] text-white"
              >
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar solicitud de recojo
                </a>
              </Button>
            )}
            <Button
              onClick={onNewPatient}
              variant="outline"
              className="w-full border-[#1e5fad] text-[#1e5fad] hover:bg-[#1e5fad]/10"
            >
              Deseo comprar para otro paciente
            </Button>
            <Button
              onClick={onViewCart}
              variant="outline"
              className="w-full border-[#3DA64A] text-[#3DA64A] hover:bg-[#3DA64A]/10"
            >
              Ir al carrito
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

