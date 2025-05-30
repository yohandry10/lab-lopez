"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

interface Categoria {
  id: number
  nombre: string
  descripcion: string
  color: string
  icono: string
  orden: number
  activo: boolean
}

interface CategoriasAdminModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoriasAdminModal({ isOpen, onClose }: CategoriasAdminModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    color: "#1E5FAD",
    icono: "beaker",
    orden: 0
  })

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarCategorias()
    }
  }, [isOpen])

  const cargarCategorias = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('categorias_analisis')
        .select('*')
        .order('orden', { ascending: true })

      if (error) throw error
      setCategorias(data || [])
    } catch (error) {
      console.error('Error cargando categorías:', error)
      alert('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const startEdit = (categoria: Categoria) => {
    setEditingId(categoria.id)
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      color: categoria.color,
      icono: categoria.icono,
      orden: categoria.orden
    })
    setIsAdding(false)
  }

  const startAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      nombre: "",
      descripcion: "",
      color: "#1E5FAD",
      icono: "beaker",
      orden: categorias.length + 1
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({ nombre: "", descripcion: "", color: "#1E5FAD", icono: "beaker", orden: 0 })
  }

  const saveCategoria = async () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido')
      return
    }

    try {
      const supabase = getSupabaseClient()

      if (isAdding) {
        // Crear nueva categoría
        const { error } = await supabase
          .from('categorias_analisis')
          .insert([{
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            color: formData.color,
            icono: formData.icono,
            orden: formData.orden
          }])

        if (error) throw error
      } else if (editingId) {
        // Actualizar categoría existente
        const { error } = await supabase
          .from('categorias_analisis')
          .update({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            color: formData.color,
            icono: formData.icono,
            orden: formData.orden
          })
          .eq('id', editingId)

        if (error) throw error
      }

      await cargarCategorias()
      cancelEdit()
    } catch (error) {
      console.error('Error guardando categoría:', error)
      alert('Error al guardar categoría')
    }
  }

  const toggleActivo = async (id: number, activo: boolean) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('categorias_analisis')
        .update({ activo: !activo })
        .eq('id', id)

      if (error) throw error
      await cargarCategorias()
    } catch (error) {
      console.error('Error cambiando estado:', error)
      alert('Error al cambiar estado')
    }
  }

  const eliminarCategoria = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('categorias_analisis')
        .delete()
        .eq('id', id)

      if (error) throw error
      await cargarCategorias()
    } catch (error) {
      console.error('Error eliminando categoría:', error)
      alert('Error al eliminar categoría')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Categorías</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Botón agregar */}
          <div className="flex justify-end">
            <Button onClick={startAdd} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Categoría
            </Button>
          </div>

          {/* Formulario de edición/creación */}
          {(editingId || isAdding) && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">
                {isAdding ? 'Nueva Categoría' : 'Editar Categoría'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Nombre de la categoría"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="#1E5FAD"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="icono">Icono</Label>
                  <Input
                    id="icono"
                    value={formData.icono}
                    onChange={(e) => handleInputChange('icono', e.target.value)}
                    placeholder="beaker"
                  />
                </div>
                <div>
                  <Label htmlFor="orden">Orden</Label>
                  <Input
                    id="orden"
                    type="number"
                    value={formData.orden}
                    onChange={(e) => handleInputChange('orden', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Descripción de la categoría"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={saveCategoria} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de categorías */}
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <div className="space-y-2">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{ backgroundColor: categoria.color }}
                      className="text-white"
                    >
                      {categoria.orden}
                    </Badge>
                    <div>
                      <div className="font-medium">{categoria.nombre}</div>
                      <div className="text-sm text-gray-500">{categoria.descripcion}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={categoria.activo ? "default" : "secondary"}>
                      {categoria.activo ? "Activo" : "Inactivo"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(categoria)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActivo(categoria.id, categoria.activo)}
                    >
                      {categoria.activo ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => eliminarCategoria(categoria.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 