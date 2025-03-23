"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Exportamos los artículos para poder usarlos en otras páginas
export const articles = [
  {
    id: 1,
    title: "La importancia de los chequeos preventivos",
    description: "Descubre por qué los exámenes regulares son clave para mantener una buena salud.",
    content:
      "Los chequeos médicos preventivos son fundamentales para detectar enfermedades en etapas tempranas, cuando son más tratables. Estos exámenes periódicos permiten a los médicos identificar factores de riesgo y problemas de salud antes de que se conviertan en condiciones graves. Además, proporcionan una línea base para comparar cambios en tu salud a lo largo del tiempo. Recomendamos realizar un chequeo completo anual que incluya análisis de sangre, presión arterial, índice de masa corporal y otros exámenes específicos según tu edad, género y factores de riesgo personales.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024-03-10",
    category: "Prevención",
    slug: "chequeos-preventivos",
    author: "Dr. Carlos Mendoza",
    authorImage: "/placeholder.svg?height=100&width=100",
    authorRole: "Director Médico",
  },
  {
    id: 2,
    title: "Guía completa de análisis prenatales",
    description: "Todo lo que necesitas saber sobre los análisis durante el embarazo.",
    content:
      "Los análisis prenatales son pruebas médicas realizadas durante el embarazo para evaluar la salud de la madre y el desarrollo del bebé. Estos exámenes son cruciales para identificar posibles complicaciones y garantizar un embarazo saludable. Durante el primer trimestre, se realizan análisis de sangre para determinar el grupo sanguíneo, factor Rh, niveles hormonales y detectar posibles infecciones. En el segundo trimestre, se realizan pruebas para detectar anomalías cromosómicas y evaluar el riesgo de preeclampsia. En el tercer trimestre, se monitorea la glucosa en sangre y se realizan cultivos para detectar infecciones que podrían afectar al bebé durante el parto.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024-03-08",
    category: "Maternidad",
    slug: "analisis-prenatales",
    author: "Dra. María Sánchez",
    authorImage: "/placeholder.svg?height=100&width=100",
    authorRole: "Especialista en Ginecología",
  },
  {
    id: 3,
    title: "Interpretación de resultados de laboratorio",
    description: "Aprende a entender tus resultados de análisis clínicos.",
    content:
      "Interpretar los resultados de laboratorio puede ser confuso para muchas personas. Es importante entender que cada valor tiene un rango de referencia que puede variar según el laboratorio, la edad, el sexo y otros factores. Los valores fuera del rango de referencia no siempre indican un problema de salud grave, pero deben ser evaluados por un profesional médico. En este artículo, explicamos los componentes más comunes de un análisis de sangre, como hemoglobina, glucosa, colesterol y enzimas hepáticas, y qué significan sus valores. También proporcionamos consejos sobre qué preguntas hacer a tu médico cuando recibas resultados anormales.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024-03-05",
    category: "Educación",
    slug: "interpretacion-resultados",
    author: "Dr. Roberto Gómez",
    authorImage: "/placeholder.svg?height=100&width=100",
    authorRole: "Patólogo Clínico",
  },
  {
    id: 4,
    title: "Nutrición y análisis de sangre: ¿Qué revelan sobre tu dieta?",
    description: "Descubre cómo los análisis de sangre pueden ayudarte a optimizar tu alimentación.",
    content:
      "Los análisis de sangre pueden proporcionar información valiosa sobre tu estado nutricional y cómo tu dieta está afectando tu salud. Niveles de vitaminas, minerales, proteínas y lípidos en sangre pueden indicar deficiencias nutricionales o excesos que podrían estar impactando tu bienestar. Por ejemplo, bajos niveles de hierro pueden indicar anemia, mientras que altos niveles de colesterol LDL pueden sugerir un consumo excesivo de grasas saturadas. En este artículo, exploramos los principales marcadores nutricionales en los análisis de sangre y cómo interpretar estos resultados para mejorar tu alimentación y salud general.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024-03-01",
    category: "Nutrición",
    slug: "nutricion-analisis-sangre",
    author: "Dra. Laura Torres",
    authorImage: "/placeholder.svg?height=100&width=100",
    authorRole: "Nutricionista Clínica",
  },
]

export function DigitalLibrary() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section className="w-full py-12 md:py-24 bg-[#f3f9fe] relative overflow-hidden snap-start">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-light tracking-tighter sm:text-4xl md:text-5xl text-black font-sans">
              Biblioteca Digital
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Recursos y artículos sobre salud y bienestar
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {articles.slice(0, 3).map((article) => (
            <motion.div key={article.id} variants={item}>
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-[#1E5FAD] text-white px-3 py-1 rounded-full text-sm">
                    {article.category}
                  </div>
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <time className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <Button
                      asChild
                      variant="outline"
                      className="text-[#1E5FAD] border-blue-200 hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                    >
                      <Link href={`/biblioteca/${article.slug}`}>Leer más</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            variant="outline"
            className="text-[#1E5FAD] border-blue-200 hover:bg-blue-50 hover:scale-105 transition-all duration-300"
          >
            <Link href="/biblioteca">Ver todos los artículos</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

