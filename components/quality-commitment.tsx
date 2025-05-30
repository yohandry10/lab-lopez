"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { Pencil } from "lucide-react"

interface CompromisoCalidad {
  id: number
  titulo: string
  descripcion: string
  texto_boton: string
  enlace_boton: string
  imagen_url: string
}

interface AboutContent {
  id: number
  titulo_principal: string
  subtitulo: string
  texto_conocenos: string
  descripcion_principal: string
  areas_texto: string
  areas_lista: string[]
  texto_proceso: string
  texto_experiencia: string
  mision_titulo: string
  mision_texto: string
  vision_titulo: string
  vision_texto: string
  valores_titulo: string
  valores_lista: string[]
  is_active: boolean
}

export default function QualityCommitment() {
  const { user } = useAuth()
  const [compromiso, setCompromiso] = useState<CompromisoCalidad | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<CompromisoCalidad | null>(null)
  const [isEditNosotrosModalOpen, setIsEditNosotrosModalOpen] = useState(false)
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [editingAboutData, setEditingAboutData] = useState<AboutContent | null>(null)

  // Datos fallback
  const fallbackData = {
    titulo: "Compromiso con la calidad",
    descripcion: "Proporcionamos a nuestros pacientes y usuarios una excelente atención, calidez, oportunidad y confiabilidad en nuestros resultados.",
    texto_boton: "Nosotros",
    enlace_boton: "/nosotros",
    imagen_url: "/captura1.png"
  }

  // Datos fallback para nosotros
  const fallbackAboutData = {
    id: 1,
    titulo_principal: "Nosotros",
    subtitulo: "Tus exámenes son nuestra prioridad.",
    texto_conocenos: "Conócenos",
    descripcion_principal: "En Laboratorios López, nos dedicamos a brindar servicios de análisis clínicos de alta calidad con más de 20 años de experiencia en el sector salud. Nuestro compromiso es proporcionar resultados precisos y confiables que contribuyan al diagnóstico y tratamiento médico.",
    areas_texto: "Atendemos diversas áreas del laboratorio clínico, incluyendo:",
    areas_lista: ["Bioquímica", "Hematología", "Inmunología", "Microbiología", "Parasitología", "Uroanálisis", "Pruebas especiales y más"],
    texto_proceso: "Nuestro proceso se caracteriza por mantener los más altos estándares de calidad, desde la toma de muestra hasta la entrega de resultados, garantizando la trazabilidad y confidencialidad en cada etapa.",
    texto_experiencia: "Con más de dos décadas de experiencia, hemos logrado posicionarnos como un laboratorio de referencia en la región, atendiendo tanto a pacientes particulares como a instituciones de salud.",
    mision_titulo: "MISIÓN",
    mision_texto: "Brindar servicios de laboratorio clínico con excelencia científica y tecnológica, contribuyendo al diagnóstico médico oportuno y confiable, con un equipo humano comprometido con la calidad y el servicio al paciente.",
    vision_titulo: "VISIÓN", 
    vision_texto: "Ser reconocidos como el laboratorio clínico líder en la región, destacando por nuestra innovación tecnológica, calidad en el servicio y compromiso con la salud de nuestros pacientes.",
    valores_titulo: "VALORES",
    valores_lista: ["Calidad y precisión en todos nuestros procesos", "Compromiso con la salud de nuestros pacientes", "Innovación y actualización tecnológica constante", "Profesionalismo y ética en el servicio", "Confidencialidad y respeto por la privacidad"],
    is_active: true
  }

  useEffect(() => {
    fetchCompromiso()
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("is_active", true)
        .single()

      if (error) {
        console.log("ℹ️ No hay contenido personalizado de nosotros, usando datos fallback")
        return
      }

      if (data) {
        setAboutContent(data)
      }
    } catch (err) {
      console.log("ℹ️ Error al cargar contenido de nosotros, usando datos fallback")
    }
  }

  const fetchCompromiso = async () => {
    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("compromiso_calidad")
        .select("*")
        .eq("is_active", true)
        .single()

      if (error) {
        console.error("❌ Error al cargar compromiso:", error)
        return
      }

      if (data) {
        // Si el texto está incorrecto, actualizarlo automáticamente
        if (data.descripcion.includes("Nuestro compromiso es brindar servicios")) {
          console.log("🔄 Actualizando texto incorrecto en base de datos...")
          const { data: updatedData, error: updateError } = await supabase
            .from("compromiso_calidad")
            .update({
              descripcion: "Proporcionamos a nuestros pacientes y usuarios una excelente atención, calidez, oportunidad y confiabilidad en nuestros resultados."
            })
            .eq("id", data.id)
            .select()
            .single()

          if (updateError) {
            console.error("❌ Error al actualizar texto:", updateError)
            setCompromiso(data) // Usar datos originales si falla la actualización
          } else {
            console.log("✅ Texto actualizado correctamente")
            setCompromiso(updatedData)
          }
        } else {
          setCompromiso(data)
        }
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err)
    }
  }

  const handleEdit = () => {
    if (compromiso) {
      setEditingData(compromiso)
      setIsEditModalOpen(true)
    }
  }

  const handleSave = async () => {
    if (!editingData) return

    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("compromiso_calidad")
        .update({
          titulo: editingData.titulo,
          descripcion: editingData.descripcion,
          texto_boton: editingData.texto_boton,
          enlace_boton: editingData.enlace_boton,
          imagen_url: editingData.imagen_url
        })
        .eq("id", editingData.id)
        .select()
        .single()

      if (error) {
        alert("Error al actualizar: " + error.message)
        return
      }

      setCompromiso(data)
      setIsEditModalOpen(false)
      setEditingData(null)
      console.log("✅ Compromiso actualizado correctamente")
    } catch (err) {
      console.error("❌ Error al guardar:", err)
      alert("Error inesperado al guardar")
    }
  }

  const handleEditNosotros = () => {
    const dataToEdit = aboutContent || fallbackAboutData
    setEditingAboutData(dataToEdit)
    setIsEditNosotrosModalOpen(true)
  }

  const handleSaveNosotros = async () => {
    if (!editingAboutData) return

    const supabase = getSupabaseClient()
    
    try {
      let data, error

      if (aboutContent) {
        // Actualizar registro existente
        const result = await supabase
          .from("about_content")
          .update({
            titulo_principal: editingAboutData.titulo_principal,
            subtitulo: editingAboutData.subtitulo,
            texto_conocenos: editingAboutData.texto_conocenos,
            descripcion_principal: editingAboutData.descripcion_principal,
            areas_texto: editingAboutData.areas_texto,
            areas_lista: editingAboutData.areas_lista,
            texto_proceso: editingAboutData.texto_proceso,
            texto_experiencia: editingAboutData.texto_experiencia,
            mision_titulo: editingAboutData.mision_titulo,
            mision_texto: editingAboutData.mision_texto,
            vision_titulo: editingAboutData.vision_titulo,
            vision_texto: editingAboutData.vision_texto,
            valores_titulo: editingAboutData.valores_titulo,
            valores_lista: editingAboutData.valores_lista
          })
          .eq("id", editingAboutData.id)
          .select()
          .single()
        
        data = result.data
        error = result.error
      } else {
        // Crear nuevo registro
        const result = await supabase
          .from("about_content")
          .insert([{
            ...editingAboutData,
            is_active: true
          }])
          .select()
          .single()
        
        data = result.data
        error = result.error
      }

      if (error) {
        console.error("Error al guardar contenido de nosotros:", error)
        alert("Error al guardar: " + error.message)
        return
      }

      setAboutContent(data)
      setIsEditNosotrosModalOpen(false)
      setEditingAboutData(null)
      console.log("✅ Contenido de nosotros actualizado correctamente")
      alert("✅ Contenido guardado exitosamente")
    } catch (err) {
      console.error("❌ Error al guardar contenido de nosotros:", err)
      alert("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.")
    }
  }

  // Usar datos de BD si están disponibles, sino fallback
  // Pero siempre usar imagen original si la de BD es genérica
  const displayData = compromiso ? {
    ...compromiso,
    imagen_url: compromiso.imagen_url.includes('/mapa-placeholder.jpg') ? '/captura1.png' : compromiso.imagen_url
  } : fallbackData

  return (
    <>
      <section className="w-full py-12 md:py-16 bg-[#f3f9fe] relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 relative">
            {/* Botón de editar para admin */}
            {user?.user_type === "admin" && (
              <div className="absolute top-4 right-4 z-10">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border border-gray-300 shadow-sm"
                  onClick={handleEdit}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Texto */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="space-y-4">
                  <div className="text-sm text-[#1e5fad] uppercase tracking-wider">LABORATORIO CLÍNICO LOPEZ</div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black font-sans">
                    {displayData.titulo}
                  </h2>
                  <p className="text-gray-600">
                    {displayData.descripcion}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button asChild className="bg-[#1e5fad] hover:bg-[#1e5fad]/90">
                      <Link href={displayData.enlace_boton}>{displayData.texto_boton}</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Imagen del mapa + botón */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative h-[300px] rounded-lg overflow-hidden"
              >
                <Image src={displayData.imagen_url} alt="Mapa de sedes" fill className="object-contain" priority />

                <Link
                  href="/sedes"
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-blue-900 text-center"
                >
                  <h4 className="font-bold text-sm">Visítanos en</h4>
                  <p className="text-sm">nuestras sedes</p>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Compromiso con la Calidad</DialogTitle>
          </DialogHeader>
          
          {editingData && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={editingData.titulo}
                  onChange={(e) => setEditingData({...editingData, titulo: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={editingData.descripcion}
                  onChange={(e) => setEditingData({...editingData, descripcion: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="texto_boton">Texto del botón *</Label>
                  <Input
                    id="texto_boton"
                    value={editingData.texto_boton}
                    onChange={(e) => setEditingData({...editingData, texto_boton: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="enlace_boton">Enlace del botón *</Label>
                  <Input
                    id="enlace_boton"
                    value={editingData.enlace_boton}
                    onChange={(e) => setEditingData({...editingData, enlace_boton: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imagen_url">URL de imagen</Label>
                <Input
                  id="imagen_url"
                  value={editingData.imagen_url}
                  onChange={(e) => setEditingData({...editingData, imagen_url: e.target.value})}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-[#3DA64A] hover:bg-[#3DA64A]/90">
              Guardar
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsEditModalOpen(false)
                handleEditNosotros()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Editar Contenido de Nosotros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edición de contenido de Nosotros */}
      <Dialog open={isEditNosotrosModalOpen} onOpenChange={setIsEditNosotrosModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contenido de Nosotros</DialogTitle>
          </DialogHeader>
          
          {editingAboutData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titulo_principal">Título Principal *</Label>
                  <Input
                    id="titulo_principal"
                    value={editingAboutData.titulo_principal}
                    onChange={(e) => setEditingAboutData({...editingAboutData, titulo_principal: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="subtitulo">Subtítulo *</Label>
                  <Input
                    id="subtitulo"
                    value={editingAboutData.subtitulo}
                    onChange={(e) => setEditingAboutData({...editingAboutData, subtitulo: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="texto_conocenos">Texto "Conócenos" *</Label>
                <Input
                  id="texto_conocenos"
                  value={editingAboutData.texto_conocenos}
                  onChange={(e) => setEditingAboutData({...editingAboutData, texto_conocenos: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="descripcion_principal">Descripción Principal *</Label>
                <Textarea
                  id="descripcion_principal"
                  value={editingAboutData.descripcion_principal}
                  onChange={(e) => setEditingAboutData({...editingAboutData, descripcion_principal: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="areas_texto">Texto de Áreas *</Label>
                <Input
                  id="areas_texto"
                  value={editingAboutData.areas_texto}
                  onChange={(e) => setEditingAboutData({...editingAboutData, areas_texto: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="areas_lista">Lista de Áreas (separadas por coma) *</Label>
                <Textarea
                  id="areas_lista"
                  value={editingAboutData.areas_lista.join(', ')}
                  onChange={(e) => setEditingAboutData({...editingAboutData, areas_lista: e.target.value.split(', ').filter(item => item.trim())})}
                  placeholder="Bioquímica, Hematología, Inmunología..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="texto_proceso">Texto del Proceso *</Label>
                <Textarea
                  id="texto_proceso"
                  value={editingAboutData.texto_proceso}
                  onChange={(e) => setEditingAboutData({...editingAboutData, texto_proceso: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="texto_experiencia">Texto de Experiencia *</Label>
                <Textarea
                  id="texto_experiencia"
                  value={editingAboutData.texto_experiencia}
                  onChange={(e) => setEditingAboutData({...editingAboutData, texto_experiencia: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mision_titulo">Título Misión *</Label>
                  <Input
                    id="mision_titulo"
                    value={editingAboutData.mision_titulo}
                    onChange={(e) => setEditingAboutData({...editingAboutData, mision_titulo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="vision_titulo">Título Visión *</Label>
                  <Input
                    id="vision_titulo"
                    value={editingAboutData.vision_titulo}
                    onChange={(e) => setEditingAboutData({...editingAboutData, vision_titulo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="valores_titulo">Título Valores *</Label>
                  <Input
                    id="valores_titulo"
                    value={editingAboutData.valores_titulo}
                    onChange={(e) => setEditingAboutData({...editingAboutData, valores_titulo: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mision_texto">Texto de Misión *</Label>
                <Textarea
                  id="mision_texto"
                  value={editingAboutData.mision_texto}
                  onChange={(e) => setEditingAboutData({...editingAboutData, mision_texto: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="vision_texto">Texto de Visión *</Label>
                <Textarea
                  id="vision_texto"
                  value={editingAboutData.vision_texto}
                  onChange={(e) => setEditingAboutData({...editingAboutData, vision_texto: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="valores_lista">Lista de Valores (separados por coma) *</Label>
                <Textarea
                  id="valores_lista"
                  value={editingAboutData.valores_lista.join(', ')}
                  onChange={(e) => setEditingAboutData({...editingAboutData, valores_lista: e.target.value.split(', ').filter(item => item.trim())})}
                  placeholder="Calidad y precisión, Compromiso con la salud, Innovación..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNosotrosModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNosotros} className="bg-[#3DA64A] hover:bg-[#3DA64A]/90">
              Guardar Contenido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

