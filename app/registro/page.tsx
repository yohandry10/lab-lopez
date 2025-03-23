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

export default function RegisterPage() {
  const router = useRouter()
  const { register, user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [patientCode, setPatientCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Agregar campos para términos y condiciones
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    userType: "patient", // Valores posibles: "patient", "doctor", "company"
    acceptedTerms: false,
    acceptedMarketing: false,
    // Campos adicionales para empresas
    companyName: "",
    companyRuc: "",
    companyPosition: "",
  })

  // Agregar campos para términos y condiciones
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    userType: "",
    acceptedTerms: "",
    // Campos adicionales para empresas
    companyName: "",
    companyRuc: "",
    companyPosition: "",
  })

  // Redirigir si ya hay sesión iniciada
  useEffect(() => {
    if (user && !isSuccess) {
      router.push("/")
    }
  }, [user, router, isSuccess])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleUserTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, userType: value }))
    if (errors.userType) {
      setErrors((prev) => ({ ...prev, userType: "" }))
    }
  }

  // Agregar validación para términos y condiciones
  const validateForm = () => {
    let isValid = true
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      userType: "",
      acceptedTerms: "",
      companyName: "",
      companyRuc: "",
      companyPosition: "",
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido"
      isValid = false
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
      isValid = false
    }

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
      isValid = false
    } else if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
      isValid = false
    }

    if (!formData.userType) {
      newErrors.userType = "Selecciona un tipo de usuario"
      isValid = false
    }

    // Validaciones específicas para empresas
    if (formData.userType === "company") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "El nombre de la empresa es requerido"
        isValid = false
      }

      if (!formData.companyRuc.trim()) {
        newErrors.companyRuc = "El RUC de la empresa es requerido"
        isValid = false
      } else if (formData.companyRuc.length !== 11 || !/^\d+$/.test(formData.companyRuc)) {
        newErrors.companyRuc = "El RUC debe tener 11 dígitos numéricos"
        isValid = false
      }

      if (!formData.companyPosition.trim()) {
        newErrors.companyPosition = "El cargo en la empresa es requerido"
        isValid = false
      }
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = "Debes aceptar los términos y condiciones para continuar"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Agregar manejador para checkboxes
  const handleCheckboxChange = (name: string) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
    if (name === "acceptedTerms" && errors.acceptedTerms) {
      setErrors((prev) => ({ ...prev, acceptedTerms: "" }))
    }
  }

  // Modificar el handleSubmit para incluir los nuevos campos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Registrar usuario con los nuevos campos
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        userType: formData.userType,
        acceptedTerms: formData.acceptedTerms,
        acceptedMarketing: formData.acceptedMarketing,
        // Campos adicionales para empresas
        ...(formData.userType === "company" && {
          companyName: formData.companyName,
          companyRuc: formData.companyRuc,
          companyPosition: formData.companyPosition,
        }),
      })

      if (result.success) {
        if (result.patientCode) {
          setPatientCode(result.patientCode)
        }
        setIsSuccess(true)
      }
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
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
            <CardDescription>Tu cuenta ha sido creada correctamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.userType === "patient" && patientCode && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Tu código de paciente</h3>
                <p className="text-lg font-bold text-blue-900 mb-2">{patientCode}</p>
                <p className="text-sm text-blue-700">
                  Guarda este código. Lo necesitarás para acceder a tus resultados y agendar análisis.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium">Información de la cuenta:</h3>
              <p>
                <span className="font-medium">Nombre:</span> {formData.firstName} {formData.lastName}
              </p>
              <p>
                <span className="font-medium">Usuario:</span> {formData.username}
              </p>
              <p>
                <span className="font-medium">Email:</span> {formData.email}
              </p>
              <p>
                <span className="font-medium">Tipo de usuario:</span>{" "}
                {formData.userType === "patient" ? "Paciente" : formData.userType === "doctor" ? "Médico" : "Empresa"}
              </p>
              {formData.userType === "company" && (
                <>
                  <p>
                    <span className="font-medium">Empresa:</span> {formData.companyName}
                  </p>
                  <p>
                    <span className="font-medium">RUC:</span> {formData.companyRuc}
                  </p>
                  <p>
                    <span className="font-medium">Cargo:</span> {formData.companyPosition}
                  </p>
                </>
              )}
            </div>

            <Button onClick={handleContinue} className="w-full bg-blue-700 hover:bg-blue-800 mt-4">
              Continuar a la página principal
            </Button>
          </CardContent>
        </Card>
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
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
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
          <h1 className="text-2xl font-semibold tracking-tight">Crear una cuenta</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus datos para registrarte en ROE</p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Tipo de usuario</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={handleUserTypeChange}
                  className={`mt-2 ${errors.userType ? "border border-red-500 p-3 rounded-md" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="cursor-pointer">
                      Paciente
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="cursor-pointer">
                      Médico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="cursor-pointer">
                      Empresa
                    </Label>
                  </div>
                </RadioGroup>
                {errors.userType && <p className="text-sm text-red-500">{errors.userType}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Ingresa tus nombres"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Ingresa tus apellidos"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              {/* Campos adicionales para empresas */}
              {formData.userType === "company" && (
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Nombre de la empresa</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Ingresa el nombre de la empresa"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={errors.companyName ? "border-red-500" : ""}
                    />
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="companyRuc">RUC de la empresa</Label>
                    <Input
                      id="companyRuc"
                      name="companyRuc"
                      placeholder="Ingresa el RUC de la empresa (11 dígitos)"
                      value={formData.companyRuc}
                      onChange={handleChange}
                      className={errors.companyRuc ? "border-red-500" : ""}
                      maxLength={11}
                    />
                    {errors.companyRuc && <p className="text-sm text-red-500">{errors.companyRuc}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="companyPosition">Cargo en la empresa</Label>
                    <Input
                      id="companyPosition"
                      name="companyPosition"
                      placeholder="Ingresa tu cargo en la empresa"
                      value={formData.companyPosition}
                      onChange={handleChange}
                      className={errors.companyPosition ? "border-red-500" : ""}
                    />
                    {errors.companyPosition && <p className="text-sm text-red-500">{errors.companyPosition}</p>}
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Elige un nombre de usuario"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="nombre@ejemplo.com"
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

              {/* Agregar los checkboxes al formulario (después de los campos de tipo de usuario) */}
              <div className="space-y-4 mt-4">
                {/* Modificar el texto de los términos y condiciones para incluir un enlace al modal */}
                <div className="space-y-2">
                  <div className="rounded-lg border p-4 bg-gray-50">
                    <div className="font-medium mb-2">Términos y condiciones</div>
                    <div className="text-sm text-gray-600 mb-4 max-h-32 overflow-y-auto">
                      <p className="mb-2">
                        Cláusula informativa de protección de datos personales: Al registrarte, aceptas que tus datos
                        personales sean tratados por ROE Laboratorio Clínico con la finalidad de gestionar tu cuenta y
                        brindarte los servicios solicitados.
                      </p>
                      <p>
                        <TermsModal
                          trigger={
                            <span className="text-blue-600 hover:underline cursor-pointer">
                              Leer términos y condiciones completos
                            </span>
                          }
                        />
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptedTerms}
                        onCheckedChange={() => handleCheckboxChange("acceptedTerms")}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        He leído y acepto los términos y condiciones
                      </label>
                    </div>
                    {errors.acceptedTerms && <p className="text-sm text-red-500 mt-1">{errors.acceptedTerms}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={formData.acceptedMarketing}
                    onCheckedChange={() => handleCheckboxChange("acceptedMarketing")}
                  />
                  <label
                    htmlFor="marketing"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto recibir información sobre promociones y servicios de ROE
                  </label>
                </div>
              </div>

              <Button type="submit" className="bg-blue-700 hover:bg-blue-800 mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </div>
          </form>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

