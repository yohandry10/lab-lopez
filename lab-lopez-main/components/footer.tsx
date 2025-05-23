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
    icon: <Facebook className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/ElSapoPsicodelico/",
    icon: <Instagram className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@ElSapoPsicodelico",
    icon: <SiTiktok className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/yourchannel",
    icon: <SiYoutube className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
  },
]

function FooterSocialIcons() {
  return (
    <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      {socialMedia.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className="relative group overflow-hidden"
        >
          <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 border-[#0d2e6b] rounded-full transition duration-500 ease-out overflow-hidden group-hover:bg-[#0d2e6b] hover:scale-110">
            {/* Fondo animado */}
            <span
              className="absolute inset-0 bg-gradient-to-t from-[#0d2e6b] to-black transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-out"
              style={{ zIndex: 0 }}
            />
            {/* Ícono siempre en azul */}
            <span className="relative z-10 text-[#0d2e6b] group-hover:text-white group-hover:drop-shadow-lg transition-all duration-500 ease-out">
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
      <div className="container py-6 sm:py-8 px-3 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sobre nosotros */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-gray-900">
              Sobre nosotros
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Laboratorio LOPEZ, brindando servicios de calidad y confianza desde 1990.
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-gray-900">
              Enlaces rápidos
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/analisis" className="text-sm sm:text-base text-gray-600 hover:text-[#1e5fad] transition-colors duration-200">
                  Análisis
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-sm sm:text-base text-gray-600 hover:text-[#1e5fad] transition-colors duration-200">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/biblioteca" className="text-sm sm:text-base text-gray-600 hover:text-[#1e5fad] transition-colors duration-200">
                  Biblioteca
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contacto */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-gray-900">
              Contacto
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="h-4 w-4 text-[#1e5fad]" />
                <span>(01) 123-4567</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4 text-[#1e5fad]" />
                <span>contacto@lopez.com</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <div className="h-4 w-4 rounded-full bg-[#1e5fad] flex-shrink-0"></div>
                <span>Av. Principal 123</span>
              </li>
            </ul>
          </div>
          
          {/* Horario */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-gray-900">
              Horario
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
              <li>Lunes a Viernes: 7:00 - 20:00</li>
              <li>Sábados: 7:00 - 14:00</li>
              <li>Domingos: 7:00 - 12:00</li>
            </ul>
          </div>
        </div>
        
        {/* Redes sociales */}
        <div className="mt-6 sm:mt-8">
          <FooterSocialIcons />
        </div>
        
        {/* Libro de reclamaciones */}
        <div className="mt-4 sm:mt-6 flex justify-center">
          <Link href="/libro-reclamaciones" className="group">
            <Image
              src="/lib.webp"
              alt="Libro de Reclamaciones"
              width={80}
              height={80}
              className="object-contain cursor-pointer transition-transform duration-300 group-hover:scale-110 w-16 h-16 sm:w-20 sm:h-20"
              sizes="80px"
            />
          </Link>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-gray-600">
          © {new Date().getFullYear()} Laboratorio Lopez. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer

