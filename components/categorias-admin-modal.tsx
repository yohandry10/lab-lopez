"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Save, X, Download } from "lucide-react"
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
  const [categoriasExistentes, setCategoriasExistentes] = useState<string[]>([])
  const [loadingExistentes, setLoadingExistentes] = useState(false)
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
      cargarCategoriasExistentes()
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

  // Nueva función para cargar categorías existentes desde la tabla analyses
  const cargarCategoriasExistentes = async () => {
    setLoadingExistentes(true)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('analyses')
        .select('category')

      if (error) throw error
      
      // Extraer categorías únicas
      const categoriasUnicas = Array.from(new Set(
        data?.map(item => item.category).filter(cat => cat && cat.trim() !== '') || []
      )).sort()
      
      // Filtrar las que ya existen en categorias_analisis
      const categoriasYaExistentes = categorias.map(cat => cat.nombre.toLowerCase())
      const categoriasSinAgregar = categoriasUnicas.filter(cat => 
        !categoriasYaExistentes.includes(cat.toLowerCase())
      )
      
      setCategoriasExistentes(categoriasSinAgregar)
    } catch (error) {
      console.error('Error cargando categorías existentes:', error)
    } finally {
      setLoadingExistentes(false)
    }
  }

  // Nueva función para agregar categoría existente
  const agregarCategoriaExistente = async (nombreCategoria: string) => {
    try {
      const supabase = getSupabaseClient()
      
      // Definir colores automáticos por tipo de categoría
      const coloresPorCategoria: { [key: string]: string } = {
        'inmunología': '#8B5CF6',
        'bioquímica': '#10B981',
        'hematología': '#EF4444',
        'microbiología': '#F59E0B',
        'hormonas': '#EC4899',
        'coagulación': '#6366F1',
        'análisis clínicos': '#3B82F6',
        'perfil lipídico': '#84CC16',
        'marcadores tumorales': '#F97316',
        'orina': '#06B6D4',
        'genética': '#8B5CF6',
        'endocrinología': '#EC4899',
        'cardiología': '#DC2626'
      }
      
      const colorCategoria = coloresPorCategoria[nombreCategoria.toLowerCase()] || '#1E5FAD'
      
      const { error } = await supabase
        .from('categorias_analisis')
        .insert([{
          nombre: nombreCategoria,
          descripcion: `Categoría para análisis de ${nombreCategoria.toLowerCase()}`,
          color: colorCategoria,
          icono: 'beaker',
          orden: categorias.length + 1,
          activo: true
        }])

      if (error) throw error
      
      await cargarCategorias()
      await cargarCategoriasExistentes() // Recargar para actualizar la lista
      alert(`✅ Categoría "${nombreCategoria}" agregada correctamente`)
    } catch (error) {
      console.error('Error agregando categoría existente:', error)
      alert('Error al agregar categoría')
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

          {/* Sección de categorías existentes en la BD */}
          {categoriasExistentes.length > 0 && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <Download className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">
                  Categorías encontradas en análisis existentes
                </h3>
                {loadingExistentes && (
                  <span className="text-sm text-blue-600">(Cargando...)</span>
                )}
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Estas categorías están siendo usadas en tus análisis pero aún no las has agregado oficialmente:
              </p>
              <div className="flex flex-wrap gap-2">
                {categoriasExistentes.map((categoria, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-md p-2 border border-blue-200">
                    <span className="text-sm font-medium">{categoria}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => agregarCategoriaExistente(categoria)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-100"
                onClick={cargarCategoriasExistentes}
                disabled={loadingExistentes}
              >
                🔄 Actualizar lista
              </Button>
            </div>
          )}

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