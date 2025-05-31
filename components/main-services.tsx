"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"

// Definición del tipo para un perfil de bienestar
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

const services = [
  {
    id: 1,
    title: "Salud Sexual",
    description: "Confianza, libertad y seguridad para elegir",
    image: "/diabetes.jpg",
    link: "/servicios/salud-sexual",
    slug: "salud-sexual"
  },
  {
    id: 2,
    title: "Masculino Edad de Oro",
    description: "Experiencia, sabiduría y plenitud",
    image: "/viejitos.jpg",
    link: "/servicios/masculino-edad-oro",
    slug: "masculino-edad-oro"
  },
  {
    id: 3,
    title: "Diabetes bajo control",
    description: "Estilo de vida, autocontrol, bienestar",
    image: "/perfil.jpg",
    link: "/servicios/diabetes-control",
    slug: "diabetes-control"
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function MainServices() {
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const [perfilesBienestar, setPerfilesBienestar] = useState<PerfilBienestar[]>([])
  const [sectionTitle, setSectionTitle] = useState("Perfiles de bienestar")
  const [editingTitle, setEditingTitle] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // Para el carrusel
  const itemsPerPage = 3 // Siempre mostrar 3

  useEffect(() => {
    setMounted(true)
    fetchPerfilesBienestar()
    fetchSectionTitle()
  }, [])

  // Cargar perfiles de bienestar desde Supabase
  const fetchPerfilesBienestar = async () => {
    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("perfiles_bienestar")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: true })

      if (error) {
        console.error("❌ Error al cargar perfiles de bienestar:", error)
        return
      }

      if (data && Array.isArray(data)) {
        console.log("✅ Perfiles cargados desde BD:", data.length)
        setPerfilesBienestar(data)
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err)
    }
  }

  // Cargar título de la sección desde Supabase
  const fetchSectionTitle = async () => {
    const supabase = getSupabaseClient()
    
    try {
      console.log("🔄 Cargando título de sección...")
      
      const { data, error } = await supabase
        .from("configuracion_secciones")
        .select("titulo")
        .eq("seccion", "perfiles_bienestar")
        .single()

      if (error) {
        console.log("⚠️ No se encontró configuración del título, usando por defecto:", error.message)
        setSectionTitle("Perfiles de bienestar")
        return
      }

      if (data?.titulo) {
        console.log("✅ Título cargado:", data.titulo)
        setSectionTitle(data.titulo)
      } else {
        console.log("⚠️ No hay título en la respuesta, usando por defecto")
        setSectionTitle("Perfiles de bienestar")
      }
    } catch (err) {
      console.log("⚠️ Error al cargar título, usando por defecto:", err)
      setSectionTitle("Perfiles de bienestar")
    }
  }

  // Guardar título de la sección en Supabase
  const saveSectionTitle = async (newTitle: string) => {
    if (!newTitle.trim()) {
      alert("El título no puede estar vacío")
      return
    }

    console.log("🔄 Iniciando guardado de título:", newTitle.trim())
    
    const supabase = getSupabaseClient()
    
    try {
      // Primero verificar si la tabla existe
      console.log("🔍 Verificando conexión a Supabase...")
      
      const { data: testData, error: testError } = await supabase
        .from("configuracion_secciones")
        .select("count", { count: "exact" })
      
      if (testError) {
        console.error("❌ Error de conexión/tabla:", testError)
        alert(`Error de tabla: ${testError.message}`)
        handleTitleCancel()
        return
      }
      
      console.log("✅ Tabla accesible, procediendo con upsert...")
      
      // Hacer el upsert
      const { data, error } = await supabase
        .from("configuracion_secciones")
        .upsert({
          seccion: "perfiles_bienestar",
          titulo: newTitle.trim()
        }, {
          onConflict: "seccion"
        })
        .select()

      if (error) {
        console.error("❌ Error en upsert:", error)
        alert(`Error al guardar: ${error.message}\nDetalles: ${JSON.stringify(error)}`)
        handleTitleCancel()
        return
      }

      console.log("✅ Título guardado exitosamente:", data)
      setSectionTitle(newTitle.trim())
      setEditingTitle(false)
      alert("✅ Título guardado correctamente")
      
    } catch (err) {
      console.error("❌ Error inesperado completo:", err)
      alert(`Error inesperado: ${String(err)}`)
      handleTitleCancel()
    }
  }

  const handleTitleEdit = () => {
    if (editingTitle) {
      // Guardar cambios
      saveSectionTitle(sectionTitle)
    } else {
      // Activar edición
      setEditingTitle(true)
    }
  }

  const handleTitleCancel = () => {
    setEditingTitle(false)
    fetchSectionTitle() // Recargar título original
  }

  // Funciones para el carrusel
  const nextPage = () => {
    const allServices = getAllServices()
    const totalPages = Math.ceil(allServices.length / itemsPerPage)
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    const allServices = getAllServices()
    const totalPages = Math.ceil(allServices.length / itemsPerPage)
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  // Obtener todos los servicios disponibles
  const getAllServices = () => {
    if (perfilesBienestar.length > 0) {
      console.log("📊 Usando perfiles de BD:", perfilesBienestar.length)
      return perfilesBienestar.map(perfil => {
        const originalService = services.find(s => s.slug === perfil.slug)
        return {
          id: perfil.id || 0,
          title: perfil.title,
          description: perfil.description,
          image: originalService?.image || perfil.image,
          link: `/servicios/${perfil.slug}`,
          slug: perfil.slug,
          price: perfil.price
        }
      })
    } else {
      console.log("📊 Usando fallback services:", services.length)
      return services
    }
  }

  // Función para obtener los servicios de la página actual
  const getDisplayServices = () => {
    const allServices = getAllServices()
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allServices.slice(startIndex, endIndex)
  }

  if (!mounted) {
    return null
  }

  const displayServices = getDisplayServices()

  return (
    <AnimatePresence>
      <motion.section
        className="w-full py-12 md:py-24 bg-[#f3f9fe] snap-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full flex flex-col items-center md:flex-row md:justify-center md:items-center">
              <div className="flex items-center gap-2">
                {editingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      className="text-3xl font-light tracking-tighter sm:text-4xl md:text-5xl text-center text-black font-sans bg-transparent border-b-2 border-blue-500 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleTitleEdit()
                        }
                        if (e.key === 'Escape') {
                          handleTitleCancel()
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleTitleEdit()
                      }}
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleTitleCancel()
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-light tracking-tighter sm:text-4xl md:text-5xl text-center text-black font-sans md:text-left md:mr-8">
                      {sectionTitle}
                    </h2>
                    
                    {/* Botón de editar título solo para admin */}
                    {(user?.user_type === "admin" || user?.email === "admin@laboratoriolopez.com") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleTitleEdit()
                        }}
                        className="ml-2 h-8 w-8 p-0 border-blue-500 text-blue-600 hover:bg-blue-100 bg-white/90"
                        title="Editar título"
                      >
                        ✏️
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 md:relative">
                <Link href="/servicios">
                  <Button className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-transform hover:scale-105">
                    VER MAS
                  </Button>
                </Link>
              </div>
            </div>
            <p className="mt-4 max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Servicios diseñados para mejorar tu calidad de vida
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {displayServices.map((service, index) => (
              <motion.div key={service.slug || service.id} variants={item}>
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover"
                      priority={true}
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      asChild
                      className="bg-[#1e5fad] hover:bg-[#1e5fad]/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg relative z-10"
                    >
                      <Link href={service.link}>VER DETALLES</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Navegación del carrusel */}
          {getAllServices().length > itemsPerPage && (
            <motion.div 
              className="flex justify-center items-center mt-8 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Button
                onClick={prevPage}
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 border-[#3DA64A] text-[#3DA64A] hover:bg-[#3DA64A] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(getAllServices().length / itemsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      currentPage === index ? 'bg-[#3DA64A]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextPage}
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 border-[#3DA64A] text-[#3DA64A] hover:bg-[#3DA64A] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-500 ml-4">
                {currentPage + 1} de {Math.ceil(getAllServices().length / itemsPerPage)}
              </span>
            </motion.div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  )
}

