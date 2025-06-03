"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthHeroSection } from "@/components/auth-hero-section"

export default function LoginPage() {
  const router = useRouter()
  const { login, user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("individual")

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false
  })

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    general: "",
  })

  // Cargar credenciales guardadas
  useEffect(() => {
    const savedIdentifier = localStorage.getItem("roe_saved_identifier")
    if (savedIdentifier) {
      setFormData(prev => ({ 
        ...prev, 
        identifier: savedIdentifier,
        remember: true 
      }))
    }
  }, [])

  // Manejar cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validaciones
  const validateForm = () => {
    let isValid = true
    const newErrors = { identifier: "", password: "", general: "" }

    if (!formData.identifier) {
      newErrors.identifier = "Por favor, ingresa tu usuario o correo electrónico"
      isValid = false
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Login de usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    // Limpiar errores previos
    setErrors(prev => ({ ...prev, general: "" }))
    
    try {
      // Guardar identificador si "recordar" está activo
      if (formData.remember) {
        localStorage.setItem("roe_saved_identifier", formData.identifier)
      } else {
        localStorage.removeItem("roe_saved_identifier")
      }

      // Login con identificador y contraseña
      const result = await login(formData.identifier, formData.password)
      if (result.success) {
        // Siempre redirigir a la página de inicio
        router.push("/")
      } else {
        // Mostrar error de autenticación
        setErrors(prev => ({ 
          ...prev, 
          general: result.error || "Usuario o contraseña incorrectos. Por favor, verifica tus credenciales." 
        }))
      }
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: "Error al conectar con el servidor. Inténtalo de nuevo." 
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar/ocultar la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Muestra spinner mientras se verifica la sesión
  if (authLoading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
          <p className="mt-4 text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>

      {/* Hero Section */}
      <AuthHeroSection
        title="Bienvenido de nuevo"
        subtitle="Inicia sesión para acceder a tu cuenta y gestionar tus análisis clínicos"
      />

      {/* Formulario de login */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h2>
            <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Mensaje de error general */}
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      {errors.general}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="identifier">Usuario o correo electrónico</Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={errors.identifier ? "border-red-500" : ""}
                  />
                  {errors.identifier && <p className="text-sm text-red-500">{errors.identifier}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={() => setFormData(prev => ({ ...prev, remember: !prev.remember }))}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Recordarme
                    </label>
                  </div>
                  <Link
                    href="/recuperar-password"
                    className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="text-blue-700 hover:text-blue-800 font-medium">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
