"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testEmailConnection, sendPickupNotification } from '@/lib/emailjs-service'
import { useToast } from '@/components/ui/use-toast'

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const { toast } = useToast()

  const handleTestEmail = async () => {
    setIsLoading(true)
    setResult('')

    try {
      console.log('🚀 Iniciando prueba de EmailJS...')
      
      const success = await testEmailConnection()
      
      if (success) {
        setResult('✅ Email enviado exitosamente!')
        toast({
          title: "✅ Éxito",
          description: "El email de prueba se envió correctamente",
        })
      } else {
        setResult('❌ Error al enviar email')
        toast({
          title: "❌ Error",
          description: "Hubo un problema al enviar el email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error en prueba:', error)
      setResult(`❌ Error: ${error}`)
      toast({
        title: "❌ Error",
        description: "Error en la conexión con EmailJS",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestWithRealData = async () => {
    setIsLoading(true)
    setResult('')

    try {
      const emailData = {
        patient_name: 'Juan Carlos',
        patient_lastname: 'Pérez García',
        document_type: 'DNI',
        document_number: '12345678',
        patient_phone: '987654321',
        patient_email: 'juan.perez@example.com',
        birth_date: '1985-03-15',
        programming_type: 'Según horario (10:00 y 13:00 horas)',
        pickup_date: '15/01/2024',
        pickup_time: '10:00',
        pickup_address: 'Av. Javier Prado 123, San Isidro',
        selected_tests: '• GLUCOSA - S/. 12.00\n• COLESTEROL - S/. 15.00\n• TRIGLICÉRIDOS - S/. 10.00',
        total_amount: '37.00',
        payment_method: 'YAPE',
        client_reference: 'Público General',
        applied_tariff: 'Base',
        request_date: new Date().toLocaleDateString('es-PE'),
        request_time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
      }

      console.log('📧 Enviando email con datos reales:', emailData)
      
      const success = await sendPickupNotification(emailData)
      
      if (success) {
        setResult('✅ Email con datos reales enviado exitosamente!')
        toast({
          title: "✅ Éxito",
          description: "El email con datos reales se envió correctamente",
        })
      } else {
        setResult('❌ Error al enviar email con datos reales')
        toast({
          title: "❌ Error",
          description: "Hubo un problema al enviar el email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error en prueba:', error)
      setResult(`❌ Error: ${error}`)
      toast({
        title: "❌ Error",
        description: "Error en la conexión con EmailJS",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Prueba de EmailJS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Configuración actual:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Service ID:</strong> service_4sqnwqn</li>
              <li><strong>Template ID:</strong> template_dpn6qa1</li>
              <li><strong>Public Key:</strong> S_A_4T5S6rlFQSUWfW</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleTestEmail}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Enviando..." : "📧 Enviar Email de Prueba"}
            </Button>
            
            <Button 
              onClick={handleTestWithRealData}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? "Enviando..." : "📋 Enviar con Datos Reales"}
            </Button>
          </div>

          {result && (
            <div className={`p-4 rounded-lg border ${
              result.includes('✅') 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="font-medium">{result}</p>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p><strong>Nota:</strong> Esta página es solo para pruebas. Los emails se enviarán al email configurado en EmailJS.</p>
            <p><strong>Revisa:</strong> La consola del navegador para logs detallados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 