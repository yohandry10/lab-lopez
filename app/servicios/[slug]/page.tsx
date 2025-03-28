"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { Building2, Syringe, TestTube, Calendar, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/cart-context"

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
      "Este perfil proporciona una mirada a tu salud en general, abordando las dudas más comunes en hombres entre 18 y 45 años. Compuesto por 16 pruebas, te ayudará a cuidar tu bienestar.",
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
      "Este perfil te permite evaluar tu salud sexual mediante exámenes específicos, garantizando una atención integral y preventiva. Incluye pruebas especializadas que te ofrecen recomendaciones personalizadas.",
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
      "Este perfil analiza los procesos metabólicos para brindarte una imagen clara de cómo funciona tu organismo y detectar posibles alteraciones.",
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
    tests: [
      "Hemograma",
      "Ácido fólico",
      "Glucosa",
      "Colesterol total",
      "Colesterol HDL",
      "Colesterol LDL",
      "Colesterol VLDL",
      "Triglicéridos",
      "Creatinina",
      "Urea",
      "Ácido úrico",
      "Transaminasa oxalacética TGO",
      "Transaminasa pirúvica TGP",
      "Vitamina B12",
      "Vitamina D",
      "TSH",
      "PRO - BNP",
      "PSA",
      "Examen completo de orina",
    ],
    conditions: [
      "Los análisis en sangre requieren ayuno mínimo de 8 horas y máximo de 12 horas.",
      "Si tomas medicamentos o sigues un tratamiento, infórmalo al momento de la toma de muestra.",
    ],
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
    tests: ["Glucosa", "Insulina basal", "Hemoglobina glicosilada"],
    conditions: [
      "Los análisis en sangre requieren ayuno mínimo de 8 horas y máximo de 12 horas.",
      "Si tomas medicamentos o sigues un tratamiento, infórmalo al momento de la toma de muestra.",
    ],
  },
}

export default function ServicePage() {
  const params = useParams()
  const { addItem } = useCart()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const slug = params.slug
    if (typeof slug !== "string") {
      notFound()
      return
    }

    const foundProfile = profiles[slug]
    if (!foundProfile) {
      notFound()
      return
    }

    setProfile(foundProfile)
  }, [params])

  if (!profile) {
    return (
      <div className="container px-4 py-12 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f9fe]">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <Image src={profile.image || "/placeholder.svg"} alt={profile.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-white"
          >
            <div className="text-sm text-blue-300 mb-4">Perfiles de bienestar ROE</div>
            <h1 className="text-4xl md:text-5xl font-light mb-4">{profile.title}</h1>
            <Button className="bg-[#1e5fad] hover:bg-[#1e5fad]/90">
              Agenda tu perfil
              <span className="ml-2 text-sm">en sede o en domicilio</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-12">
                <h2 className="text-blue-600 font-medium mb-4">ENTÉRATE DE QUE SE TRATA</h2>
                <h3 className="text-2xl font-bold mb-4">{profile.description}</h3>
                <p className="text-gray-600">{profile.content}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Disponible en</h4>
                    <div className="flex flex-wrap gap-4">
                      {profile.locations.map((location) => (
                        <div key={location} className="flex items-center gap-2">
                          {location === "Sede" ? (
                            <Building2 className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Syringe className="h-5 w-5 text-blue-600" />
                          )}
                          <span>{location}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Tipo de muestra</h4>
                    <div className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-blue-600" />
                      <span>
                        {Array.isArray(profile.sampleType) ? profile.sampleType.join(", ") : profile.sampleType}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Edad</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span>{profile.ageRequirement}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center mb-8">
                <div className="text-3xl font-bold">S/ {profile.price.toFixed(2)}</div>
                <div className="flex gap-4">
                  <div className="text-green-600 font-medium">Disponible</div>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() =>
                      addItem({
                        id: params.slug,
                        name: profile.title,
                        price: profile.price,
                      })
                    }
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Agregar al carrito
                  </Button>
                </div>
              </div>

              {profile.tests && profile.tests.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-blue-600 font-medium mb-6">CONOCE UN POCO MÁS</h2>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">¿Qué incluye este perfil?</h3>
                      <ul className="space-y-2">
                        {profile.tests.map((test, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                            {test}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {profile.conditions && profile.conditions.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4">CONDICIONES PREANALÍTICAS</h3>
                        <div className="space-y-4">
                          <h4 className="font-medium">Recomendaciones previas a la toma de muestra</h4>
                          <ul className="space-y-2">
                            {profile.conditions.map((condition, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                                {condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                *Producto y precio exclusivo desde nuestro sitio web www.lablopez.com
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

