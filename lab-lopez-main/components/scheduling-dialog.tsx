"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SchedulingDialogProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (data: SchedulingFormData) => void
  testName: string
}

interface SchedulingFormData {
  serviceType: string
  date: Date | undefined
  location: string
  timeSlot: string
}

export function SchedulingDialog({ isOpen, onClose, onSchedule, testName }: SchedulingDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SchedulingFormData>({
    serviceType: "",
    date: undefined,
    location: "",
    timeSlot: "",
  })

  const locations = ["Sede Armendáriz (Av. Armendáriz 500, Miraflores)", "Sede San Isidro", "Sede Miraflores"]

  const timeSlots = [
    "07:00",
    "07:30",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:30",
    "13:30",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
  ]

  const handleSchedule = () => {
    if (!formData.date || !formData.location || !formData.serviceType || !formData.timeSlot) {
      return
    }
    onSchedule(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reserva tu cita</DialogTitle>
          <DialogDescription>{testName}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-6">
            <div>
              <Label>Escoge el tipo de atención *</Label>
              <RadioGroup
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sede" id="sede" />
                  <Label htmlFor="sede">Atención en sede</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domicilio" id="domicilio" />
                  <Label htmlFor="domicilio">Atención a domicilio</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Elige una fecha *</Label>
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData({ ...formData, date: date || undefined })}
                className="mt-2"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div>
              <Label>Escoge la sede para la cita *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecciona una sede" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Elige un turno *</Label>
              <Select
                value={formData.timeSlot}
                onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecciona un horario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!formData.date || !formData.location || !formData.serviceType || !formData.timeSlot}
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

