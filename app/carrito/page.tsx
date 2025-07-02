"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, ArrowLeft, Calendar, Copy, Check, Smartphone, AlertCircle } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { sendPickupNotification, EmailData } from "@/lib/emailjs-service"

export default function CarritoPage() {
  const { items, removeItem, clearCart, itemCount } = useCart()
  const { toast } = useToast()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("yape")
  const [copiedNumber, setCopiedNumber] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Constantes de pago
  const YAPE_PLIN_NUMBER = "979 670 032"

  // Calcular el total
  const total = items.reduce((sum, item) => sum + item.price, 0)

  // Copiar número al portapapeles
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(YAPE_PLIN_NUMBER.replace(/\s/g, ''))
      setCopiedNumber(true)
      toast({
        title: "Número copiado",
        description: "El número ha sido copiado al portapapeles",
      })
      setTimeout(() => setCopiedNumber(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el número",
        variant: "destructive",
      })
    }
  }

  // Generar link de YAPE
  const generateYapeLink = () => {
    const amount = total.toFixed(2)
    const message = `Pago análisis laboratorio - S/${amount}`
    return `yape://transfer?phone=${YAPE_PLIN_NUMBER.replace(/\s/g, '')}&amount=${amount}&message=${encodeURIComponent(message)}`
  }

  // Generar link de PLIN
  const generatePlinLink = () => {
    const amount = total.toFixed(2)
    const message = `Pago análisis laboratorio - S/${amount}`
    return `plin://transfer?phone=${YAPE_PLIN_NUMBER.replace(/\s/g, '')}&amount=${amount}&message=${encodeURIComponent(message)}`
  }

  // Obtener datos del localStorage (guardados desde el formulario de programación)
  const getFormDataFromStorage = () => {
    if (typeof window === 'undefined') return null
    
    try {
      const schedulingData = localStorage.getItem('scheduling-data')
      const patientData = localStorage.getItem('patient-data')
      
      return {
        schedulingData: schedulingData ? JSON.parse(schedulingData) : null,
        patientData: patientData ? JSON.parse(patientData) : null
      }
    } catch (error) {
      console.error('Error al obtener datos del storage:', error)
      return null
    }
  }

  // Enviar información por EmailJS
  const sendEmailNotification = async (): Promise<boolean> => {
    try {
      const storageData = getFormDataFromStorage()
      
      // Preparar datos para el email
      const emailData: EmailData = {
        // Información del paciente (del localStorage o datos de ejemplo)
        patient_name: storageData?.patientData?.firstName || 'Cliente',
        patient_lastname: storageData?.patientData?.lastName || 'Lab López',
        document_type: storageData?.patientData?.documentType || 'DNI',
        document_number: storageData?.patientData?.documentNumber || '00000000',
        patient_phone: storageData?.patientData?.phone || '979670032',
        patient_email: storageData?.patientData?.email || 'cliente@laboratorio.com',
        birth_date: storageData?.patientData?.birthDate || '1990-01-01',
        
        // Detalles del recojo (del localStorage o datos por defecto)
        programming_type: storageData?.schedulingData?.programmingType === 'urgente' ? 'Urgente' : 'Según horario (10:00 y 13:00 horas)',
        pickup_date: storageData?.schedulingData?.selectedDate || new Date().toLocaleDateString('es-PE'),
        pickup_time: storageData?.schedulingData?.selectedTime || '10:00',
        pickup_address: storageData?.schedulingData?.serviceType === 'domicilio' 
          ? (storageData?.schedulingData?.address || 'Dirección a confirmar')
          : 'Recojo en sede',
        
        // Análisis solicitados
        selected_tests: items.map(item => `• ${item.name} - S/. ${item.price.toFixed(2)}`).join('\n'),
        total_amount: total.toFixed(2),
        payment_method: selectedPaymentMethod.toUpperCase(),
        
        // Información del cliente
        client_reference: storageData?.schedulingData?.clientReference || 'Público General',
        applied_tariff: 'Base',
        
        // Datos de la solicitud
        request_date: new Date().toLocaleDateString('es-PE'),
        request_time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
      }

      console.log('📧 Enviando datos por EmailJS:', emailData)
      
      const success = await sendPickupNotification(emailData)
      
      if (success) {
        console.log('✅ Email enviado exitosamente')
        return true
      } else {
        console.error('❌ Error al enviar email')
        return false
      }
      
    } catch (error) {
      console.error('❌ Error al preparar email:', error)
      return false
    }
  }

  // Manejar el checkout
  const handleCheckout = async () => {
    setIsProcessingPayment(true)

    try {
      // Enviar notificación por email
      const emailSent = await sendEmailNotification()

      if (!emailSent) {
        toast({
          title: "Error al enviar notificación",
          description: "Hubo un problema al enviar la notificación por email.",
          variant: "destructive",
        })
        setIsProcessingPayment(false)
        return
      }

      if (selectedPaymentMethod === "yape") {
        // Abrir Yape
        window.open(generateYapeLink(), '_blank')
      } else if (selectedPaymentMethod === "plin") {
        // Abrir Plin
        window.open(generatePlinLink(), '_blank')
      }

      // Mostrar mensaje de éxito y instrucciones
      toast({
        title: "✅ Solicitud procesada",
        description: "Se ha enviado la notificación al laboratorio. Revisa las instrucciones importantes.",
        duration: 5000,
      })

      // Limpiar carrito y cerrar modal
      setTimeout(() => {
        clearCart()
        setIsCheckoutOpen(false)
        setIsProcessingPayment(false)
        
        // Limpiar datos del localStorage
        localStorage.removeItem('scheduling-data')
        localStorage.removeItem('patient-data')
        
        // Mostrar alerta importante sobre la captura
        toast({
          title: "🔥 ¡MUY IMPORTANTE!",
          description: "Guarda la captura del pago y muéstrala al llegar al laboratorio. Sin ella NO podrás acceder al servicio.",
          duration: 10000,
        })
      }, 2000)

    } catch (error) {
      console.error("Error al procesar:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
        variant: "destructive",
      })
      setIsProcessingPayment(false)
    }
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
      <div className="mb-8 text-center mt-8">
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
                    Proceder al pago
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Finalizar Recojo de Muestras</DialogTitle>
                    <DialogDescription>Selecciona tu método de pago para completar la solicitud</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    
                    {/* Métodos de pago - SOLO YAPE/PLIN */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Método de pago disponible</Label>
                      <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <div className="flex items-center space-x-2 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer">
                          <RadioGroupItem value="yape" id="yape" />
                          <Label htmlFor="yape" className="flex-1 cursor-pointer">
                            <div className="font-medium text-purple-700">💜 Yape</div>
                            <div className="text-sm text-purple-600">Pago rápido y seguro desde tu app Yape</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                          <RadioGroupItem value="plin" id="plin" />
                          <Label htmlFor="plin" className="flex-1 cursor-pointer">
                            <div className="font-medium text-blue-700">💙 Plin</div>
                            <div className="text-sm text-blue-600">Pago interbancario desde tu app Plin</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Detalles del número para transferir */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                        <Label className="font-semibold text-blue-900">
                          Número para {selectedPaymentMethod.toUpperCase()}
                        </Label>
                      </div>
                      <div className="flex items-center justify-between bg-white p-4 rounded border-2 border-dashed border-blue-300">
                        <span className="font-mono text-2xl font-bold text-blue-700">{YAPE_PLIN_NUMBER}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          className="ml-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          {copiedNumber ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copiedNumber ? "Copiado" : "Copiar"}
                        </Button>
                      </div>
                      <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded">
                        <p className="font-medium mb-2">📱 Instrucciones de pago:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Abre tu app {selectedPaymentMethod.toUpperCase()}</li>
                          <li>Transfiere <strong>S/. {total.toFixed(2)}</strong> al número mostrado</li>
                          <li>En concepto escribe: <strong>"Análisis laboratorio"</strong></li>
                          <li>Confirma la transacción</li>
                          <li><strong>¡GUARDA LA CAPTURA!</strong> La necesitarás en el laboratorio</li>
                        </ol>
                      </div>
                    </div>

                    {/* Alerta importante */}
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <strong>MUY IMPORTANTE:</strong> Al llegar al laboratorio debes mostrar la captura del pago de {selectedPaymentMethod.toUpperCase()}. 
                        Sin la captura no podrás acceder al servicio.
                      </AlertDescription>
                    </Alert>

                    {/* Resumen del pedido */}
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Resumen del pedido</Label>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span className="font-medium">S/. {item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total a pagar</span>
                          <span className="text-blue-600">S/. {total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isProcessingPayment}>
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" 
                      onClick={handleCheckout}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? "Procesando..." : `Pagar con ${selectedPaymentMethod.toUpperCase()}`}
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

