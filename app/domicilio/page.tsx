"use client"
import { useState } from "react"
import Image from "next/image"
import { Mail, Phone, MessageSquare, ChevronDown } from "lucide-react"

export default function DomicilioExacto() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="w-full bg-white">
      {/* ========================= HERO ========================= */}
      <section
        className="relative flex h-[45vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/banner1.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/10" />
        {/* Contenedor centrado para el bloque de texto */}
        <div className="relative z-10 flex h-full w-full items-end pb-12">
          <div className="max-w-3xl mx-auto text-center px-4" style={{ transform: "translateX(-25%)" }}>
            <h2 className="text-xl font-light" style={{ color: "#172b3e" }}>
              Llegamos a la comodidad de tu hogar
            </h2>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl" style={{ color: "#172b3e" }}>
              Servicio de <span style={{ color: "#2d8dea" }}>atención a domicilio</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ======= SECCIÓN 2 COLUMNAS (Texto + Botones / Imagen) ======= */}
      <section className="w-full bg-white py-10 md:py-16">
        {/* Se reduce el gap para acercar más la imagen al texto */}
        <div
          className="container mx-auto grid items-start gap-2 px-4 md:grid-cols-2"
          style={{ transform: "translateX(165px)" }}
        >
          {/* Columna Izquierda: Texto + Botones */}
          <div className="flex flex-col space-y-6 text-center md:text-left">
            <p className="text-gray-800 leading-relaxed">
              Pensando siempre en el bienestar de nuestros pacientes, somos los pioneros en incorporar el servicio de
              toma de muestra a domicilio, manteniendo los altos estándares de seguridad, profesionalismo y servicio;
              característicos de nuestra atención en sedes.
            </p>
            <p className="text-gray-800 leading-relaxed">
              En la actualidad, este servicio se encuentra disponible los 365 días del año previa coordinación del día y
              hora de atención a través de los siguientes canales de contacto:
            </p>

            {/* BOTONES GRANDES Y ANCHOS */}
            <div className="flex flex-col space-y-4 items-center md:items-start">
              {/* Botón 1 */}
              <a
                href="mailto:correo@labroe.com"
                className="
                  inline-flex 
                  w-full 
                  max-w-xl 
                  items-center 
                  justify-center 
                  rounded-md 
                  bg-blue-600 
                  px-6 py-4 
                  text-white 
                  text-base 
                  font-semibold 
                  whitespace-nowrap
                  shadow-md
                  hover:bg-blue-700 
                  transition-colors
                "
              >
                <Mail className="mr-2 h-5 w-5" />
                <span>Escríbenos a: correo@labroe.com</span>
              </a>

              {/* Botón 2 */}
              <a
                href="tel:015025255"
                className="
                  inline-flex 
                  w-full 
                  max-w-xl 
                  items-center 
                  justify-center 
                  rounded-md 
                  bg-blue-600 
                  px-6 py-4 
                  text-white 
                  text-base 
                  font-semibold 
                  whitespace-nowrap
                  shadow-md
                  hover:bg-blue-700 
                  transition-colors
                "
              >
                <Phone className="mr-2 h-5 w-5" />
                <span>Infórmanos al: (01) 502 5255</span>
              </a>

              {/* Botón 3 */}
              <a
                href="https://wa.me/51999999999"
                className="
                  inline-flex 
                  w-full 
                  max-w-xl 
                  items-center 
                  justify-center 
                  rounded-md 
                  bg-green-600 
                  px-6 py-4 
                  text-white 
                  text-base 
                  font-semibold 
                  whitespace-nowrap
                  shadow-md
                  hover:bg-green-700 
                  transition-colors
                "
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                <span>Escríbenos por WhatsApp: +51 999 999 999</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Imagen (más cerca gracias al gap-2) */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/domi.jpg"
              alt="Servicio a domicilio"
              width={400}
              height={400}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ============ ACORDEÓN CON 4 ÍTEMS ============ */}
      <section className="w-full bg-white pb-16">
        {/* Se conserva el translateX(-190px) */}
        <div className="container mx-auto px-4" style={{ transform: "translateX(159px)" }}>
          {/* Se quita el max-w-2xl para que ocupe más ancho y llegue hasta la imagen */}
          <div className="flex w-full flex-col gap-4 mx-auto">
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
                <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${activeIndex === 1 ? "rotate-180" : ""}`} />
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
                    src="/icons.jpg"
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
                <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${activeIndex === 2 ? "rotate-180" : ""}`} />
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
                <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${activeIndex === 3 ? "rotate-180" : ""}`} />
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
                <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${activeIndex === 4 ? "rotate-180" : ""}`} />
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

