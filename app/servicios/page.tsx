"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { Pencil, Trash2, Plus, Edit } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import PerfilBienestarAdminModal from "@/components/perfil-bienestar-admin-modal"

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

// Definición del tipo para un perfil (compatibilidad con código existente)
interface Profile {
  title: string
  description: string
  content: string
  price: number
  image: string
  locations: string[] | string
  sampleType: string | string[]
  ageRequirement: string
  tests: string[]
  conditions: string[]
  slug?: string
}

// Tipo para el objeto de perfiles con índice de string
interface ProfilesData {
  [key: string]: Profile
}

// Datos de los perfiles (fallback si no hay datos en Supabase)
const profilesFallback: ProfilesData = {
  "prevencion-total": {
    title: "Perfil Prevención total",
    description:
      "Una visión clara de lo que importa para poner tu salud en perspectiva. Este perfil te permitirá conocer de manera general cómo está tu organismo, para prevenir y/o tratar alguna enfermedad de forma oportuna. La salud es una relación entre tú y tu cuerpo, cuidarla depende de ti; pero permítenos acompañarte.",
    content:
      "Este perfil está diseñado para brindarte un panorama general de tu salud. Con exámenes clave, podrás identificar áreas de riesgo y tomar medidas preventivas a tiempo.",
    price: 690.0,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Cualquier edad",
    tests: [
      "HEMOGRAMA",
      "GLUCOSA",
      "UREA",
      "CREATININA",
      "COLESTEROL TOTAL",
      "TRIGLICÉRIDOS",
      "HDL",
      "LDL",
      "ÁCIDO ÚRICO",
      "PROTEÍNAS TOTALES"
    ],
    conditions: [
      "Ayuno de 8 horas",
      "No realizar ejercicio intenso 24 horas antes",
      "Informar sobre medicamentos en uso"
    ],
  },
  "hombre-saludable": {
    title: "Perfil Hombre saludable",
    description:
      "Este perfil proporciona una mirada a tu salud en general, abordando las dudas más comunes que pueden surgir en los hombres entre 18 y 45 años. Compuesto por 16 pruebas, te ayudará a cuidar tu bienestar.",
    content:
      "Pensado para hombres que desean un chequeo integral, este perfil evalúa indicadores clave para que tomes decisiones informadas sobre tu salud.",
    price: 450.0,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "18-45 años",
    tests: [
      "HEMOGRAMA",
      "GLUCOSA",
      "UREA",
      "CREATININA",
      "COLESTEROL TOTAL",
      "TRIGLICÉRIDOS",
      "HDL",
      "LDL",
      "PSA TOTAL",
      "PSA LIBRE",
      "TESTOSTERONA TOTAL",
      "TESTOSTERONA LIBRE",
      "CORTISOL",
      "TSH",
      "T4 LIBRE",
      "T3"
    ],
    conditions: [
      "Ayuno de 8 horas",
      "No realizar ejercicio intenso 24 horas antes",
      "Informar sobre medicamentos en uso",
      "Para PSA: No tener relaciones sexuales 48 horas antes"
    ],
  },
  "mujer-saludable": {
    title: "Perfil Mujer saludable",
    description:
      "Este perfil es esencial para examinar tu salud, controlar tus niveles hormonales y conocer tu riesgo a desarrollar enfermedades crónicas antes de los 45 años.",
    content:
      "Diseñado especialmente para mujeres, este perfil te ayudará a mantener un control integral de tu salud, anticipando posibles complicaciones.",
    price: 550.0,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Hasta 45 años",
    tests: [
      "HEMOGRAMA",
      "GLUCOSA",
      "UREA",
      "CREATININA",
      "COLESTEROL TOTAL",
      "TRIGLICÉRIDOS",
      "HDL",
      "LDL",
      "TSH",
      "T4 LIBRE",
      "T3",
      "FSH",
      "LH",
      "ESTRADIOL",
      "PROGESTERONA",
      "PROLACTINA"
    ],
    conditions: [
      "Ayuno de 8 horas",
      "No realizar ejercicio intenso 24 horas antes",
      "Informar sobre medicamentos en uso",
      "Para hormonas: Tomar la muestra en los primeros días del ciclo menstrual"
    ],
  },
  preoperatorio: {
    title: "Perfil Preoperatorio",
    description:
      "Si tu médico te ha solicitado exámenes preoperatorios, conoce las pruebas que integran nuestro perfil preoperatorio.",
    content:
      "Este perfil reúne las pruebas necesarias para garantizar que estés en óptimas condiciones antes de una cirugía.",
    price: 0,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede"],
    sampleType: "General",
    ageRequirement: "Mayor de 18",
    tests: [],
    conditions: [],
  },
  "salud-sexual": {
    title: "Perfil Salud sexual",
    description:
      "La salud sexual requiere un enfoque positivo y respetuoso, con experiencias seguras y libres de temores. Con información oportuna, adquiere hábitos saludables.",
    content:
      "Este perfil te permite evaluar tu salud sexual mediante exámenes específicos, garantizando una atención integral y preventiva.",
    price: 300.0,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "Sangre",
    ageRequirement: "18 años en adelante",
    tests: [
      "HIV 1/2 anticuerpo antígeno",
      "Hepatitis B, antígeno australiano (HBsAg)",
      "Hepatitis B, anticore total (anti-HBcAg)",
      "Hepatitis C anticuerpos",
      "VDRL",
    ],
    conditions: [
      "Los análisis en sangre NO requieren ayuno.",
      "Informa sobre medicamentos o tratamientos durante la toma de muestra.",
    ],
  },
  "salud-metabolica": {
    title: "Perfil Salud metabólica",
    description:
      "Evalúa cómo trabaja tu metabolismo para transformar lo que comes en energía y detectar desbalances que puedan afectar tu bienestar.",
    content:
      "Este perfil analiza los procesos metabólicos para brindarte una imagen clara de cómo funciona tu organismo.",
    price: 0,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "General",
    ageRequirement: "Cualquier edad",
    tests: [],
    conditions: [],
  },
  "masculino-edad-oro": {
    title: "Perfil masculino Edad de oro",
    description:
      "Conoce los cambios normales y aquellos que pueden ser señal de un problema de salud. Este perfil te ayuda a entender y monitorear tu organismo con el paso de los años.",
    content:
      "Especialmente diseñado para hombres mayores de 45, este perfil integra diversas pruebas para evaluar tu salud integral y anticipar posibles complicaciones.",
    price: 690.0,
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: ["Sangre", "Orina"],
    ageRequirement: "45 años en adelante",
    tests: [],
    conditions: [],
  },
  "diabetes-control": {
    title: "Perfil Diabetes bajo control",
    description: "Monitorea tus niveles de azúcar para detectar indicios de prediabetes o diabetes a tiempo.",
    content:
      "A través de exámenes específicos, este perfil evalúa tus niveles de glucosa y otros indicadores críticos, permitiéndote tomar medidas preventivas.",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    locations: ["Sede", "Domicilio"],
    sampleType: "Sangre",
    ageRequirement: "18 años en adelante",
    tests: [],
    conditions: [],
  },
}

