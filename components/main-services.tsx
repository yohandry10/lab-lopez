"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const services = [
  {
    id: 1,
    title: "Salud Sexual",
    description: "Confianza, libertad y seguridad para elegir",
    image: "/diabetes.jpg",
    link: "/servicios/salud-sexual",
  },
  {
    id: 2,
    title: "Masculino Edad de Oro",
    description: "Experiencia, sabiduría y plenitud",
    image: "/viejitos.jpg",
    link: "/servicios/masculino-edad-oro",
  },
  {
    id: 3,
    title: "Diabetes bajo control",
    description: "Estilo de vida, autocontrol, bienestar",
    image: "/perfil.jpg",
    link: "/servicios/diabetes-control",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function MainServices() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.section
        className="w-full py-12 md:py-24 bg-[#f3f9fe] snap-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full flex flex-col items-center md:flex-row md:justify-center md:items-center">
              <h2 className="text-3xl font-light tracking-tighter sm:text-4xl md:text-5xl text-center text-black font-sans md:text-left md:mr-8">
                Perfiles de bienestar
              </h2>
              <div className="mt-4 md:mt-0 md:relative">
                <Link href="/servicios" passHref>
                  <Button
                    asChild
                    className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-transform hover:scale-105"
                  >
                    <span>VER MAS</span>
                  </Button>
                </Link>
              </div>
            </div>
            <p className="mt-4 max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Servicios diseñados para mejorar tu calidad de vida
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={item}>
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover"
                      priority={true}
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      asChild
                      className="bg-[#1e5fad] hover:bg-[#1e5fad]/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg relative z-10"
                    >
                      <Link href={service.link}>VER DETALLES</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  )
}

