"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function QualityCommitment() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-[#f3f9fe]">
      <div className="container px-3 sm:px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <div className="space-y-3 sm:space-y-4 text-center md:text-left">
                <div className="text-xs sm:text-sm text-[#1e5fad] uppercase tracking-wider font-medium">
                  LABORATORIO CLÍNICO LOPEZ
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black font-sans leading-tight">
                  Compromiso con la calidad
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  Proporcionamos a nuestros pacientes y usuarios una{" "}
                  <span className="text-[#1e5fad] font-semibold">excelente atención, calidez, oportunidad y confiabilidad</span> en
                  nuestros resultados.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center md:justify-start">
                  <Button asChild className="bg-[#1e5fad] hover:bg-[#1e5fad]/90 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 font-semibold">
                    <Link href="/nosotros">Nuestra política de calidad</Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Imagen del mapa + botón */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden order-1 md:order-2"
            >
              <Image 
                src="/maps.png" 
                alt="Mapa de sedes" 
                fill 
                className="object-contain" 
                priority 
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <Link
                href="/sedes"
                className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 
                          bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 
                          rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                          text-blue-900 text-center hover:scale-105 border border-white/20"
              >
                <h4 className="font-bold text-xs sm:text-sm">Visítanos en</h4>
                <p className="text-xs sm:text-sm">nuestras sedes</p>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

