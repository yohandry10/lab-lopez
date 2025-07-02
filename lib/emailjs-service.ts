import emailjs from '@emailjs/browser'

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  serviceId: 'service_4sqnwqn',
  templateId: 'template_dpn6qa1',
  publicKey: 'S_A_4T5S6rlFQSUWfW'
}

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey)

export interface EmailData {
  // Información del paciente
  patient_name: string
  patient_lastname: string
  document_type: string
  document_number: string
  patient_phone: string
  patient_email: string
  birth_date: string
  
  // Detalles del recojo
  programming_type: string
  pickup_date: string
  pickup_time: string
  pickup_address: string
  
  // Análisis y pagos
  selected_tests: string
  total_amount: string
  payment_method: string
  
  // Información del cliente
  client_reference: string
  applied_tariff: string
  
  // Datos de la solicitud
  request_date: string
  request_time: string
}

export const sendPickupNotification = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log('📧 Enviando notificación por EmailJS...')
    console.log('Datos del email:', emailData)

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        // Mapear todas las variables del template
        patient_name: emailData.patient_name,
        patient_lastname: emailData.patient_lastname,
        document_type: emailData.document_type,
        document_number: emailData.document_number,
        patient_phone: emailData.patient_phone,
        patient_email: emailData.patient_email,
        birth_date: emailData.birth_date,
        programming_type: emailData.programming_type,
        pickup_date: emailData.pickup_date,
        pickup_time: emailData.pickup_time,
        pickup_address: emailData.pickup_address,
        selected_tests: emailData.selected_tests,
        total_amount: emailData.total_amount,
        payment_method: emailData.payment_method,
        client_reference: emailData.client_reference,
        applied_tariff: emailData.applied_tariff,
        request_date: emailData.request_date,
        request_time: emailData.request_time,
      }
    )

    console.log('✅ Email enviado exitosamente:', response)
    return true

  } catch (error) {
    console.error('❌ Error al enviar email:', error)
    return false
  }
}

// Función de prueba para verificar la conexión
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    const testData: EmailData = {
      patient_name: 'Prueba',
      patient_lastname: 'Test',
      document_type: 'DNI',
      document_number: '12345678',
      patient_phone: '987654321',
      patient_email: 'test@test.com',
      birth_date: '1990-01-01',
      programming_type: 'Según horario',
      pickup_date: '2024-01-15',
      pickup_time: '10:00',
      pickup_address: 'Dirección de prueba',
      selected_tests: '• GLUCOSA - S/. 12.00\n• COLESTEROL - S/. 12.00',
      total_amount: '24.00',
      payment_method: 'YAPE',
      client_reference: 'Público General',
      applied_tariff: 'Base',
      request_date: new Date().toLocaleDateString(),
      request_time: new Date().toLocaleTimeString()
    }

    return await sendPickupNotification(testData)
  } catch (error) {
    console.error('Error en prueba de EmailJS:', error)
    return false
  }
} 