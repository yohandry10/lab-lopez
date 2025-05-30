"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail } from "lucide-react"
import { Facebook, Instagram } from "lucide-react"
import { SiTiktok, SiYoutube } from "react-icons/si"

const socialMedia = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/ElSapoPsicodelico",
    icon: <Facebook className="w-8 h-8" />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/ElSapoPsicodelico/",
    icon: <Instagram className="w-8 h-8" />,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@ElSapoPsicodelico",
    icon: <SiTiktok className="w-8 h-8" />,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/yourchannel",
    icon: <SiYoutube className="w-8 h-8" />,
  },
]

function FooterSocialIcons() {
  return (
    <div className="flex justify-center gap-4 mb-4">
      {socialMedia.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className="relative group overflow-hidden"
        >
          <div className="relative flex items-center justify-center w-16 h-16 border-2 border-[#0d2e6b] rounded-full transition duration-500 ease-out overflow-hidden group-hover:bg-[#0d2e6b]">
            {/* Fondo animado */}
            <span
              className="absolute inset-0 bg-gradient-to-t from-[#0d2e6b] to-black transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-out"
              style={{ zIndex: 0 }}
            />
            {/* Ícono siempre en azul */}
            <span className="relative z-10 text-[#0d2e6b] group-hover:drop-shadow-lg transition-shadow duration-500 ease-out">
              {item.icon}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

export function Footer() {
  // Estado para el año
  const [year, setYear] = useState<string>("")

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  return (
    <footer className="w-full border-t bg-white">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Sobre nosotros</h3>
            <p className="text-sm text-gray-600">
              Laboratorio LOPEZ, brindando servicios de calidad y confianza desde hace 5 años.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/analisis" className="text-sm text-gray-600 hover:text-gray-900">
                  Análisis
                </Link>
              </li>
              <li>
                <Link href="/sedes" className="text-sm text-gray-600 hover:text-gray-900">
                  Sedes
                </Link>
              </li>
              <li>
                <Link href="/domicilio" className="text-sm text-gray-600 hover:text-gray-900">
                  Servicio a domicilio
                </Link>
              </li>
              <li>
                <Link href="/resultados" className="text-sm text-gray-600 hover:text-gray-900">
                  Resultados
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Teléfono: 900 649599</li>
              <li>Email: referencia@laboratorioslopez.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Horario</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>San Juan de Miraflores: Lunes - Sábado 8:00 - 17:00 horas</li>
              <li>Santa Anita: Lunes - Sábado 7:00 - 19:00 horas</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/libro-reclamaciones">
            <Image
              src="/lib.webp"
              alt="Libro de Reclamaciones"
              width={80}
              height={80}
              className="object-contain cursor-pointer"
            />
          </Link>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Laboratorio Lopez. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer

