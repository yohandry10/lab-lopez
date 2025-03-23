"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Datos de los perfiles
const profiles = {
  "prevencion-total": {
    title: "Perfil Prevención total",
    description:
      "Una visión clara de lo que importa para poner tu salud en perspectiva. Este perfil te permitirá conocer de manera general cómo está tu organismo, para prevenir y/o tratar alguna enfermedad de forma oportuna. La salud es una relación entre tú y tu cuerpo, cuidarla depende de ti; pero permítenos acompañarte.",
    content:
      "Este perfil está diseñado para brindarte un panorama general de tu salud. Con exámenes clave, podrás identificar áreas de riesgo y tomar medidas preventivas a tiempo.",
    price: 0,
    image: "/placeholder.svg?height=600&width=1200&text=Prevenci%C3%B3n+total",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Cualquier edad",
    tests: [],
    conditions: [],
  },
  "hombre-saludable": {
    title: "Perfil Hombre saludable",
    description:
      "Este perfil proporciona una mirada a tu salud en general, abordando las dudas más comunes que pueden surgir en los hombres entre 18 y 45 años. Compuesto por 16 pruebas, te ayudará a cuidar tu bienestar.",
    content:
      "Pensado para hombres que desean un chequeo integral, este perfil evalúa indicadores clave para que tomes decisiones informadas sobre tu salud.",
    price: 0,
    image: "/placeholder.svg?height=600&width=1200&text=Hombre+saludable",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "18-45 años",
    tests: [],
    conditions: [],
  },
  "mujer-saludable": {
    title: "Perfil Mujer saludable",
    description:
      "Este perfil es esencial para examinar tu salud, controlar tus niveles hormonales y conocer tu riesgo a desarrollar enfermedades crónicas antes de los 45 años.",
    content:
      "Diseñado especialmente para mujeres, este perfil te ayudará a mantener un control integral de tu salud, anticipando posibles complicaciones.",
    price: 0,
    image: "/placeholder.svg?height=600&width=1200&text=Mujer+saludable",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Hasta 45 años",
    tests: [],
    conditions: [],
  },
  preoperatorio: {
    title: "Perfil Preoperatorio",
    description:
      "Si tu médico te ha solicitado exámenes preoperatorios, conoce las pruebas que integran nuestro perfil preoperatorio.",
    content:
      "Este perfil reúne las pruebas necesarias para garantizar que estés en óptimas condiciones antes de una cirugía.",
    price: 0,
    image: "/placeholder.svg?height=600&width=1200&text=Preoperatorio",
    locations: ["Sede"],
    sampleType: "General",
    ageRequirement: "Mayor de 18",
    tests: [],
    conditions: [],
  },
  "salud-sexual": {
    title: "Perfil Salud sexual",
    description:
      "La salud sexual requiere un enfoque positivo y respetuoso, con experiencias seguras y libres de temores. Con información oportuna, adquiere hábitos saludables.",
    content:
      "Este perfil te permite evaluar tu salud sexual mediante exámenes específicos, garantizando una atención integral y preventiva.",
    price: 300.0,
    image: "/placeholder.svg?height=600&width=1200&text=Salud+Sexual",
    locations: ["Sede", "Domicilio"],
    sampleType: "Sangre",
    ageRequirement: "18 años en adelante",
    tests: [
      "HIV 1/2 anticuerpo antígeno",
      "Hepatitis B, antígeno australiano (HBsAg)",
      "Hepatitis B, anticore total (anti-HBcAg)",
      "Hepatitis C anticuerpos",
      "VDRL",
    ],
    conditions: [
      "Los análisis en sangre NO requieren ayuno.",
      "Informa sobre medicamentos o tratamientos durante la toma de muestra.",
    ],
  },
  "salud-metabolica": {
    title: "Perfil Salud metabólica",
    description:
      "Evalúa cómo trabaja tu metabolismo para transformar lo que comes en energía y detectar desbalances que puedan afectar tu bienestar.",
    content:
      "Este perfil analiza los procesos metabólicos para brindarte una imagen clara de cómo funciona tu organismo.",
    price: 0,
    image: "/placeholder.svg?height=600&width=1200&text=Salud+metab%C3%B3lica",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Cualquier edad",
    tests: [],
    conditions: [],
  },
  "masculino-edad-oro": {
    title: "Perfil masculino Edad de oro",
    description:
      "Conoce los cambios normales y aquellos que pueden ser señal de un problema de salud. Este perfil te ayuda a entender y monitorear tu organismo con el paso de los años.",
    content:
      "Especialmente diseñado para hombres mayores de 45, este perfil integra diversas pruebas para evaluar tu salud integral y anticipar posibles complicaciones.",
    price: 690.0,
    image: "/placeholder.svg?height=600&width=1200&text=Edad+de+Oro",
    locations: ["Sede", "Domicilio"],
    sampleType: ["Sangre", "Orina"],
    ageRequirement: "45 años en adelante",
    tests: [],
    conditions: [],
  },
  "diabetes-control": {
    title: "Perfil Diabetes bajo control",
    description: "Monitorea tus niveles de azúcar para detectar indicios de prediabetes o diabetes a tiempo.",
    content:
      "A través de exámenes específicos, este perfil evalúa tus niveles de glucosa y otros indicadores críticos, permitiéndote tomar medidas preventivas.",
    price: 120.0,
    image: "/placeholder.svg?height=600&width=1200&text=Diabetes+Control",
    locations: ["Sede", "Domicilio"],
    sampleType: "Sangre",
    ageRequirement: "18 años en adelante",
    tests: [],
    conditions: [],
  },
}

export default function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProfiles = useMemo(() => {
    return Object.entries(profiles).filter(([slug, profile]) =>
      profile.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-[#f3f9fe]">
      {/* Hero con Imagen de Fondo */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="/placeholder.svg?height=600&width=1200&text=Servicios"
          alt="Hero de servicios"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Todos Nuestros Servicios</h1>
            <p className="text-lg text-gray-100">Selecciona tu perfil. Escribe tu búsqueda aquí</p>
          </motion.div>
        </div>
      </section>

      {/* Sección de Buscador */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar perfil..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
          />
        </div>
      </section>

      {/* Listado de Perfiles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProfiles.length === 0 ? (
            <p className="text-center text-gray-600">No se encontraron perfiles.</p>
          ) : (
            <div className="space-y-16">
              {filteredProfiles.map(([slug, profile]) => (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="border-b pb-8 mb-8"
                >
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    {/* Imagen del servicio */}
                    <div className="relative h-[300px]">
                      <Image
                        src={profile.image || "/placeholder.svg"}
                        alt={profile.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    {/* Contenido del servicio */}
                    <div className="text-left">
                      <h2 className="text-2xl font-light text-black mb-4">{profile.title}</h2>
                      <p className="text-gray-600 mb-4">{profile.description}</p>
                      <p className="text-gray-600 mb-4">{profile.content}</p>
                      <div className="flex gap-4 mb-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                          <Link href={`/servicios/${slug}`}>Ver detalles</Link>
                        </Button>
                      </div>
                      {profile.price > 0 && (
                        <div className="text-xl font-bold text-black">S/ {profile.price.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

