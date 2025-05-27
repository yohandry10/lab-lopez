"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2, Check, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Checkbox } from "@/components/ui/checkbox"

// Importar el componente TermsModal
import { TermsModal } from "@/components/terms-modal"

// Importar el componente AuthHeroSection
import { AuthHeroSection } from "@/components/auth-hero-section"

type FormData = {
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  confirmPassword: string
  user_type: "patient" | "doctor" | "company"
  company_name?: string
  company_ruc?: string
  company_position?: string
  is_company_admin?: boolean
  accepted_terms: boolean
  accepted_marketing: boolean
}

type FormErrors = {
  [K in keyof FormData]?: string
} & { submit?: string }

export default function RegisterPage() {
  const router = useRouter()
  const { register, user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    user_type: "patient",
    company_name: "",
    company_ruc: "",
    company_position: "",
    is_company_admin: false,
    accepted_terms: false,
    accepted_marketing: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (user && !isSuccess) {
      router.push("/")
    }
  }, [user, router, isSuccess])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleUserTypeChange = (value: "patient" | "doctor" | "company") => {
    setFormData((prev) => ({ ...prev, user_type: value }))
    if (errors.user_type) {
      setErrors((prev) => ({ ...prev, user_type: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = "El nombre es requerido"
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "El apellido es requerido"
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    } else if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    // Validaciones específicas por tipo de usuario
    if (formData.user_type === "company") {
      if (!formData.company_name || formData.company_name.trim() === "") {
        newErrors.company_name = "El nombre de la empresa es requerido"
      }
      
      if (!formData.company_ruc || formData.company_ruc.trim() === "") {
        newErrors.company_ruc = "El RUC de la empresa es requerido"
      } else if (!/^\d{11}$/.test(formData.company_ruc.trim())) {
        newErrors.company_ruc = "El RUC debe tener 11 dígitos"
      }
    }

    if (!formData.accepted_terms) {
      newErrors.accepted_terms = "Debes aceptar los términos y condiciones para continuar"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckboxChange = (name: keyof Pick<FormData, "accepted_terms" | "accepted_marketing">) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const { confirmPassword, ...registerData } = formData

      console.log("Enviando datos de registro:", registerData)

      const result = await register(registerData)

      if (result.success) {
        setIsSuccess(true)
      } else if (result.error) {
        console.error("Error en el registro:", result.error)
        setErrors((prev) => ({ ...prev, submit: result.error }))
      }
    } catch (error: any) {
      console.error("Excepción al procesar el registro:", error)
      setErrors((prev) => ({ 
        ...prev, 
        submit: error?.message || "Error al procesar el registro" 
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    // Redirigir al usuario a la página principal
    router.push("/")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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

  // Si el registro fue exitoso, mostrar pantalla de confirmación
  if (isSuccess) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">¡Registro exitoso!</CardTitle>
          <CardDescription className="text-center">
            Tu cuenta ha sido creada correctamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={handleContinue}>Continuar</Button>
          </div>
        </CardContent>
      </Card>
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
        title="Únete a nuestra comunidad"
        subtitle="Regístrate para acceder a todos nuestros servicios y mantener un control de tus análisis clínicos"
      />

      {/* Formulario de registro */}
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="mx-auto max-w-md sm:max-w-lg">
          <div className="flex flex-col space-y-2 text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Crear una cuenta</h2>
            <p className="text-sm text-muted-foreground">Ingresa tus datos para registrarte</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={errors.first_name ? "border-red-500" : ""}
                  />
                  {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={errors.last_name ? "border-red-500" : ""}
                  />
                  {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
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

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div className="grid gap-2">
                  <Label>Tipo de usuario</Label>
                  <RadioGroup
                    value={formData.user_type}
                    onValueChange={handleUserTypeChange}
                    className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="patient" id="patient" />
                      <Label htmlFor="patient" className="text-sm font-normal">Paciente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="doctor" id="doctor" />
                      <Label htmlFor="doctor" className="text-sm font-normal">Médico</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="text-sm font-normal">Empresa</Label>
                    </div>
                  </RadioGroup>
                  {errors.user_type && <p className="text-sm text-red-500">{errors.user_type}</p>}
                </div>

                {/* Campos específicos para empresas */}
                {formData.user_type === "company" && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-900">Información de la empresa</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="company_name">Nombre de la empresa *</Label>
                        <Input
                          id="company_name"
                          name="company_name"
                          value={formData.company_name || ""}
                          onChange={handleChange}
                          className={errors.company_name ? "border-red-500" : ""}
                          placeholder="Ingresa el nombre de tu empresa"
                        />
                        {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="company_ruc">RUC *</Label>
                        <Input
                          id="company_ruc"
                          name="company_ruc"
                          value={formData.company_ruc || ""}
                          onChange={handleChange}
                          className={errors.company_ruc ? "border-red-500" : ""}
                          placeholder="12345678901"
                          maxLength={11}
                        />
                        {errors.company_ruc && <p className="text-sm text-red-500">{errors.company_ruc}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="company_position">Cargo (opcional)</Label>
                        <Input
                          id="company_position"
                          name="company_position"
                          value={formData.company_position || ""}
                          onChange={handleChange}
                          placeholder="Ej: Gerente de RRHH"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_company_admin"
                        checked={formData.is_company_admin || false}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, is_company_admin: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_company_admin" className="text-sm font-normal">
                        Administrador de la empresa
                      </Label>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.accepted_terms}
                      onCheckedChange={() => handleCheckboxChange("accepted_terms")}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto los{" "}
                      <Link href="/terminos" className="text-blue-700 hover:text-blue-800">
                        términos y condiciones
                      </Link>
                    </label>
                  </div>
                  {errors.accepted_terms && <p className="text-sm text-red-500">{errors.accepted_terms}</p>}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.accepted_marketing}
                      onCheckedChange={() => handleCheckboxChange("accepted_marketing")}
                    />
                    <label
                      htmlFor="marketing"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto recibir correos con novedades y promociones
                    </label>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                    {errors.submit}
                    {errors.submit.includes("ya está registrado") && (
                      <div className="mt-2">
                        <Button 
                          variant="outline"
                          type="button" 
                          onClick={() => router.push("/login")}
                          className="w-full"
                        >
                          Ir a Iniciar Sesión
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-blue-700 hover:text-blue-800 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