export default function ServiciosPage() {
  const { user } = useAuth()
  const [perfilesBienestar, setPerfilesBienestar] = useState<PerfilBienestar[]>([])
  const [profiles, setProfiles] = useState<ProfilesData>(profilesFallback)
  const [loading, setLoading] = useState(true)
  
  // Estados para administración
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [editingPerfil, setEditingPerfil] = useState<PerfilBienestar | null>(null)
  const [modalMode, setModalMode] = useState<"edit">("edit")

  // Estados para modal de edición de perfiles populares (código existente)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProfile, setNewProfile] = useState<Profile>({
    title: "",
    description: "",
    content: "",
    price: 0,
    image: "",
    locations: ["Sede"],
    sampleType: "General",
    ageRequirement: "Cualquier edad",
    tests: [],
    conditions: [],
  })

  // Cargar perfiles de bienestar desde Supabase
  useEffect(() => {
    async function fetchPerfilesBienestar() {
      console.log("🔄 Cargando perfiles de bienestar desde Supabase...")
      const supabase = getSupabaseClient()
      
      try {
        const { data, error } = await supabase
          .from("perfiles_bienestar")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true })

        if (error) {
          console.error("❌ Error al cargar perfiles de bienestar:", error)
          // Convertir datos fallback al formato de Supabase
          const fallbackData = Object.entries(profilesFallback).map((entry, index) => ({
            id: index + 1,
            slug: entry[0],
            title: entry[1].title,
            description: entry[1].description,
            content: entry[1].content,
            price: entry[1].price,
            image: entry[1].image,
            locations: Array.isArray(entry[1].locations) ? entry[1].locations : [entry[1].locations],
            sample_type: Array.isArray(entry[1].sampleType) ? entry[1].sampleType.join(", ") : entry[1].sampleType,
            age_requirement: entry[1].ageRequirement,
            tests: entry[1].tests,
            conditions: entry[1].conditions,
            is_active: true
          }))
          setPerfilesBienestar(fallbackData)
          return
        }

        if (data && Array.isArray(data)) {
          console.log("✅ Perfiles de bienestar cargados desde Supabase:", data.length)
          setPerfilesBienestar(data)
          
          // Convertir a formato de profiles para compatibilidad
          const profilesData: ProfilesData = {}
          data.forEach(perfil => {
            profilesData[perfil.slug] = {
              title: perfil.title,
              description: perfil.description,
              content: perfil.content,
              price: perfil.price,
              image: perfil.image,
              locations: perfil.locations,
              sampleType: perfil.sample_type,
              ageRequirement: perfil.age_requirement,
              tests: perfil.tests,
              conditions: perfil.conditions,
              slug: perfil.slug
            }
          })
          setProfiles(profilesData)
        } else {
          console.log("⚠️ No hay datos en Supabase, usando datos fallback")
          setProfiles(profilesFallback)
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err)
        setProfiles(profilesFallback)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfilesBienestar()
  }, [])

  // Funciones para administración de perfiles de bienestar
  const handleEditPerfilBienestar = (perfil: PerfilBienestar) => {
    setEditingPerfil(perfil)
    setModalMode("edit")
    setIsAdminModalOpen(true)
  }

  const handleDeletePerfilBienestar = async (perfil: PerfilBienestar) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el perfil "${perfil.title}"?`)) {
      return
    }

    const supabase = getSupabaseClient()
    
    try {
      const { error } = await supabase
        .from("perfiles_bienestar")
        .delete()
        .eq("id", perfil.id)

      if (error) {
        alert("Error al eliminar perfil: " + error.message)
        return
      }

      // Actualizar estado local
      setPerfilesBienestar(prev => prev.filter(p => p.id !== perfil.id))
      
      // Actualizar profiles para compatibilidad
      setProfiles(prev => {
        const newProfiles = { ...prev }
        delete newProfiles[perfil.slug]
        return newProfiles
      })

      console.log("✅ Perfil eliminado correctamente")
    } catch (err) {
      console.error("❌ Error al eliminar perfil:", err)
      alert("Error inesperado al eliminar el perfil")
    }
  }

  const handleSavePerfilBienestar = async (perfilData: PerfilBienestar) => {
    const supabase = getSupabaseClient()
    
    try {
      // Solo actualizar perfil existente (no crear nuevos)
      const { data, error } = await supabase
        .from("perfiles_bienestar")
        .update({
          slug: perfilData.slug,
          title: perfilData.title,
          description: perfilData.description,
          content: perfilData.content,
          price: perfilData.price,
          image: perfilData.image,
          locations: perfilData.locations,
          sample_type: perfilData.sample_type,
          age_requirement: perfilData.age_requirement,
          tests: perfilData.tests,
          conditions: perfilData.conditions
        })
        .eq("id", perfilData.id)
        .select()
        .single()

      if (error) {
        alert("Error al actualizar perfil: " + error.message)
        return
      }

      // Actualizar estado local
      setPerfilesBienestar(prev => 
        prev.map(p => p.id === data.id ? data : p)
      )
      
      // Actualizar profiles para compatibilidad
      setProfiles(prev => ({
        ...prev,
        [data.slug]: {
          title: data.title,
          description: data.description,
          content: data.content,
          price: data.price,
          image: data.image,
          locations: data.locations,
          sampleType: data.sample_type,
          ageRequirement: data.age_requirement,
          tests: data.tests,
          conditions: data.conditions,
          slug: data.slug
        }
      }))

      console.log("✅ Perfil actualizado correctamente")
      setIsAdminModalOpen(false)
      setEditingPerfil(null)
    } catch (err) {
      console.error("❌ Error al guardar perfil:", err)
      alert("Error inesperado al guardar el perfil")
    }
  }

  // Funciones existentes para perfiles populares
  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile)
    setIsEditModalOpen(true)
  }

  const handleDeleteProfile = (slug: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este perfil?")) {
      setProfiles(prev => {
        const newProfiles = { ...prev }
        delete newProfiles[slug]
        return newProfiles
      })
    }
  }

  const handleAddProfile = () => {
    setNewProfile({
      title: "",
      description: "",
      content: "",
      price: 0,
      image: "",
      locations: ["Sede"],
      sampleType: "General",
      ageRequirement: "Cualquier edad",
      tests: [],
      conditions: [],
    })
    setIsAddModalOpen(true)
  }

  const handleSaveProfile = (updatedProfile: Profile) => {
    if (editingProfile) {
      // Editar perfil existente
      const profileKey = Object.keys(profiles).find(key => profiles[key] === editingProfile)
      if (profileKey) {
        setProfiles(prev => ({
          ...prev,
          [profileKey]: updatedProfile
        }))
      }
    }
    setIsEditModalOpen(false)
    setEditingProfile(null)
  }

  // Resto del código existente...
  const profileEntries = Object.entries(profiles)

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DA64A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfiles de bienestar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 sm:mb-4">
          Perfiles de bienestar
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-500">
          Servicios diseñados para mejorar tu calidad de vida
        </p>
        
        {user?.user_type === "admin" && (
          <div className="mt-6 space-x-4">
            <Button 
              onClick={handleAddProfile}
              variant="outline"
              className="border-[#3DA64A] text-[#3DA64A] hover:bg-[#3DA64A]/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Perfil Popular
            </Button>
          </div>
        )}
      </div>

      {/* Tabla de administración para admin */}
      {user?.user_type === "admin" && (
        <div className="mb-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Administración de Perfiles</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exámenes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {perfilesBienestar.map((perfil) => (
                  <tr key={perfil.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={perfil.image}
                            alt={perfil.title}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{perfil.title}</div>
                          <div className="text-sm text-gray-500">{perfil.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      S/. {perfil.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {perfil.tests.length} exámenes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEditPerfilBienestar(perfil)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePerfilBienestar(perfil)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid de perfiles para usuarios */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {profileEntries.map(([slug, profile], index) => {
          // Buscar el perfil completo en perfilesBienestar para tener el ID
          const perfilCompleto = perfilesBienestar.find(p => p.slug === slug)
          
          return (
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
          >
              <Card className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                <div className="relative h-48 sm:h-56 md:h-48 lg:h-56 overflow-hidden">
                <Image
                  src={profile.image}
                  alt={profile.title}
                  fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 drop-shadow-lg">
                      {profile.title}
                    </h3>
                    {profile.price > 0 && (
                      <p className="text-2xl sm:text-3xl font-bold text-[#3DA64A] drop-shadow-lg">
                        S/. {profile.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  
                {user?.user_type === "admin" && (
                    <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => {
                          if (perfilCompleto) {
                            // Es un perfil de bienestar con ID
                            handleEditPerfilBienestar(perfilCompleto)
                          } else {
                            // Es un perfil popular sin ID
                            handleEditProfile(profile)
                          }
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
                        onClick={() => {
                          if (perfilCompleto) {
                            // Es un perfil de bienestar con ID
                            handleDeletePerfilBienestar(perfilCompleto)
                          } else {
                            // Es un perfil popular sin ID
                            handleDeleteProfile(slug)
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
                
                <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-3 flex-1">
                    {profile.description}
                  </p>
                  
                <div className="mt-auto">
                  <Link href={`/servicios/${slug}`}>
                      <Button className="w-full bg-gradient-to-r from-[#1E5FAD] to-[#3DA64A] hover:from-[#3DA64A] hover:to-[#1E5FAD] text-white font-semibold py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          )
        })}
      </div>

      {/* Modal de administración de perfiles de bienestar */}
      <PerfilBienestarAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSave={handleSavePerfilBienestar}
        perfil={editingPerfil}
        mode={modalMode}
      />

      {/* Resto de modales existentes... */}
    </div>
  )
}

