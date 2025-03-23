"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const services = [
  {
    id: 1,
    title: "Salud Sexual",
    description: "Confianza, libertad y seguridad para elegir",
    image: "/placeholder.svg?height=200&width=300",
    link: "/servicios/salud-sexual",
  },
  {
    id: 2,
    title: "Masculino Edad de Oro",
    description: "Experiencia, sabiduría y plenitud",
    image: "/placeholder.svg?height=200&width=300",
    link: "/servicios/masculino-edad-oro",
  },
  {
    id: 3,
    title: "Diabetes bajo control",
    description: "Estilo de vida, autocontrol, bienestar",
    image: "/placeholder.svg?height=200&width=300",
    link: "/servicios/diabetes-control",
  },
]

export function MainServices() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="w-full py-12 md:py-24 bg-[#f3f9fe] snap-start">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Contenedor que mantiene el título centrado */}
          <div className="relative w-full">
            <h2 className="text-3xl font-light tracking-tighter sm:text-4xl md:text-5xl text-center text-black font-sans">
              Perfiles de bienestar
            </h2>
            {/* Botón con efecto de burbuja que redirige a la página de servicios */}
            <div className="absolute right-20 -top-6 transform -translate-y-1/2">
              <div className="relative">
                <Link href="/servicios" passHref>
                  <Button
                    asChild
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg relative z-10"
                  >
                    <span>VER MAS</span>
                  </Button>
                </Link>
                {/* Cola de la burbuja */}
                <div className="absolute -bottom-2 left-4 w-4 h-4 bg-orange-500 rounded-full"></div>
                <div className="absolute -bottom-4 left-2 w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Servicios diseñados para mejorar tu calidad de vida
          </p>
        </motion.div>

        {/* Tarjetas de servicios */}
        <motion.div
          ref={ref}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12"
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={item}>
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    className="w-full bg-[#1E5FAD] hover:bg-[#3DA64A] transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href={service.link}>Ver detalles</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

