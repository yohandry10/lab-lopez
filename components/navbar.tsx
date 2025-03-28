"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
  MapPin,
  Calendar,
  FileText,
  Home,
  Stethoscope,
  Building2,
  ChevronDown,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState, useCallback, useRef, useEffect } from "react"
import { SheetClose } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/analisis", etiqueta: "Análisis" },
  { href: "#", etiqueta: "Resultados", hasDropdown: true },
  { href: "/sedes", etiqueta: "Sedes" },
  { href: "/domicilio", etiqueta: "Servicio a domicilio" },
]

const mobileNavItems = [
  { href: "/", etiqueta: "Inicio", icono: Home },
  { href: "/analisis", etiqueta: "Análisis", icono: FileText },
  { href: "#", etiqueta: "Resultados", icono: Calendar, hasDropdown: true },
  { href: "/sedes", etiqueta: "Sedes", icono: MapPin },
]

// Enlaces de navegación para escritorio: Si la ruta actual es resultados,
// se asigna "text-blue-900" a todos los enlaces, de lo contrario "text-white".
const NavLink = ({
  href,
  etiqueta,
  hasDropdown,
  onClick,
}: { href: string; etiqueta: string; hasDropdown?: boolean; onClick?: () => void }) => {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  if (hasDropdown) {
    return (
      <button
        onClick={onClick}
        className={`text-lg font-medium transition-all rounded-lg px-4 py-2 ${
          isHomePage 
            ? "text-white hover:text-[#2EB9A5]" 
            : "text-white bg-[#1e5fad] hover:bg-[#1e5fad]/90 hover:shadow-lg"
        }`}
      >
        {etiqueta}
        <ChevronDown className="h-4 w-4 inline-block ml-1" />
      </button>
    )
  }

  return (
    <Link
      href={href}
      className={`text-lg font-medium transition-all rounded-lg px-4 py-2 ${
        isHomePage 
          ? "text-white hover:text-[#2EB9A5]" 
          : "text-white bg-[#1e5fad] hover:bg-[#1e5fad]/90 hover:shadow-lg"
      }`}
    >
      {etiqueta}
    </Link>
  )
}

