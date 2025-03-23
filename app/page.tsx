"use client"

import { HeroSlider } from "@/components/hero-slider"
import { MainServices } from "@/components/main-services"
import { QualityCommitment } from "@/components/quality-commitment"
import { DigitalLibrary } from "@/components/digital-library"
import { ParallaxProvider } from "react-scroll-parallax"
import { motion } from "framer-motion"
import Link from "next/link"
import { User, Stethoscope, Building2 } from "lucide-react"

export default function Home() {
  return (
    <ParallaxProvider>
      <div className="flex min-h-screen flex-col">
        <HeroSlider />

        {/* User Types Section with "Consulta tus resultados" */}
        <section className="bg-[#f3f9fe] py-8 relative">
          <div className="container mx-auto px-4">
            {/* Box with shadow containing the content */}
            <div className="bg-[#f3f9fe] shadow-lg rounded-lg p-8 relative -mt-16 z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Bloque: Consulta tus resultados */}
                <div className="md:col-span-1 text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Consulta tus resultados</h2>
                  <p className="text-sm text-blue-600">Revisa el estado y detalle de tus análisis</p>
                </div>

                {/* Círculos azules (Pacientes, Médicos, Empresas) */}
                <div className="md:col-span-3 flex justify-between px-8 gap-8">
                  {/* Pacientes */}
                  <div className="relative">
                    <Link
                      href="/pacientes"
                      className="flex flex-col items-center justify-center
                                 w-56 h-56
                                 bg-[#0066FF] hover:bg-[#0052CC]
                                 rounded-full text-white
                                 transition-colors group relative z-10"
                    >
                      <User className="h-16 w-16 mb-4" />
                      <span className="text-xl font-bold">Pacientes</span>
                    </Link>
                    <div
                      className="absolute -left-5 top-1/2
                                 w-12 h-12 bg-[#0066FF]
                                 transform rotate-45 -translate-y-1/2 z-0"
                    ></div>
                  </div>

                  {/* Médicos */}
                  <div className="relative">
                    <Link
                      href="/medicos"
                      className="flex flex-col items-center justify-center
                                 w-56 h-56
                                 bg-[#0066FF] hover:bg-[#0052CC]
                                 rounded-full text-white
                                 transition-colors group relative z-10"
                    >
                      <Stethoscope className="h-16 w-16 mb-4" />
                      <span className="text-xl font-bold">Médicos</span>
                    </Link>
                    <div
                      className="absolute -left-5 top-1/2
                                 w-12 h-12 bg-[#0066FF]
                                 transform rotate-45 -translate-y-1/2 z-0"
                    ></div>
                  </div>

                  {/* Empresas */}
                  <div className="relative">
                    <Link
                      href="/empresas"
                      className="flex flex-col items-center justify-center
                                 w-56 h-56
                                 bg-[#0066FF] hover:bg-[#0052CC]
                                 rounded-full text-white
                                 transition-colors group relative z-10"
                    >
                      <Building2 className="h-16 w-16 mb-4" />
                      <span className="text-xl font-bold">Empresas</span>
                    </Link>
                    <div
                      className="absolute -left-5 top-1/2
                                 w-12 h-12 bg-[#0066FF]
                                 transform rotate-45 -translate-y-1/2 z-0"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resto de secciones con animaciones */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MainServices />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <QualityCommitment />
        </motion.div>

        {/* Se eliminó la sección de LocationsSection para que sus contenidos queden disponibles únicamente en las rutas */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <DigitalLibrary />
        </motion.div>
      </div>
    </ParallaxProvider>
  )
}

