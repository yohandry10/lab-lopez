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
import { useState, useCallback, useRef, useEffect, memo } from "react"
import { SheetClose } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { createContext, useContext } from 'react'

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

interface NavbarContextType {
  isScrolled: boolean
}

const NavbarContext = createContext<NavbarContextType>({ isScrolled: false })

export const useNavbarContext = () => useContext(NavbarContext)

const NavLink = memo(({
  href,
  etiqueta,
  hasDropdown,
  onClick,
  buttonRef,
  isOpen,
}: {
  href: string
  etiqueta: string
  hasDropdown?: boolean
  onClick?: () => void
  buttonRef?: React.RefObject<HTMLButtonElement>
  isOpen?: boolean
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isScrolled } = useNavbarContext()
  const isHomePage = pathname === "/"
  const isAuthPage = pathname === "/login" || pathname === "/registro"
  const isActive = pathname === href

  useEffect(() => {
    // Prefetch las rutas más comunes
    if (href !== '#') {
      router.prefetch(href)
    }
  }, [href, router])

  if (hasDropdown) {
    return (
      <button
        ref={buttonRef}
        onClick={onClick}
        className={`text-lg font-medium transition-all duration-200 ease-in-out rounded-lg px-4 py-2 relative ${
          isAuthPage
            ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
            : isScrolled
              ? "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
              : isHomePage
                ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
                : "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
        }`}
      >
        {etiqueta}
        <ChevronDown className={`h-4 w-4 inline-block ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
    )
  }

  return (
    <Link
      href={href}
      prefetch={true}
      className={`text-lg font-medium transition-all duration-200 ease-in-out rounded-lg px-4 py-2 relative ${
        isAuthPage
          ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
          : isScrolled
            ? "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
            : isHomePage
              ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
              : "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
      }`}
    >
      {etiqueta}
    </Link>
  )
})

NavLink.displayName = 'NavLink'

// Memoizar el logo para evitar re-renders innecesarios
const Logo = memo(() => (
  <Link href="/" prefetch={true} className="flex items-center gap-2">
    <Image src="/lopez.png" alt="Lopez Lab Logo" width={160} height={60} className="object-contain" priority />
  </Link>
))

Logo.displayName = 'Logo'

export function Navbar() {
  const { itemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [showResultadosDropdown, setShowResultadosDropdown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isResultadosPage = pathname.startsWith("/resultados")
  const isHomePage = pathname === "/"
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>
  const { user, logout } = useAuth()
  const router = useRouter()

  // Optimizar el manejo del scroll con throttling
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = useCallback(() => {
    // Implementar logout aquí si es necesario
    setIsOpen(false)
  }, [])

  const toggleResultadosDropdown = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setShowResultadosDropdown(prev => !prev)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setShowResultadosDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setShowResultadosDropdown(false)
    setIsOpen(false)
  }, [pathname])

  return (
    <NavbarContext.Provider value={{ isScrolled }}>
      <header className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : ""}`}>
        <nav>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-24 items-center justify-between">
              <Logo />
              <nav className="hidden lg:flex items-center gap-8">
                {navItems.map(({ href, etiqueta, hasDropdown }) => (
                  <div key={etiqueta} className="relative">
                    <NavLink
                      href={href}
                      etiqueta={etiqueta}
                      hasDropdown={hasDropdown}
                      onClick={hasDropdown ? toggleResultadosDropdown : undefined}
                      buttonRef={hasDropdown ? buttonRef : undefined}
                      isOpen={showResultadosDropdown}
                    />
                    {hasDropdown && showResultadosDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-[800px] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 z-50 animate-in fade-in-50 zoom-in-95 slide-in-from-top-5"
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
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-4">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative h-12 w-12 rounded-full bg-[#1e5fad] hover:bg-[#2EB9A5] transition-colors"
                        >
                          <User className="h-6 w-6 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/perfil">
                            <User className="mr-2 h-4 w-4" />
                            <span>Mi Perfil</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={async () => {
                            await logout();
                            router.push("/");
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 rounded-full bg-[#1e5fad] hover:bg-[#2EB9A5] transition-colors"
                      >
                        <User className="h-6 w-6 text-white" />
                      </Button>
                    </Link>
                  )}
                  <Link href="/carrito">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-12 w-12 rounded-full bg-[#3da64a] hover:bg-[#050f59] transition-colors"
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
                
                {/* Menú hamburguesa */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" aria-label="Alternar Menú" className="bg-transparent">
                      <Menu className="h-6 w-6 text-gray-700" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col gap-4">
                      {mobileNavItems.map(({ href, etiqueta, icono: Icon, hasDropdown }) => (
                        <div key={etiqueta}>
                          {hasDropdown ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 text-lg font-medium text-gray-600 hover:text-gray-900">
                                  <Icon className="h-5 w-5" />
                                  {etiqueta}
                                  <ChevronDown className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-[300px]">
                                {/* Contenido del dropdown */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Link
                              href={href}
                              className="flex items-center gap-2 text-lg font-medium text-gray-600 hover:text-gray-900"
                            >
                              <Icon className="h-5 w-5" />
                              {etiqueta}
                            </Link>
                          )}
                        </div>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </NavbarContext.Provider>
  )
}