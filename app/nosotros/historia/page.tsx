"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function HistoriaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24">
        {/* Background image */}
        <Image
          src="/placeholder.svg?height=800&width=1600&text=Historia%20ROE"
          alt="Historia ROE"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#EAF7FF]/50" />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Link href="/nosotros" className="inline-flex items-center text-[#2F71B8] hover:text-[#2EB9A5] mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Nosotros
            </Link>
            <div className="text-[#2F71B8] mb-4 text-lg font-medium">
              Desde <span className="underline">1953</span> cuidando de ti y tu familia
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-8 font-sans">Nuestra Historia</h3>
            <p className="text-gray-800 text-lg mb-8">
              Conoce la trayectoria de más de 5 años de excelencia en servicios de laboratorio
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-sm text-blue-600 uppercase tracking-wider mb-4">NUESTRA TRAYECTORIA</h2>
              <h3 className="text-3xl font-bold mb-6">Más de 5 años de excelencia</h3>
              <div className="prose max-w-none">
                <p>
                  En el año 1953, el Dr. Carlos Roe Gómez fundó Laboratorio Clínico Roe con una visión clara: ofrecer
                  servicios de análisis clínicos de la más alta calidad a la población peruana. Lo que comenzó como un
                  pequeño laboratorio, se ha convertido hoy en el primer centro privado de análisis clínicos del país.
                </p>
                <p className="mt-4">
                  Durante nuestros primeros años, nos enfocamos en establecer estándares de calidad rigurosos y en
                  formar un equipo de profesionales altamente capacitados. Para la década de 1970, ya éramos reconocidos
                  por nuestra precisión y confiabilidad en los resultados.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-blue-600 uppercase tracking-wider mb-4">HITOS IMPORTANTES</h2>
              <div className="relative border-l-2 border-blue-200 pl-8 space-y-12">
                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">1953</div>
                  <p className="text-gray-600">Fundación del Laboratorio Clínico Roe por el Dr. Carlos Roe Gómez.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">1970</div>
                  <p className="text-gray-600">
                    Expansión de servicios y consolidación como referente en análisis clínicos en Lima.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">1985</div>
                  <p className="text-gray-600">
                    Incorporación de tecnología automatizada para análisis, siendo pioneros en el país.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">1995</div>
                  <p className="text-gray-600">Apertura de nuevas sedes en distritos estratégicos de Lima.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2005</div>
                  <p className="text-gray-600">
                    Implementación del sistema de gestión de calidad y certificación ISO 9001.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2010</div>
                  <p className="text-gray-600">
                    Expansión a nivel nacional con apertura de sedes en Arequipa y Trujillo.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2019</div>
                  <p className="text-gray-600">
                    Inicia operaciones las sedes Lince y San Antonio, en los distritos de Lince y Miraflores
                    respectivamente, sumando 22 puntos de toma de muestra a nivel nacional. Concluimos exitosamente la
                    implementación de un sistema de procesamiento de pruebas de laboratorio totalmente automatizado con
                    la mayor tecnología de vanguardia del mercado peruano, incorporando un sistema de analizadores
                    preanalíticos de bandas transportadoras de muestras integradas a plataformas Cobas 8000™ 100%
                    automatizadas a nuestros procesos analíticos.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2020</div>
                  <p className="text-gray-600">
                    Inauguramos una renovada y rediseñada área de Microbiología, contando con el analizador MALDI-TOF
                    MS™ para la identificación microbiana para un diagnóstico precoz de bacteriemias. Así nos
                    convertimos en el primer laboratorio privado del país en contar con esta tecnología de vanguardia.
                    Implementamos el servicio de procesamiento de la prueba molecular para SARS-CoV2 por PCR, con 18
                    puntos de toma de muestra a nivel nacional, ofreciendo el servicio mediante un agendamiento digital
                    de citas para un flujo ordenado y diferenciado de nuestros pacientes. Implementamos la plataforma
                    digital Syxmex 9100™ para la especialidad de hematología, permitiendo obtener la morfología digital
                    de imágenes celulares junto con los reportes de resultados.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2021</div>
                  <p className="text-gray-600">
                    Inicia operaciones las sedes Cañete, Chinchón, San Martín y Bellavista; sumando un total de 26
                    puntos de toma de muestra a nivel nacional.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2022</div>
                  <p className="text-gray-600">
                    Inicia operaciones la sede San Juan de Lurigancho, ampliando a 27 nuestra red de puntos de toma de
                    muestra, distribuidos a nivel nacional. Obtuvimos la acreditación ISO 15189, la máxima norma de
                    calidad en laboratorio clínico, siendo el primer laboratorio clínico en Perú con el mayor número de
                    pruebas acreditadas.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2023</div>
                  <p className="text-gray-600">
                    Inicia operaciones la sede La Molina, Breña y San Juan de Miraflores; ampliando a 30, nuestros
                    puntos de toma de muestra a nivel nacional.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mt-16 text-center">
              <Button asChild className="bg-blue-700 hover:bg-blue-800">
                <Link href="/nosotros">Volver a Nosotros</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

