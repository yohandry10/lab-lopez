"use client"

import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Preloader } from "@/components/preloader"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const authRoutes = [
  "/resultados",
  "/pacientes",
  "/medicos",
  "/empresas",
  "/carrito",
  "/domicilio",
]

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const needsAuth = authRoutes.some(route => pathname.startsWith(route))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <CartProvider>
          {isLoading ? (
            <Preloader />
          ) : (
            <div className="flex min-h-screen flex-col relative bg-transparent">
              <Navbar />
              <main className="flex-1">
                {needsAuth ? (
                  children
                ) : (
                  children
                )}
              </main>
              <Footer />
            </div>
          )}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 