export function Navbar() {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showResultadosDropdown, setShowResultadosDropdown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isResultadosPage = pathname.startsWith("/resultados")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    setIsOpen(false)
  }, [logout])

  const toggleResultadosDropdown = useCallback(() => {
    setShowResultadosDropdown((prev) => !prev)
  }, [])

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResultadosDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav>
        {/* Contenedor que centra el Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            {/* Izquierda: Menú móvil + Logotipo */}
            <div className="flex items-center gap-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" aria-label="Alternar Menú">
                    <Menu className="h-6 w-6 text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4">
                    <SheetClose asChild>
                      <Link href="/" className="flex items-center gap-2">
                        <Image
                          src="/lopez.png"
                          alt="ROE Logo"
                          width={160}
                          height={160}
                          className="object-contain"
                          priority
                        />
                      </Link>
                    </SheetClose>
                    {mobileNavItems.map(({ href, etiqueta, icono: Icon, hasDropdown }) =>
                      hasDropdown ? (
                        <div key={etiqueta} className="flex flex-col">
                          <button
                            onClick={toggleResultadosDropdown}
                            className={`flex items-center gap-2 py-2 text-lg font-medium ${
                              isResultadosPage ? "text-blue-900" : "text-black"
                            } hover:text-[#2EB9A5] transition-colors`}
                          >
                            <Calendar className="h-5 w-5" />
                            {etiqueta}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${showResultadosDropdown ? "rotate-180" : ""}`}
                            />
                          </button>

                          {showResultadosDropdown && (
                            <div className="ml-7 mt-2 flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm mb-2">
                                Consulta el <span className="text-[#1e5fad] font-medium">estado</span> y detalle de tus{" "}
                                <span className="text-[#1e5fad] font-medium">análisis</span>.
                              </p>
                              <SheetClose asChild>
                                <Link
                                  href="/resultados?type=patient"
                                  className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                                >
                                  <div className="w-8 h-8 rounded-full bg-[#1e5fad] flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="font-medium">Pacientes</span>
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/resultados?type=doctor"
                                  className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                                >
                                  <div className="w-8 h-8 rounded-full bg-[#1e5fad] flex items-center justify-center">
                                    <Stethoscope className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="font-medium">Médicos</span>
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/resultados?type=company"
                                  className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                                >
                                  <div className="w-8 h-8 rounded-full bg-[#1e5fad] flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="font-medium">Empresas</span>
                                </Link>
                              </SheetClose>
                            </div>
                          )}
                        </div>
                      ) : (
                        <SheetClose asChild key={href}>
                          <Link
                            href={href}
                            className={`flex items-center gap-2 py-2 text-lg font-medium ${
                              isResultadosPage ? "text-blue-900" : "text-black"
                            } hover:text-[#2EB9A5] transition-colors`}
                          >
                            <Icon className="h-5 w-5" />
                            {etiqueta}
                          </Link>
                        </SheetClose>
                      ),
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/lopez.png" alt="ROE Logo" width={160} height={160} className="object-contain" priority />
              </Link>
            </div>

            {/* Navegación visible en escritorio */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map(({ href, etiqueta, hasDropdown }) => (
                <div key={etiqueta} className="relative">
                  <NavLink
                    href={href}
                    etiqueta={etiqueta}
                    hasDropdown={hasDropdown}
                    onClick={hasDropdown ? toggleResultadosDropdown : undefined}
                  />

                  {hasDropdown && showResultadosDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-[800px] bg-white rounded-xl shadow-xl p-6 z-50 animate-in fade-in-50 zoom-in-95 slide-in-from-top-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Texto descriptivo */}
                        <div className="md:col-span-4 mb-4 text-center">
                          <p className="text-lg text-gray-700">
                            Consulta el <span className="text-[#1e5fad] font-semibold">estado</span> y detalle de tus{" "}
                            <span className="text-[#1e5fad] font-semibold">análisis</span>.
                          </p>
                        </div>

                        {/* Botones (Pacientes, Médicos, Empresas) */}
                        <div className="md:col-span-4 flex justify-center gap-6">
                          {/* Pacientes */}
                          <Link
                            href="/resultados?type=patient"
                            className="flex items-center gap-3 px-6 py-4 bg-white hover:bg-blue-50 rounded-lg transition-all border border-gray-200 shadow-sm hover:shadow-md w-56"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#1e5fad] flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-medium">Pacientes</span>
                          </Link>

                          {/* Médicos */}
                          <Link
                            href="/resultados?type=doctor"
                            className="flex items-center gap-3 px-6 py-4 bg-white hover:bg-blue-50 rounded-lg transition-all border border-gray-200 shadow-sm hover:shadow-md w-56"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#1e5fad] flex items-center justify-center flex-shrink-0">
                              <Stethoscope className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-medium">Médicos</span>
                          </Link>

                          {/* Empresas */}
                          <Link
                            href="/resultados?type=company"
                            className="flex items-center gap-3 px-6 py-4 bg-white hover:bg-blue-50 rounded-lg transition-all border border-gray-200 shadow-sm hover:shadow-md w-56"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#1e5fad] flex items-center justify-center flex-shrink-0">
                              <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-medium">Empresas</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Derecha: Iconos de Login y Carrito */}
            <div className="hidden lg:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {user ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-12 w-12 rounded-full bg-[#050f59] hover:bg-[#2EB9A5] transition-colors"
                    >
                      <User className="h-6 w-6 text-white" />
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 rounded-full bg-[#050f59] hover:bg-[#2EB9A5] transition-colors"
                      >
                        <User className="h-6 w-6 text-white" />
                      </Button>
                    </Link>
                  )}
                </DropdownMenuTrigger>
                {user && (
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    {user.userType === "patient" && (
                      <DropdownMenuItem asChild>
                        <Link href="/resultados">
                          <span className="mr-2">🔍</span>
                          <span>Mis resultados</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
              <Link href="/carrito">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-12 w-12 rounded-full bg-[#2EB9A5] hover:bg-[#050f59] transition-colors"
                >
                  <ShoppingCart className="h-6 w-6 text-white" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

