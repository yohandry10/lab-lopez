"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { Building2, Syringe, TestTube, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

// Datos de los perfiles
const profiles = {
  "prevencion-total": {
    title: "Perfil Prevención total",
    description:
      "Una visión clara de lo que importa para poner tu salud en perspectiva. Este perfil te permitirá conocer de manera general cómo está tu organismo, para prevenir y/o tratar alguna enfermedad de forma oportuna. La salud es una relación entre tú y tu cuerpo, cuidarla depende de ti; pero permítenos acompañarte.",
    content:
      "Este perfil está diseñado para brindarte un panorama general de tu salud. Con exámenes clave, podrás identificar áreas de riesgo y tomar medidas preventivas a tiempo.",
    price: 0,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    price: 0,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    price: 0,
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    price: 0,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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

type ProfileType = typeof profiles[keyof typeof profiles]

export default function ServicePage() {
  const params = useParams()
  const [profile, setProfile] = useState<ProfileType | null>(null)

  useEffect(() => {
    const slug = params.slug
    if (typeof slug !== "string") {
      notFound()
      return
    }

    const foundProfile = profiles[slug as keyof typeof profiles]
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
      <section className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
        <Image src={profile.image || "/placeholder.svg"} alt={profile.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                {profile.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                {profile.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-blue-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">ENTÉRATE DE QUE SE TRATA</h2>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 leading-tight">{profile.description}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{profile.content}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Disponible en</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {profile.locations.map((location) => (
                        <div key={location} className="flex items-center gap-2">
                          {location === "Sede" ? (
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          ) : (
                            <Syringe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          )}
                          <span className="text-sm sm:text-base">{location}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Tipo de muestra</h4>
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="text-sm sm:text-base">
                        {Array.isArray(profile.sampleType) ? profile.sampleType.join(", ") : profile.sampleType}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Edad</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="text-sm sm:text-base">{profile.ageRequirement}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 sm:mb-8">
                <div className="text-green-600 font-medium text-sm sm:text-base">Disponible</div>
                <Button
                  className="w-full sm:w-auto bg-[#25d366] hover:bg-[#25d366]/90 text-white px-6 py-3 h-auto text-sm sm:text-base"
                  onClick={() => {
                    const message = `Hola, estoy interesado en el ${profile.title}. ¿Podrían darme más información?`
                    const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`
                    window.open(whatsappUrl, '_blank')
                  }}
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.079.549 4.090 1.595 5.945L0 24l6.256-1.623c1.783.986 3.821 1.514 5.939 1.514 6.624 0 11.99-5.367 11.99-11.988C24.186 5.367 18.641.001 12.017.001zM12.017 21.989c-1.737 0-3.449-.434-4.96-1.263l-.356-.213-3.675.964.983-3.595-.233-.372C2.69 15.963 2.201 14.018 2.201 11.987c0-5.411 4.404-9.815 9.816-9.815 2.618 0 5.082 1.021 6.941 2.88 1.858 1.858 2.88 4.322 2.88 6.941-.001 5.411-4.406 9.816-9.821 9.816zm5.384-7.348c-.295-.148-1.744-.861-2.014-.958-.269-.098-.465-.148-.661.148-.197.295-.762.958-.934 1.155-.172.197-.344.221-.639.074-.295-.148-1.244-.459-2.37-1.462-.875-.781-1.465-1.746-1.637-2.041-.172-.295-.018-.455.129-.602.132-.131.295-.344.443-.516.148-.172.197-.295.295-.492.098-.197.049-.369-.025-.516-.074-.148-.661-1.591-.906-2.18-.238-.574-.479-.496-.661-.504-.172-.008-.369-.01-.565-.01-.197 0-.516.074-.787.369-.271.295-1.034 1.01-1.034 2.463 0 1.453 1.059 2.857 1.207 3.054.148.197 2.080 3.176 5.041 4.456.705.305 1.256.487 1.686.623.708.225 1.353.193 1.863.117.568-.084 1.744-.713 1.989-1.402.246-.689.246-1.279.172-1.402-.074-.123-.271-.197-.566-.345z"/>
                  </svg>
                  <span className="hidden sm:inline">Consultar por WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </Button>
              </div>

              {profile.tests && profile.tests.length > 0 && (
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <h2 className="text-blue-600 font-medium mb-4 sm:mb-6 text-sm sm:text-base">CONOCE UN POCO MÁS</h2>
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">¿Qué incluye este perfil?</h3>
                      <ul className="space-y-2">
                        {profile.tests.map((test, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {profile.conditions && profile.conditions.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">CONDICIONES PREANALÍTICAS</h3>
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm sm:text-base">Recomendaciones previas a la toma de muestra</h4>
                          <ul className="space-y-2">
                            {profile.conditions.map((condition, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                                <span>{condition}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                *Producto y precio exclusivo desde nuestro sitio web www.lablopez.com
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

