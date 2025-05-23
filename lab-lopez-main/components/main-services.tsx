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
        className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-[#f3f9fe] snap-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container px-3 sm:px-4 md:px-6 relative z-10">
          <motion.div
            className="flex flex-col items-center space-y-4 sm:space-y-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full max-w-4xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter text-center text-black font-sans mb-4 md:mb-0">
                Perfiles de bienestar
              </h2>
              <div className="flex justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                <div className="relative">
                  <Link href="/servicios" passHref>
                    <Button
                      asChild
                      className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
                    >
                      <span>VER MAS</span>
                    </Button>
                  </Link>
                  <div className="absolute -bottom-1 sm:-bottom-2 left-2 sm:left-4 w-2 sm:w-4 h-2 sm:h-4 bg-[#3da64a] rounded-full"></div>
                  <div className="absolute -bottom-2 sm:-bottom-4 left-1 sm:left-2 w-1 sm:w-2 h-1 sm:h-2 bg-[#3da64a] rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="mt-2 sm:mt-4 max-w-2xl lg:max-w-4xl text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 px-4">
              Servicios diseñados para mejorar tu calidad de vida
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={item}>
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="relative h-36 sm:h-40 md:h-48">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover"
                      priority={true}
                      loading="eager"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <Button
                      asChild
                      className="bg-[#1e5fad] hover:bg-[#1e5fad]/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
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

