"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function QualityCommitment() {
  return (
    <section className="w-full py-12 md:py-16 bg-[#f3f9fe]">
      <div className="container px-4 md:px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <div className="text-sm text-blue-600 uppercase tracking-wider">LABORATORIO CLÍNICO LOPEZ</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black font-sans">
                  Compromiso con la calidad
                </h2>
                <p className="text-gray-600">
                  Proporcionamos a nuestros pacientes y usuarios una{" "}
                  <span className="text-blue-600">excelente atención, calidez, oportunidad y confiabilidad</span> en
                  nuestros resultados.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
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
              className="relative h-[300px] rounded-lg overflow-hidden"
            >
              <Image src="/maps.png" alt="Mapa de sedes" fill className="object-contain" priority />

              <Link
                href="/sedes"
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-blue-900 text-center"
              >
                <h4 className="font-bold text-sm">Visítanos en</h4>
                <p className="text-sm">nuestras sedes</p>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

