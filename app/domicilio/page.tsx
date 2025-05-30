"use client"
import { useState } from "react"
import Image from "next/image"
import { Mail, Phone, MessageSquare, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function DomicilioExacto() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="w-full bg-white">
      {/* ========================= HERO ========================= */}
      <section
        className="relative flex h-[350px] sm:h-[400px] md:h-[45vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/banner1.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/10" />
        {/* Contenedor centrado para el bloque de texto */}
        <div className="relative z-10 flex h-full w-full items-end pb-8 sm:pb-12">
          <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-light" style={{ color: "#172b3e" }}>
              Llegamos a la comodidad de tu hogar
            </h2>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: "#172b3e" }}>
              Servicio de <span style={{ color: "#2d8dea" }}>atención a domicilio</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ======= SECCIÓN 2 COLUMNAS (Texto + Botones / Imagen) ======= */}
      <section className="w-full bg-white py-8 sm:py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-12">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                En Laboratorio Clínico Lopez nos adaptamos a las nuevas necesidades de nuestros pacientes ofreciendo un servicio de toma de muestras a domicilio confiable, seguro y cómodo. Con 5 años de experiencia en el sector, brindamos atención personalizada con altos estándares de calidad, precisión y calidez humana. Nuestro objetivo es facilitar el acceso a análisis clínicos desde la tranquilidad de tu hogar, previa coordinación del día y hora de atención a través de los siguientes canales de contacto.
              </p>

              <div className="space-y-3">
                <a
                  href="mailto:referencia@laboratorioslopez.com"
                  className="flex items-center justify-center gap-2 bg-[#1e5fad] text-white p-3 sm:p-4 rounded-lg hover:bg-[#1e5fad]/90 transition-colors text-sm sm:text-base"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-center">Escríbenos a: referencia@laboratorioslopez.com</span>
                </a>

                <a
                  href="tel:+51900649599"
                  className="flex items-center justify-center gap-2 bg-[#1e5fad] text-white p-3 sm:p-4 rounded-lg hover:bg-[#1e5fad]/90 transition-colors text-sm sm:text-base"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-center">Infórmanos al: 900 649599</span>
                </a>

                <a
                  href="https://wa.me/51900649599"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white p-3 sm:p-4 rounded-lg hover:bg-[#25D366]/90 transition-colors text-sm sm:text-base"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-center">Escríbenos por WhatsApp: +51 900 649599</span>
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start mt-6 lg:mt-0">
              <Image
                src="/domi.jpg"
                alt="Servicio a domicilio"
                width={400}
                height={300}
                className="object-cover rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ ACORDEÓN CON 4 ÍTEMS ============ */}
      <section className="w-full bg-white pb-8 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Acordeón responsivo */}
          <div className="flex w-full flex-col gap-4 mx-auto max-w-5xl">
            {/* Item 1 */}
            <div>
              <button
                onClick={() => handleToggle(1)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-6 py-4
                  text-left
                  text-base
                  font-semibold
                  text-blue-900
                  bg-transparent
                  border-2
                  border-blue-900
                  rounded-md
                  hover:bg-blue-50
                  transition-colors
                  focus:outline-none
                "
              >
                <span>Servicios disponibles en domicilio</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform ${activeIndex === 1 ? "rotate-180" : ""}`} />
              </button>
              {activeIndex === 1 && (
                <div
                  className="
                    mt-1
                    px-6 py-4
                    border-l-2 border-r-2 border-b-2 border-blue-900
                    rounded-b-md
                    text-gray-800
                  "
                >
                  <Image
                    src="/tinteros.jpeg"
                    alt="Servicios disponibles"
                    width={1000}
                    height={400}
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Item 2 */}
            <div>
              <button
                onClick={() => handleToggle(2)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-6 py-4
                  text-left
                  text-base
                  font-semibold
                  text-blue-900
                  bg-transparent
                  border-2
                  border-blue-900
                  rounded-md
                  hover:bg-blue-50
                  transition-colors
                  focus:outline-none
                "
              >
                <span>Horario de atención</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform ${activeIndex === 2 ? "rotate-180" : ""}`} />
              </button>
              {activeIndex === 2 && (
                <div
                  className="
                    mt-1
                    px-6 py-4
                    border-l-2 border-r-2 border-b-2 border-blue-900
                    rounded-b-md
                    text-gray-800
                  "
                >
                  Atención en domicilios: lunes a domingo 06:00 – 18:00 horas.
                </div>
              )}
            </div>

            {/* Item 3 */}
            <div>
              <button
                onClick={() => handleToggle(3)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-6 py-4
                  text-left
                  text-base
                  font-semibold
                  text-blue-900
                  bg-transparent
                  border-2
                  border-blue-900
                  rounded-md
                  hover:bg-blue-50
                  transition-colors
                  focus:outline-none
                "
              >
                <span>Medios de pago</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform ${activeIndex === 3 ? "rotate-180" : ""}`} />
              </button>
              {activeIndex === 3 && (
                <div
                  className="
                    mt-1
                    px-6 py-4
                    border-l-2 border-r-2 border-b-2 border-blue-900
                    rounded-b-md
                    text-gray-800
                  "
                >
                  Efectivo (monto exacto).
                  <br />
                  Tarjeta de crédito/débito (MPOS).
                </div>
              )}
            </div>

            {/* Item 4 */}
            <div>
              <button
                onClick={() => handleToggle(4)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-6 py-4
                  text-left
                  text-base
                  font-semibold
                  text-blue-900
                  bg-transparent
                  border-2
                  border-blue-900
                  rounded-md
                  hover:bg-blue-50
                  transition-colors
                  focus:outline-none
                "
              >
                <span>Consideraciones</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform ${activeIndex === 4 ? "rotate-180" : ""}`} />
              </button>
              {activeIndex === 4 && (
                <div
                  className="
                    mt-1
                    px-6 py-4
                    border-l-2 border-r-2 border-b-2 border-blue-900
                    rounded-b-md
                    text-gray-800
                  "
                >
                  El servicio de atención a domicilio considera un cargo adicional.
                  <br />
                  El alcance geográfico del servicio le será precisado al momento de coordinar tu atención.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

