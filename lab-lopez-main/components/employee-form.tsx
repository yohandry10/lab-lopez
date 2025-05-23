"use client"

import type React from "react"

import { useState } from "react"
import { createEmployee, updateEmployee } from "@/lib/database-service"
import type { Employee } from "@/lib/supabase-client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EmployeeFormProps {
  employee?: Employee
  onSuccess?: () => void
  onCancel?: () => void
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    position: employee?.position || "",
    department: employee?.department || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "Debe iniciar sesión para realizar esta acción",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (employee) {
        // Actualizar empleado existente
        const result = await updateEmployee(employee.id, {
          name: formData.name,
          position: formData.position,
          department: formData.department,
          email: formData.email,
          phone: formData.phone,
        })

        if (result) {
          toast({
            title: "Empleado actualizado",
            description: `${result.name} ha sido actualizado correctamente.`,
          })
          if (onSuccess) onSuccess()
        } else {
          throw new Error("No se pudo actualizar el empleado")
        }
      } else {
        // Crear nuevo empleado
        const result = await createEmployee({
          company_id: user.id,
          name: formData.name,
          position: formData.position,
          department: formData.department,
          email: formData.email,
          phone: formData.phone,
          status: "active",
          join_date: new Date().toISOString().split("T")[0],
        })

        if (result) {
          toast({
            title: "Empleado agregado",
            description: `${result.name} ha sido agregado correctamente.`,
          })
          if (onSuccess) onSuccess()
        } else {
          throw new Error("No se pudo crear el empleado")
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el empleado. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Cargo</Label>
        <Input
          id="position"
          name="position"
          placeholder="Cargo en la empresa"
          value={formData.position}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <Input
          id="department"
          name="department"
          placeholder="Departamento"
          value={formData.department}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" name="phone" placeholder="999-999-999" value={formData.phone} onChange={handleChange} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {employee ? "Actualizando..." : "Guardando..."}
            </>
          ) : employee ? (
            "Actualizar"
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  )
}

