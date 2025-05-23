"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface SuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  testName: string
  patientName: string
  onContinueShopping: () => void
  onNewPatient: () => void
  onViewCart: () => void
}

export function SuccessDialog({
  isOpen,
  onClose,
  testName,
  patientName,
  onContinueShopping,
  onNewPatient,
  onViewCart,
}: SuccessDialogProps) {
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
          <p className="text-gray-600 mb-6">
            hemos agregado a tu carrito de compras un <span className="text-[#1e5fad]">{testName}</span> para{" "}
            {patientName}
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={onContinueShopping} className="w-full bg-[#1e5fad] hover:bg-[#3DA64A]">
              Seguir agregando para {patientName}
            </Button>
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

