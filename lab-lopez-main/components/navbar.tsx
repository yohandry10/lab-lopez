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
  X,
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
  { href: "/domicilio", etiqueta: "Servicio a domicilio", icono: Home },
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
        className={`text-sm md:text-base lg:text-lg font-medium transition-all duration-200 ease-in-out rounded-lg px-2 md:px-3 lg:px-4 py-2 relative ${
          isAuthPage
            ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
            : isScrolled
              ? "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
              : isHomePage
                ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
                : "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
        }`}
      >
        <span className="block sm:inline">{etiqueta}</span>
        <ChevronDown className={`h-3 w-3 md:h-4 md:w-4 inline-block ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
    )
  }

  return (
    <Link
      href={href}
      prefetch={true}
      className={`text-sm md:text-base lg:text-lg font-medium transition-all duration-200 ease-in-out rounded-lg px-2 md:px-3 lg:px-4 py-2 relative ${
        isAuthPage
          ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
          : isScrolled
            ? "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
            : isHomePage
              ? "text-white hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
              : "text-[#356fb8] hover:text-white hover:bg-[#3da64a] hover:shadow-lg"
      }`}
    >
      <span className="block sm:inline">{etiqueta}</span>
    </Link>
  )
})

NavLink.displayName = 'NavLink'

// Memoizar el logo para evitar re-renders innecesarios
const Logo = memo(() => (
  <Link href="/" prefetch={true} className="flex items-center gap-2">
    <Image 
      src="/lopez.png" 
      alt="Lopez Lab Logo" 
      width={120} 
      height={45} 
      className="object-contain w-auto h-8 sm:h-10 md:h-12 lg:h-14" 
      priority 
      sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
    />
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : ""}`}>
        <nav>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 sm:h-20 md:h-24 items-center justify-between">
              <Logo />
              
              {/* Desktop Navigation - solo visible en lg+ */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
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
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-[90vw] max-w-[800px] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 lg:p-6 z-50 animate-in fade-in-50 zoom-in-95 slide-in-from-top-5"
                      >
                        <div className="grid grid-cols-1 gap-4">
                          {/* Texto descriptivo */}
                          <div className="text-center mb-2">
                            <p className="text-base lg:text-lg text-gray-700">
                              Consulta el <span className="text-[#1e5fad] font-semibold">estado</span> y detalle de tus{" "}
                              <span className="text-[#1e5fad] font-semibold">análisis</span>.
                            </p>
                          </div>

                          {/* Botones (Pacientes, Médicos, Empresas) */}
                          <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-6">
                            {/* Pacientes */}
                            <Link
                              href="/resultados?type=patient"
                              className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-white hover:bg-blue-50 rounded-lg transition-all border border-gray-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                            >
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#1e5fad] flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                              </div>
                              <span className="text-sm lg:text-lg font-medium">Pacientes</span>
                            </Link>

                            {/* Médicos */}
                            <Link
                              href="/resultados?type=doctor"
                              className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-white hover:bg-blue-50 rounded-lg transition-all border border-gray-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                            >
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#1e5fad] flex items-center justify-center flex-shrink-0">
                                <Stethoscope className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                              </div>
                              <span className="text-sm lg:text-lg font-medium">Médicos</span>
                            </Link>

                            {/* Empresas */}
                            <Link
                              href="/resultados?type=company"
                              className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-white hover:bg-blue-50 rounded-lg transition-all border border-gray-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                            >
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#1e5fad] flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                              </div>
                              <span className="text-sm lg:text-lg font-medium">Empresas</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Derecha: Iconos de Login y Carrito */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                {/* Desktop Icons - solo visible en lg+ */}
                <div className="hidden lg:flex items-center gap-3 xl:gap-4">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative h-10 w-10 xl:h-12 xl:w-12 rounded-full bg-[#1e5fad] hover:bg-[#2EB9A5] transition-colors"
                        >
                          <User className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
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
                        {user.user_type === "admin" ? (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href="/admin/registrar-usuario">
                                <User className="mr-2 h-4 w-4" />
                                <span>Registrar Usuario</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/perfil">
                                <User className="mr-2 h-4 w-4" />
                                <span>Mi Perfil</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem asChild>
                            <Link href="/perfil">
                              <User className="mr-2 h-4 w-4" />
                              <span>Mi Perfil</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
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
                        className="relative h-10 w-10 xl:h-12 xl:w-12 rounded-full bg-[#1e5fad] hover:bg-[#2EB9A5] transition-colors"
                      >
                        <User className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
                      </Button>
                    </Link>
                  )}
                  <Link href="/carrito">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 xl:h-12 xl:w-12 rounded-full bg-[#3da64a] hover:bg-[#050f59] transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 xl:h-5 xl:w-5 rounded-full bg-red-500 text-[9px] xl:text-[10px] font-medium text-white flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>

                {/* Mobile Icons - visible en pantallas menores a lg */}
                <div className="flex lg:hidden items-center gap-2">
                  {/* Carrito móvil */}
                  <Link href="/carrito">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#3da64a] hover:bg-[#050f59] transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-500 text-[8px] sm:text-[9px] font-medium text-white flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {/* Login móvil */}
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#1e5fad] hover:bg-[#2EB9A5] transition-colors"
                        >
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
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
                        {user.user_type === "admin" ? (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href="/admin/registrar-usuario">
                                <User className="mr-2 h-4 w-4" />
                                <span>Registrar Usuario</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/perfil">
                                <User className="mr-2 h-4 w-4" />
                                <span>Mi Perfil</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem asChild>
                            <Link href="/perfil">
                              <User className="mr-2 h-4 w-4" />
                              <span>Mi Perfil</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
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
                        className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#1e5fad] hover:bg-[#2EB9A5] transition-colors"
                      >
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </Button>
                    </Link>
                  )}
                </div>
                
                {/* Menú hamburguesa - mejorado */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Alternar Menú" 
                      className="bg-transparent h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 transition-colors"
                    >
                      {isOpen ? (
                        <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                      ) : (
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="left" 
                    className="w-[280px] sm:w-[320px] md:w-[380px] p-0 bg-white"
                  >
                    <div className="flex flex-col h-full">
                      {/* Header del menú móvil */}
                      <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <Image 
                            src="/lopez.png" 
                            alt="Lopez Lab Logo" 
                            width={120} 
                            height={45} 
                            className="object-contain h-8 w-auto" 
                            priority 
                          />
                          <SheetClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <X className="h-4 w-4" />
                            </Button>
                          </SheetClose>
                        </div>
                      </div>

                      {/* Navegación móvil */}
                      <nav className="flex-1 p-4 sm:p-6">
                        <div className="space-y-3">
                          {mobileNavItems.map(({ href, etiqueta, icono: Icon, hasDropdown }) => (
                            <div key={etiqueta}>
                              {hasDropdown ? (
                                <div className="space-y-2">
                                  <button 
                                    className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowResultadosDropdown(!showResultadosDropdown)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Icon className="h-5 w-5 text-gray-600" />
                                      <span className="text-base font-medium text-gray-900">{etiqueta}</span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showResultadosDropdown ? "rotate-180" : ""}`} />
                                  </button>
                                  
                                  {/* Dropdown content para móvil */}
                                  {showResultadosDropdown && (
                                    <div className="ml-8 space-y-2">
                                      <SheetClose asChild>
                                        <Link
                                          href="/resultados?type=patient"
                                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                          <div className="w-6 h-6 rounded-full bg-[#1e5fad] flex items-center justify-center">
                                            <User className="h-3 w-3 text-white" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-700">Pacientes</span>
                                        </Link>
                                      </SheetClose>
                                      <SheetClose asChild>
                                        <Link
                                          href="/resultados?type=doctor"
                                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                          <div className="w-6 h-6 rounded-full bg-[#1e5fad] flex items-center justify-center">
                                            <Stethoscope className="h-3 w-3 text-white" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-700">Médicos</span>
                                        </Link>
                                      </SheetClose>
                                      <SheetClose asChild>
                                        <Link
                                          href="/resultados?type=company"
                                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                          <div className="w-6 h-6 rounded-full bg-[#1e5fad] flex items-center justify-center">
                                            <Building2 className="h-3 w-3 text-white" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-700">Empresas</span>
                                        </Link>
                                      </SheetClose>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <SheetClose asChild>
                                  <Link
                                    href={href}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <Icon className="h-5 w-5 text-gray-600" />
                                    <span className="text-base font-medium text-gray-900">{etiqueta}</span>
                                  </Link>
                                </SheetClose>
                              )}
                            </div>
                          ))}
                        </div>
                      </nav>

                      {/* Footer del menú móvil */}
                      <div className="p-4 sm:p-6 border-t border-gray-200 space-y-3">
                        {user ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 rounded-full bg-[#1e5fad] flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                            <SheetClose asChild>
                              <Link href="/perfil" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <User className="h-5 w-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">Mi Perfil</span>
                              </Link>
                            </SheetClose>
                            <button
                              onClick={async () => {
                                await logout();
                                router.push("/");
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                            >
                              <LogOut className="h-5 w-5 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Cerrar Sesión</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <SheetClose asChild>
                              <Link href="/login">
                                <Button className="w-full bg-[#1e5fad] hover:bg-[#1e5fad]/90 text-white">
                                  Iniciar Sesión
                                </Button>
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link href="/registro">
                                <Button variant="outline" className="w-full border-[#1e5fad] text-[#1e5fad] hover:bg-[#1e5fad]/5">
                                  Registrarse
                                </Button>
                              </Link>
                            </SheetClose>
                          </div>
                        )}
                      </div>
                    </div>
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