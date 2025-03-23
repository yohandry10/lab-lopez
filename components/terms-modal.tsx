"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TermsModalProps {
  trigger: React.ReactNode
}

export function TermsModal({ trigger }: TermsModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Términos y Condiciones</DialogTitle>
          <DialogDescription>Última actualización: 09 de marzo de 2025</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <h3 className="font-medium text-base">1. Introducción</h3>
          <p>
            Estos Términos y Condiciones regulan el uso de los servicios ofrecidos por ROE Laboratorio Clínico,
            incluyendo el sitio web, aplicaciones móviles y servicios relacionados.
          </p>

          <h3 className="font-medium text-base">2. Protección de Datos Personales</h3>
          <p>
            2.1. ROE Laboratorio Clínico tratará tus datos personales de acuerdo con la legislación vigente en materia
            de protección de datos personales.
          </p>
          <p>
            2.2. Los datos personales que proporcionas serán utilizados con la finalidad de gestionar tu cuenta,
            brindarte los servicios solicitados, y en caso de que lo autorices, enviarte información sobre promociones y
            servicios.
          </p>
          <p>
            2.3. Tus datos no serán cedidos a terceros sin tu consentimiento, excepto en los casos previstos por la ley.
          </p>

          <h3 className="font-medium text-base">3. Derechos del Usuario</h3>
          <p>
            3.1. Puedes ejercer tus derechos de acceso, rectificación, cancelación, oposición, limitación y portabilidad
            enviando un correo electrónico a privacidad@roe.com.
          </p>
          <p>
            3.2. Tienes derecho a retirar tu consentimiento en cualquier momento, sin que ello afecte a la licitud del
            tratamiento basado en el consentimiento previo a su retirada.
          </p>

          <h3 className="font-medium text-base">4. Confidencialidad</h3>
          <p>
            4.1. ROE Laboratorio Clínico se compromete a mantener la confidencialidad de tus datos médicos y resultados
            de análisis.
          </p>
          <p>4.2. El acceso a tus resultados está protegido mediante credenciales de acceso que solo tú conoces.</p>

          <h3 className="font-medium text-base">5. Responsabilidades</h3>
          <p>
            5.1. ROE Laboratorio Clínico no se hace responsable de la interpretación que el usuario pueda hacer de los
            resultados de los análisis sin la supervisión de un profesional médico.
          </p>
          <p>5.2. Los resultados de los análisis deben ser interpretados por un profesional médico cualificado.</p>

          <h3 className="font-medium text-base">6. Modificaciones</h3>
          <p>
            6.1. ROE Laboratorio Clínico se reserva el derecho de modificar estos Términos y Condiciones en cualquier
            momento.
          </p>
          <p>6.2. Las modificaciones entrarán en vigor a partir de su publicación en el sitio web.</p>

          <h3 className="font-medium text-base">7. Ley Aplicable</h3>
          <p>7.1. Estos Términos y Condiciones se rigen por la legislación peruana.</p>
          <p>
            7.2. Cualquier controversia derivada de estos Términos y Condiciones será sometida a la jurisdicción de los
            tribunales de Lima, Perú.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

