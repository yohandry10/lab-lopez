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

export default function LoginPage() {
  const router = useRouter()
  const { login, user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [activeTab, setActiveTab] = useState("individual")

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    companyRuc: "",
    companyEmail: "",
  })

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    companyRuc: "",
    companyEmail: "",
  })

  // Redirigir si ya hay sesión iniciada
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  // Agregar estado para recordar usuario
  const [rememberUser, setRememberUser] = useState(false)

  // Modificar el useEffect para cargar credenciales guardadas
  useEffect(() => {
    const savedIdentifier = localStorage.getItem("roe_saved_identifier")
    if (savedIdentifier) {
      setFormData((prev) => ({ ...prev, identifier: savedIdentifier }))
      setRememberMe(true)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateIndividualForm = () => {
    let isValid = true
    const newErrors = { identifier: "", password: "", companyRuc: "", companyEmail: "" }

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

  const validateCompanyForm = () => {
    let isValid = true
    const newErrors = { identifier: "", password: "", companyRuc: "", companyEmail: "" }

    if (!formData.companyRuc) {
      newErrors.companyRuc = "Por favor, ingresa el RUC de la empresa"
      isValid = false
    } else if (formData.companyRuc.length !== 11 || !/^\d+$/.test(formData.companyRuc)) {
      newErrors.companyRuc = "El RUC debe tener 11 dígitos numéricos"
      isValid = false
    }

    if (!formData.companyEmail) {
      newErrors.companyEmail = "Por favor, ingresa el correo electrónico"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
      newErrors.companyEmail = "Ingresa un correo electrónico válido"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Modificar el handleSubmit para guardar credenciales
  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateIndividualForm()) return

    setIsLoading(true)

    try {
      // Guardar identificador si "recordar sesión" está activado
      if (rememberMe) {
        localStorage.setItem("roe_saved_identifier", formData.identifier)
      } else {
        localStorage.removeItem("roe_saved_identifier")
      }

      const success = await login(formData.identifier, formData.password)

      if (success) {
        // Redirect to home page after successful login
        router.push("/")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCompanyForm()) return

    setIsLoading(true)

    try {
      // Iniciar sesión con RUC y correo de empresa
      const success = await login(formData.companyEmail, formData.password, formData.companyRuc)

      if (success) {
        // Redirect to home page after successful login
        router.push("/")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Si está cargando la autenticación, mostrar spinner
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
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Link
        href="/"
        className="absolute top-4 left-4 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/placeholder.svg?height=60&width=60"
              alt="ROE Logo"
              width={60}
              height={60}
              className="h-12 w-12"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <div className="grid gap-6">
              <form onSubmit={handleIndividualSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="identifier">Usuario o Email</Label>
                    <Input
                      id="identifier"
                      name="identifier"
                      placeholder="Ingresa tu usuario o email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={formData.identifier}
                      onChange={handleChange}
                      className={errors.identifier ? "border-red-500" : ""}
                    />
                    {errors.identifier && <p className="text-sm text-red-500">{errors.identifier}</p>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link href="/recuperar-contrasena" className="text-sm text-blue-700 hover:text-blue-800">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
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

                  {/* Agregar checkbox para recordar usuario (después del campo de contraseña) */}
                  <div className="flex items-center space-x-2 my-1">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Recordar mi usuario
                    </label>
                  </div>

                  <Button type="submit" className="bg-blue-700 hover:bg-blue-800 mt-2" disabled={isLoading}>
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
            </div>
          </TabsContent>

          <TabsContent value="company">
            <div className="grid gap-6">
              <form onSubmit={handleCompanySubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyRuc">RUC de la empresa</Label>
                    <Input
                      id="companyRuc"
                      name="companyRuc"
                      placeholder="Ingresa el RUC de la empresa"
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={formData.companyRuc}
                      onChange={handleChange}
                      className={errors.companyRuc ? "border-red-500" : ""}
                      maxLength={11}
                    />
                    {errors.companyRuc && <p className="text-sm text-red-500">{errors.companyRuc}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="companyEmail">Email corporativo</Label>
                    <Input
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      placeholder="Ingresa tu email corporativo"
                      autoCapitalize="none"
                      autoCorrect="off"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className={errors.companyEmail ? "border-red-500" : ""}
                    />
                    {errors.companyEmail && <p className="text-sm text-red-500">{errors.companyEmail}</p>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link href="/recuperar-contrasena" className="text-sm text-blue-700 hover:text-blue-800">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
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

                  <Button type="submit" className="bg-blue-700 hover:bg-blue-800 mt-2" disabled={isLoading}>
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
            </div>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline">Continuar con Google</Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="underline underline-offset-4 hover:text-primary">
            Regístrate
          </Link>
        </p>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800 font-medium">Credenciales de demostración:</p>
          <p className="text-xs text-blue-700 mt-1">Usuario: demo</p>
          <p className="text-xs text-blue-700">Email: demo@roe.com</p>
          <p className="text-xs text-blue-700">Contraseña: password123</p>
        </div>
      </div>
    </div>
  )
}

