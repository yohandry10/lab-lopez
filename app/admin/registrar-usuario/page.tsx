"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Check, Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"

type FormData = {
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  confirmPassword: string
  user_type: "doctor" | "company"
  company_name?: string
  company_ruc?: string
  company_position?: string
  is_company_admin?: boolean
  accepted_terms: boolean
  accepted_marketing: boolean
}

type FormErrors = {
  [key in keyof FormData]?: string
} & { submit?: string }

export default function AdminRegisterPage() {
  const router = useRouter()
  const { register, adminRegister, user, isLoading: authLoading } = useAuth()
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
    user_type: "doctor",
    company_name: "",
    company_ruc: "",
    company_position: "",
    is_company_admin: false,
    accepted_terms: true,
    accepted_marketing: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    // Verificar si el usuario es admin
    if (user && user.user_type !== "admin") {
      router.push("/")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleUserTypeChange = (value: "doctor" | "company") => {
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckboxChange = (name: keyof Pick<FormData, "accepted_terms" | "accepted_marketing" | "is_company_admin">) => {
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
      console.log("🔍 USER_TYPE QUE SE ESTÁ ENVIANDO:", registerData.user_type)

      const result = await adminRegister(registerData)

      if (result.success) {
        setIsSuccess(true)
      } else if (result.error) {
        console.error("Error en el registro:", result.error)
        
        // Manejo específico de errores comunes
        let errorMessage = result.error
        
        if (result.error.includes("users_username_key")) {
          errorMessage = "El nombre de usuario ya está en uso. Por favor elige otro."
        } else if (result.error.includes("users_email_key")) {
          errorMessage = "El correo electrónico ya está registrado. Por favor usa otro."
        } else if (result.error.includes("duplicate key")) {
          errorMessage = "Ya existe un usuario con esos datos. Verifica los campos e intenta nuevamente."
        }
        
        setErrors((prev) => ({ ...prev, submit: errorMessage }))
      }
    } catch (error: any) {
      console.error("Excepción al procesar el registro:", error)
      
      let errorMessage = "Error al procesar el registro"
      
      if (error?.message?.includes("users_username_key")) {
        errorMessage = "El nombre de usuario ya está en uso. Por favor elige otro."
      } else if (error?.message?.includes("users_email_key")) {
        errorMessage = "El correo electrónico ya está registrado. Por favor usa otro."
      } else if (error?.message?.includes("duplicate key")) {
        errorMessage = "Ya existe un usuario con esos datos. Verifica los campos e intenta nuevamente."
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setErrors((prev) => ({ 
        ...prev, 
        submit: errorMessage
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    // Reiniciar el formulario para registrar otro usuario
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      user_type: "doctor",
      company_name: "",
      company_ruc: "",
      company_position: "",
      is_company_admin: false,
      accepted_terms: true,
      accepted_marketing: false,
    })
    setIsSuccess(false)
  }

  const handleViewUsers = () => {
    router.push("/perfil?tab=usuarios")
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

  // Si el usuario ya se registró exitosamente
  if (isSuccess) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Usuario registrado con éxito!</h2>
            <p className="text-gray-600 text-center mb-6">
              Has registrado correctamente un nuevo usuario de tipo {formData.user_type === "doctor" ? "médico" : "empresa"}.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={handleContinue}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Registrar otro usuario
              </Button>
              <Button 
                variant="outline"
                onClick={handleViewUsers}
              >
                Ver usuarios
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administrador</h1>
            <h2 className="text-2xl font-semibold tracking-tight">Registrar Nuevo Usuario</h2>
            <p className="text-sm text-muted-foreground">Completa el formulario para registrar un médico o empresa</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      autoCapitalize="none"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
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
                      autoCapitalize="none"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div className="mt-4">
                  <Label>Tipo de usuario</Label>
                  <RadioGroup
                    value={formData.user_type}
                    onValueChange={handleUserTypeChange as (value: string) => void}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="doctor" id="doctor" />
                      <Label htmlFor="doctor">Médico</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company">Empresa</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Campos específicos para médicos */}
                {formData.user_type === "doctor" && (
                  <div className="mt-4">
                    {/* No necesitamos campos específicos para médicos por ahora */}
                  </div>
                )}

                {/* Campos específicos para empresas */}
                {formData.user_type === "company" && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="company_name">Nombre de la empresa *</Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                      />
                      {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="company_ruc">RUC *</Label>
                      <Input
                        id="company_ruc"
                        name="company_ruc"
                        value={formData.company_ruc}
                        onChange={handleChange}
                        required
                      />
                      {errors.company_ruc && <p className="text-red-500 text-sm mt-1">{errors.company_ruc}</p>}
                    </div>
                    <div>
                      <Label htmlFor="company_position">Cargo <span className="text-gray-400">(opcional)</span></Label>
                      <Input
                        id="company_position"
                        name="company_position"
                        value={formData.company_position}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="is_company_admin" 
                        checked={formData.is_company_admin}
                        onCheckedChange={() => handleCheckboxChange("is_company_admin")}
                      />
                      <Label htmlFor="is_company_admin">Administrador de la empresa</Label>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="accepted_marketing" 
                    checked={formData.accepted_marketing}
                    onCheckedChange={() => handleCheckboxChange("accepted_marketing")}
                  />
                  <Label htmlFor="accepted_marketing">Enviar novedades y promociones por correo</Label>
                </div>

                {errors.submit && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                    {errors.submit}
                  </div>
                )}

                <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando usuario...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Registrar usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 