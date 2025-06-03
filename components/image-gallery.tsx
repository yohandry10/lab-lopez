"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { Pencil } from "lucide-react"

interface NuestrosAliados {
  id: number
  titulo: string
}

interface AliadoLogo {
  id: number
  nombre: string
  imagen_url: string
  orden: number
}

export function ImageGallery() {
  const { user } = useAuth()
  const [aliados, setAliados] = useState<NuestrosAliados | null>(null)
  const [logos, setLogos] = useState<AliadoLogo[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<NuestrosAliados | null>(null)
  const [editingLogos, setEditingLogos] = useState<AliadoLogo[]>([])

  // Datos fallback
  const fallbackPartners = [
    { src: '/uno.jpeg', alt: 'Aliado 1' },
    { src: '/dos.jpg', alt: 'Aliado 2' },
    { src: '/tres.png', alt: 'Aliado 3' },
    { src: '/cuatro.jpeg', alt: 'Aliado 4' }
  ]

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  
  useEffect(() => {
    if (!emblaApi) return
    const timer = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(timer)
  }, [emblaApi])

  useEffect(() => {
    fetchAliados()
    fetchLogos()
  }, [])

  const fetchAliados = async () => {
    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("nuestros_aliados")
        .select("*")
        .eq("is_active", true)
        .single()

      if (error) {
        console.error("❌ Error al cargar aliados:", error)
        return
      }

      if (data) {
        setAliados(data)
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err)
    }
  }

  const fetchLogos = async () => {
    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("aliados_logos")
        .select("*")
        .eq("is_active", true)
        .order("orden", { ascending: true })

      if (error) {
        console.error("❌ Error al cargar logos:", error)
        return
      }

      if (data && data.length > 0) {
        setLogos(data)
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err)
    }
  }

  const handleEdit = () => {
    if (aliados) {
      setEditingData(aliados)
      setEditingLogos([...logos])
      setIsEditModalOpen(true)
    }
  }

  const handleSave = async () => {
    if (!editingData) return

    const supabase = getSupabaseClient()
    
    try {
      // Actualizar título
      const { data: aliadosData, error: aliadosError } = await supabase
        .from("nuestros_aliados")
        .update({ titulo: editingData.titulo })
        .eq("id", editingData.id)
        .select()
        .single()

      if (aliadosError) {
        alert("Error al actualizar título: " + aliadosError.message)
        return
      }

      // Actualizar logos
      for (const logo of editingLogos) {
        const { error: logoError } = await supabase
          .from("aliados_logos")
          .update({
            nombre: logo.nombre,
            imagen_url: logo.imagen_url
          })
          .eq("id", logo.id)

        if (logoError) {
          console.error("Error al actualizar logo:", logoError)
        }
      }

      setAliados(aliadosData)
      setLogos(editingLogos)
      setIsEditModalOpen(false)
      setEditingData(null)
      setEditingLogos([])
      console.log("✅ Aliados actualizados correctamente")
    } catch (err) {
      console.error("❌ Error al guardar:", err)
      alert("Error inesperado al guardar")
    }
  }

  const updateLogo = (index: number, field: keyof AliadoLogo, value: string) => {
    const newLogos = [...editingLogos]
    newLogos[index] = { ...newLogos[index], [field]: value }
    setEditingLogos(newLogos)
  }

  // Usar datos de BD si están disponibles, sino fallback
  const displayTitle = aliados?.titulo || "Nuestros Aliados"
  const displayPartners = logos.length > 0 
    ? logos.map((logo, index) => {
        // Usar imágenes originales si las de BD son las genéricas
        const originalImages = ['/uno.jpeg', '/dos.jpg', '/tres.png', '/cuatro.jpeg']
        const shouldUseOriginal = logo.imagen_url.includes('/aliado') || logo.imagen_url.includes('aliado')
        
        return {
          src: shouldUseOriginal ? originalImages[index] || logo.imagen_url : logo.imagen_url,
          alt: logo.nombre
        }
      })
    : fallbackPartners

  return (
    <>
      <section className="py-12 bg-white relative">
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-8 text-center">
            {displayTitle}
          </h2>
          
          {/* Botón de editar para admin */}
          {user?.user_type === "admin" && (
            <div className="absolute top-0 right-4">
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
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {displayPartners.map((partner, idx) => (
                <div key={idx} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 rounded overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src={partner.src || '/placeholder.svg'}
                    alt={partner.alt}
                    width={200}
                    height={100}
                    className="object-contain h-32"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Nuestros Aliados</DialogTitle>
          </DialogHeader>
          
          {editingData && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="titulo">Título de la sección *</Label>
                <Input
                  id="titulo"
                  value={editingData.titulo}
                  onChange={(e) => setEditingData({...editingData, titulo: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">Logos de Aliados (máximo 4)</Label>
                <div className="space-y-4 mt-2">
                  {editingLogos.map((logo, index) => (
                    <div key={logo.id} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor={`nombre-${index}`}>Nombre del aliado</Label>
                        <Input
                          id={`nombre-${index}`}
                          value={logo.nombre}
                          onChange={(e) => updateLogo(index, 'nombre', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`imagen-${index}`}>URL de la imagen</Label>
                        <Input
                          id={`imagen-${index}`}
                          value={logo.imagen_url}
                          onChange={(e) => updateLogo(index, 'imagen_url', e.target.value)}
                        />
                      </div>
                      {logo.imagen_url && (
                        <div className="col-span-2 flex justify-center">
                          <Image
                            src={logo.imagen_url || '/placeholder.svg'}
                            alt={logo.nombre}
                            width={150}
                            height={75}
                            className="object-contain h-16 border rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 