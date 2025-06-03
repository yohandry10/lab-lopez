"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin } from "lucide-react"

export function LocationsSection() {
  const locations = [
    {
      name: "Sede Santa Anita",
      address: "María Parado de Bellido 1106, Santa Anita 15008",
      hours: "Lun-Sáb: 7:00 - 19:00",
      link: "/sedes/santa-anita",
    },
    {
      name: "Sede San Juan de Miraflores (dentro la Clínica Sagrada Familia del Sur)",
      address: "Av. Miguel Iglesias 625, San Juan de Miraflores 15824",
      hours: "Lun-Sáb: 7:00 - 19:00",
      link: "/sedes/san-juan-miraflores",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#1E5FAD] px-3 py-1 text-sm text-white">Nuestras sedes</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1E5FAD]">Ubicaciones</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Encuentra la sede más cercana a ti y visítanos
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
          {locations.map((location, index) => (
            <motion.div
              key={index}
              className="flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#3DA64A]" />
                  <h3 className="font-bold text-[#1E5FAD]">{location.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{location.address}</p>
                <p className="text-sm text-gray-500">{location.hours}</p>
              </div>
              <div className="pt-4">
                <Button asChild className="w-full bg-[#1E5FAD] hover:bg-[#3DA64A]">
                  <Link href={location.link}>Ver detalles</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button asChild className="bg-[#1E5FAD] hover:bg-[#3DA64A]">
            <Link href="/sedes">Ver todas las sedes</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

