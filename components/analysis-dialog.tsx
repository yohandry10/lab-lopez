"use client"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AnalysisDialogProps {
  isOpen: boolean
  onClose: () => void
  analysis: {
    name: string
    price: number
    conditions: string
    sample: string
    protocol: string
    suggestions?: string
    comments?: string
  } | null
}

export function AnalysisDialog({ isOpen, onClose, analysis }: AnalysisDialogProps) {
  if (!analysis) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-lg font-medium pr-8">{analysis.name}</DialogTitle>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="bg-blue-50 -mx-6 px-6 py-2 text-right text-sm">
          Precio S/. {analysis.price.toFixed(2)} incluido IGV
        </div>
        <div className="space-y-4 pt-2">
          <div>
            <h4 className="font-medium mb-1">Condiciones (ayunas)</h4>
            <p className="text-gray-600">{analysis.conditions}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Muestra preferida</h4>
            <p className="text-gray-600">{analysis.sample}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Protocolo toma muestra</h4>
            <p className="text-gray-600">{analysis.protocol}</p>
          </div>
          {analysis.suggestions && (
            <div>
              <h4 className="font-medium mb-1">Análisis sugeridos</h4>
              <p className="text-gray-600">{analysis.suggestions}</p>
            </div>
          )}
          <div>
            <h4 className="font-medium mb-1">Comentarios</h4>
            <p className="text-gray-600">{analysis.comments || "(ninguno)"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

