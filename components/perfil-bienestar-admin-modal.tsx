"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface PerfilBienestar {
  id?: number
  slug: string
  title: string
  description: string
  content: string
  price: number
  image: string
  locations: string[]
  sample_type: string
  age_requirement: string
  tests: string[]
  conditions: string[]
  is_active?: boolean
}

interface PerfilBienestarAdminModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (perfil: PerfilBienestar) => void
  perfil?: PerfilBienestar | null
  mode: "add" | "edit"
}

export default function PerfilBienestarAdminModal({
  isOpen,
  onClose,
  onSave,
  perfil,
  mode
}: PerfilBienestarAdminModalProps) {
  const [formData, setFormData] = useState<PerfilBienestar>({
    slug: "",
    title: "",
    description: "",
    content: "",
    price: 0,
    image: "",
    locations: ["Sede"],
    sample_type: "General",
    age_requirement: "Cualquier edad",
    tests: [],
    conditions: [],
    is_active: true
  })

  const [newTest, setNewTest] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [newLocation, setNewLocation] = useState("")

  useEffect(() => {
    if (mode === "edit" && perfil) {
      setFormData({
        ...perfil,
        locations: perfil.locations || ["Sede"],
        tests: perfil.tests || [],
        conditions: perfil.conditions || []
      })
    } else {
      setFormData({
        slug: "",
        title: "",
        description: "",
        content: "",
        price: 0,
        image: "",
        locations: ["Sede"],
        sample_type: "General",
        age_requirement: "Cualquier edad",
        tests: [],
        conditions: [],
        is_active: true
      })
    }
  }, [mode, perfil, isOpen])

  const handleInputChange = (field: keyof PerfilBienestar, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    handleInputChange("title", title)
    if (mode === "add") {
      handleInputChange("slug", generateSlug(title))
    }
  }

  const addTest = () => {
    if (newTest.trim()) {
      setFormData(prev => ({
        ...prev,
        tests: [...prev.tests, newTest.trim()]
      }))
      setNewTest("")
    }
  }

  const removeTest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  const addLocation = () => {
    if (newLocation.trim() && !formData.locations.includes(newLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation.trim()]
      }))
      setNewLocation("")
    }
  }

  const removeLocation = (index: number) => {
    if (formData.locations.length > 1) {
      setFormData(prev => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Por favor completa los campos obligatorios")
      return
    }

    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Agregar Perfil de Bienestar" : "Editar Perfil de Bienestar"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ej: Perfil Prevención Total"
                required
              />
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="ej: prevencion-total"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <Label htmlFor="price">Precio (S/.)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ""}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || value === "0" || !isNaN(parseFloat(value))) {
                    handleInputChange("price", value === "" ? 0 : parseFloat(value))
                  }
                }}
                placeholder="0.00"
              />
            </div>

            {/* Tipo de muestra */}
            <div>
              <Label htmlFor="sample_type">Tipo de muestra</Label>
              <Input
                id="sample_type"
                value={formData.sample_type}
                onChange={(e) => handleInputChange("sample_type", e.target.value)}
                placeholder="Ej: General, Sangre, Orina"
              />
            </div>

            {/* Requisito de edad */}
            <div className="md:col-span-2">
              <Label htmlFor="age_requirement">Requisito de edad</Label>
              <Input
                id="age_requirement"
                value={formData.age_requirement}
                onChange={(e) => handleInputChange("age_requirement", e.target.value)}
                placeholder="Ej: 18-45 años, Cualquier edad"
              />
            </div>

            {/* URL de imagen */}
            <div className="md:col-span-2">
              <Label htmlFor="image">URL de imagen</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción breve del perfil"
              rows={3}
              required
            />
          </div>

          {/* Contenido */}
          <div>
            <Label htmlFor="content">Contenido detallado</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Descripción detallada del perfil"
              rows={4}
            />
          </div>

          {/* Ubicaciones */}
          <div>
            <Label>Ubicaciones disponibles</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Ej: Sede, Domicilio"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
              />
              <Button type="button" onClick={addLocation} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.locations.map((location, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {location}
                  {formData.locations.length > 1 && (
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeLocation(index)}
                    />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Exámenes incluidos */}
          <div>
            <Label>Exámenes incluidos</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTest}
                onChange={(e) => setNewTest(e.target.value)}
                placeholder="Nombre del examen"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTest())}
              />
              <Button type="button" onClick={addTest} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tests.map((test, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {test}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTest(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Condiciones */}
          <div>
            <Label>Condiciones y preparación</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Condición o preparación necesaria"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
              />
              <Button type="button" onClick={addCondition} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.conditions.map((condition, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {condition}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeCondition(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#3DA64A] hover:bg-[#3DA64A]/90">
              {mode === "add" ? "Crear Perfil" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 