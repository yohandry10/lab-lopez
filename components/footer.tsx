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
    <footer className="bg-gray-100">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Branding: Logo grande sin forma ovalada */}
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/lopez.PNG"
              alt="Logo"
              width={200}
              height={200}
              className="w-[200px] h-[200px] object-contain"
            />
            <p className="text-gray-500 text-xl font-semibold text-center">Desde 1953 cuidando de ti y tu familia</p>
          </div>
          {/* Enlaces útiles */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces útiles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resultados">
                  <span className="text-gray-500 hover:text-blue-700">Resultados</span>
                </Link>
              </li>
              <li>
                <Link href="/pacientes">
                  <span className="text-gray-500 hover:text-blue-700">Pacientes</span>
                </Link>
              </li>
              <li>
                <Link href="/medicos">
                  <span className="text-gray-500 hover:text-blue-700">Médicos</span>
                </Link>
              </li>
              <li>
                <Link href="/empresas">
                  <span className="text-gray-500 hover:text-blue-700">Empresas</span>
                </Link>
              </li>
              <li>
                <Link href="/analisis">
                  <span className="text-gray-500 hover:text-blue-700">Consulta de análisis</span>
                </Link>
              </li>
              <li>
                <Link href="/covid">
                  <span className="text-gray-500 hover:text-blue-700">Agenda una prueba Covid-19</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Más sobre nosotros */}
          <div>
            <h3 className="font-bold text-lg mb-4">Más sobre nosotros</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros">
                  <span className="text-gray-500 hover:text-blue-700">Nosotros</span>
                </Link>
              </li>
              <li>
                <Link href="/sedes">
                  <span className="text-gray-500 hover:text-blue-700">Sedes</span>
                </Link>
              </li>
              <li>
                <Link href="/comprobantes">
                  <span className="text-gray-500 hover:text-blue-700">Comprobantes electrónicos</span>
                </Link>
              </li>
              <li>
                <Link href="/trabaja">
                  <span className="text-gray-500 hover:text-blue-700">Trabaja con nosotros</span>
                </Link>
              </li>
              <li>
                <Link href="/contacto">
                  <span className="text-gray-500 hover:text-blue-700">Contacto</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-700" />
                <span className="text-gray-500">(01) 513 6666</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-700" />
                <span className="text-gray-500">(054) 272 273</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-700" />
                <span className="text-gray-500">933 829 995</span>
              </li>
              <li>
                <Link href="/contacto">
                  <span className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                    <Mail className="h-5 w-5" />
                    <span>Escríbenos</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Íconos de redes sociales */}
        <FooterSocialIcons />
        <div className="text-center text-gray-500 text-sm">
          <p>© {year || "..."}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

