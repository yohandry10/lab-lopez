"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

// Evita conflicto con la clase nativa Map
import { MapIcon, MapPin, Beaker, Activity, Home, Heart } from "lucide-react"

// Ajusta las rutas de tus componentes según tu proyecto
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

// Datos de ejemplo (puedes modificarlos)
const sedesData = [
  {
    name: "Sede San Juan de Miraflores (dentro la Clínica Sagrada Familia del Sur)",
    address: "Av. Miguel Iglesias 625, San Juan de Miraflores 15824",
    mapUrl: "https://www.google.com/maps?cid=7289839656241431265",
    services: [
      { label: "Atención a domicilio", icon: Home },
      { label: "Perfiles de laboratorio", icon: Beaker },
      { label: "Marcadores tumorales", icon: Activity },
    ],
  },
  {
    name: "Sede Santa Anita",
    address: "María Parado de Bellido 1106, Santa Anita 15008",
    mapUrl: "https://www.google.com/maps/place/Laboratorio+Cl%C3%ADnico+E.I.R.L.+LOPEZ/@-12.0443879,-76.9750924,17z",
    services: [
      { label: "Atención a domicilio", icon: Home },
      { label: "Perfiles de laboratorio", icon: Beaker },
      { label: "Marcadores tumorales", icon: Activity },
    ],
  },
]

export default function SedesPage() {
  // Estado local para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Filtra por nombre o dirección (lowercase)
  const filteredSedes = sedesData.filter((sede) => {
    const text = searchTerm.toLowerCase()
    return sede.name.toLowerCase().includes(text) || sede.address.toLowerCase().includes(text)
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f9fe]">
      {/* Hero con imagen */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <Image
          src="/lab.webp" // Ajusta a tu imagen real
          alt="ROE Sedes"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#EAF7FF]/50" />
        <div className="container relative h-full flex flex-col justify-end items-start max-w-[1200px] mx-auto px-4 pb-12">
          <p className="text-lg font-medium mb-4">
            Cada vez <span className="text-[#2F71B8]">más cerca</span>
          </p>
          <h3 className="text-6xl font-normal text-black tracking-tight mb-6">Nuestras sedes</h3>
        </div>
      </section>

      {/* Sección principal de sedes */}
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          {/* Encabezado alineado a la izquierda, como el hero */}
          <div className="mb-12 flex flex-col items-start">
            <p className="text-sm font-medium uppercase text-[#2F71B8] tracking-wide mb-2">Nuestros laboratorios</p>
            <h2 className="text-4xl font-bold text-black">Encuentra la sede de tu preferencia</h2>
          </div>

          {/* Barra de controles (ordenar, buscar, filtrar) */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            {/* Ordenar sedes */}
            <div className="flex items-center gap-3">
              <p className="font-semibold text-gray-700">Ordenar sedes</p>
              <div className="flex gap-2">
                {/* Botón "Por cercanía" con ícono de mapa */}
                <Button variant="outline" className="border-[#2F71B8] text-[#2F71B8] hover:bg-[#2F71B8]/10">
                  <div className="flex items-center gap-2">
                    <MapIcon className="text-[#2F71B8]" size={18} />
                    <span>Por cercanía</span>
                  </div>
                </Button>
                {/* Botón "Alfabéticamente" */}
                <Button variant="outline" className="border-[#2F71B8] text-[#2F71B8] hover:bg-[#2F71B8]/10">
                  Alfabéticamente
                </Button>
              </div>
            </div>

            {/* Buscador */}
            <Input
              placeholder="Busca una dirección aquí"
              className="w-full md:max-w-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Select de filtro (sin texto extra) */}
            <Select>
              <SelectTrigger className="w-44 border-[#2F71B8] text-[#2F71B8] hover:bg-[#2F71B8]/10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="analisis">Análisis clínicos</SelectItem>
                <SelectItem value="pcr">Prueba molecular PCR</SelectItem>
                <SelectItem value="antigenica">Prueba antigénica</SelectItem>
                <SelectItem value="bienestar">Perfiles de bienestar</SelectItem>
                <SelectItem value="domicilio">Atención a domicilio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contenedor principal: lista de sedes y mapa */}
          <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
            {/* Lista de sedes (filtradas) */}
            <div className="space-y-4 max-h-[700px] overflow-auto pr-2">
              {filteredSedes.length === 0 ? (
                <p className="text-gray-500">No se encontraron sedes con "{searchTerm}".</p>
              ) : (
                filteredSedes.map((sede) => (
                  <Card key={sede.name} className="shadow-md bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-[#1c1c1c]">{sede.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Dirección */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="text-[#2F71B8]" size={18} />
                        <span>{sede.address}</span>
                      </div>
                      {/* Listado de servicios con íconos */}
                      {sede.services && (
                        <ul className="space-y-1 pl-1">
                          {sede.services.map(({ label, icon: Icon }) => (
                            <li key={label} className="flex items-center gap-2 text-gray-700">
                              <Icon className="text-[#2F71B8]" size={18} />
                              <span>{label}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Botón "Ver mapa" */}
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-[#2F71B8] text-[#2F71B8] hover:bg-[#2F71B8]/10"
                      >
                        <Link href={sede.mapUrl} target="_blank">
                          Ver mapa
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Mapa embebido */}
            <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1b7OzJRfeajKYENY34IOfr2RnKIRdoAI&ehbc=2E312F&z=10"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                title="Mapa de sedes"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Horario de atención */}
      <section className="w-full bg-white py-6 border-t">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h3 className="text-lg font-semibold mb-2 text-[#2F71B8]">Horario de atención</h3>
          <ul className="text-gray-700 text-base space-y-1">
            <li><strong>San Juan de Miraflores:</strong> Lunes - Sábado 8:00 - 17:00 horas</li>
            <li><strong>Santa Anita:</strong> Lunes - Sábado 7:00 - 19:00 horas</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

