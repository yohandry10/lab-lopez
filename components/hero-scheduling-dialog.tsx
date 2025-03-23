"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SchedulingFlow } from "./scheduling-flow"
import { useCart } from "@/contexts/cart-context"
import { SuccessDialog } from "./success-dialog"

interface HeroSchedulingDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function HeroSchedulingDialog({ isOpen, onClose }: HeroSchedulingDialogProps) {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState("sede")
  const [selectedTest, setSelectedTest] = useState("")
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [patientName, setPatientName] = useState("")
  const { addItem } = useCart()

  // Lista de análisis populares
  const popularTests = [
    { id: "hemograma", name: "Hemograma completo", price: 80 },
    { id: "glucosa", name: "Glucosa", price: 50 },
    { id: "perfil-lipidico", name: "Perfil lipídico", price: 120 },
    { id: "perfil-tiroideo", name: "Perfil tiroideo", price: 180 },
    { id: "covid-antigeno", name: "Prueba COVID-19 Antígeno", price: 100 },
    { id: "covid-pcr", name: "Prueba COVID-19 PCR", price: 250 },
  ]

  const handleNext = () => {
    if (selectedTest) {
      onClose()
      setIsSchedulingOpen(true)
    }
  }

  const handleScheduleComplete = (data) => {
    setIsSchedulingOpen(false)

    // Extract patient name from form data
    const fullName = `${data.firstName} ${data.lastName}`
    setPatientName(fullName)

    // Add item to cart
    const test = popularTests.find((test) => test.id === selectedTest)
    if (test) {
      addItem({
        id: test.id,
        name: test.name,
        price: test.price,
        patientInfo: data,
      })
    }

    // Show success dialog
    setIsSuccessOpen(true)
  }

  const handleSuccessClose = () => {
    setIsSuccessOpen(false)
    setSelectedTest("")
    setServiceType("sede")
    setStep(1)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agenda tu análisis</DialogTitle>
            <DialogDescription>Selecciona el tipo de análisis y modalidad de atención</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div>
              <Label className="font-medium">Selecciona un análisis</Label>
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Elige un análisis" />
                </SelectTrigger>
                <SelectContent>
                  {popularTests.map((test) => (
                    <SelectItem key={test.id} value={test.id}>
                      {test.name} - S/. {test.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-medium">Tipo de atención</Label>
              <RadioGroup value={serviceType} onValueChange={setServiceType} className="mt-2 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sede" id="hero-sede" />
                  <Label htmlFor="hero-sede">Atención en sede</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domicilio" id="hero-domicilio" />
                  <Label htmlFor="hero-domicilio">Atención a domicilio</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleNext} disabled={!selectedTest} className="bg-[#1E5FAD] hover:bg-[#3DA64A]">
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedTest && (
        <SchedulingFlow
          isOpen={isSchedulingOpen}
          onClose={() => setIsSchedulingOpen(false)}
          onComplete={handleScheduleComplete}
          testName={popularTests.find((test) => test.id === selectedTest)?.name || ""}
          initialServiceType={serviceType}
        />
      )}

      <SuccessDialog
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        testName={popularTests.find((test) => test.id === selectedTest)?.name || ""}
        patientName={patientName}
        onContinueShopping={handleSuccessClose}
        onNewPatient={handleSuccessClose}
        onViewCart={() => {
          handleSuccessClose()
          window.location.href = "/carrito"
        }}
      />
    </>
  )
}

