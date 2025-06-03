"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { Building2, Syringe, TestTube, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { getSupabaseClient } from "@/lib/supabase"

// Función para normalizar slugs (remover acentos y caracteres especiales)
function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

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

export default function ServicePage() {
  const params = useParams()
  const [profile, setProfile] = useState<PerfilBienestar | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const slug = params.slug
      if (typeof slug !== "string") {
        notFound()
        return
      }

      console.log("🔍 Buscando perfil con slug:", slug)
      const supabase = getSupabaseClient()
      
      try {
        // Normalizar el slug de la URL
        const normalizedSlug = normalizeSlug(decodeURIComponent(slug))
        console.log("🔄 Slug normalizado:", normalizedSlug)

        // Buscar por slug exacto primero
        let { data, error } = await supabase
          .from("perfiles_bienestar")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .single()

        // Si no se encuentra, buscar con slug normalizado
        if (error || !data) {
          console.log("❌ No encontrado con slug original, buscando normalizado...")
          const { data: normalizedData, error: normalizedError } = await supabase
            .from("perfiles_bienestar")
            .select("*")
            .eq("slug", normalizedSlug)
            .eq("is_active", true)
            .single()

          data = normalizedData
          error = normalizedError
        }

        if (error || !data) {
          console.error("❌ Error al cargar perfil:", error)
          notFound()
          return
        }

        console.log("✅ Perfil encontrado:", data.title)
        setProfile(data)
      } catch (err) {
        console.error("❌ Error inesperado:", err)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params])

  if (loading) {
    return (
      <div className="container px-4 py-12 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    notFound()
    return null
  }

  return (
    <div className="min-h-screen bg-[#f3f9fe]">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
        <Image 
          src={profile.image && profile.image.trim() !== "" ? profile.image : "/placeholder.svg"} 
          alt={profile.title} 
          fill 
          className="object-cover" 
          priority 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                {profile.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                {profile.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-blue-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">ENTÉRATE DE QUE SE TRATA</h2>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 leading-tight">{profile.description}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{profile.content}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Disponible en</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {profile.locations.map((location) => (
                        <div key={location} className="flex items-center gap-2">
                          {location === "Sede" ? (
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          ) : (
                            <Syringe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          )}
                          <span className="text-sm sm:text-base">{location}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Tipo de muestra</h4>
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="text-sm sm:text-base">
                        {Array.isArray(profile.sample_type) ? profile.sample_type.join(", ") : profile.sample_type}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Edad</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="text-sm sm:text-base">{profile.age_requirement}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 sm:mb-8">
                <div className="text-green-600 font-medium text-sm sm:text-base">Disponible</div>
                <Button
                  className="w-full sm:w-auto bg-[#25d366] hover:bg-[#25d366]/90 text-white px-6 py-3 h-auto text-sm sm:text-base"
                  onClick={() => {
                    const message = `Hola, estoy interesado en el perfil "${profile?.title}". ¿Podrían darme más información sobre este análisis?`
                    const whatsappUrl = `https://wa.me/51900649599?text=${encodeURIComponent(message)}`
                    window.open(whatsappUrl, '_blank')
                  }}
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.079.549 4.090 1.595 5.945L0 24l6.256-1.623c1.783.986 3.821 1.514 5.939 1.514 6.624 0 11.99-5.367 11.99-11.988C24.186 5.367 18.641.001 12.017.001zM12.017 21.989c-1.737 0-3.449-.434-4.96-1.263l-.356-.213-3.675.964.983-3.595-.233-.372C2.69 15.963 2.201 14.018 2.201 11.987c0-5.411 4.404-9.815 9.816-9.815 2.618 0 5.082 1.021 6.941 2.88 1.858 1.858 2.88 4.322 2.88 6.941-.001 5.411-4.406 9.816-9.821 9.816zm5.384-7.348c-.295-.148-1.744-.861-2.014-.958-.269-.098-.465-.148-.661.148-.197.295-.762.958-.934 1.155-.172.197-.344.221-.639.074-.295-.148-1.244-.459-2.37-1.462-.875-.781-1.465-1.746-1.637-2.041-.172-.295-.018-.455.129-.602.132-.131.295-.344.443-.516.148-.172.197-.295.295-.492.098-.197.049-.369-.025-.516-.074-.148-.661-1.591-.906-2.18-.238-.574-.479-.496-.661-.504-.172-.008-.369-.01-.565-.01-.197 0-.516.074-.787.369-.271.295-1.034 1.01-1.034 2.463 0 1.453 1.059 2.857 1.207 3.054.148.197 2.080 3.176 5.041 4.456.705.305 1.256.487 1.686.623.708.225 1.353.193 1.863.117.568-.084 1.744-.713 1.989-1.402.246-.689.246-1.279.172-1.402-.074-.123-.271-.197-.566-.345z"/>
                  </svg>
                  <span className="hidden sm:inline">Consultar por WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </Button>
              </div>

              {profile.tests && profile.tests.length > 0 && (
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <h2 className="text-blue-600 font-medium mb-4 sm:mb-6 text-sm sm:text-base">CONOCE UN POCO MÁS</h2>
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">¿Qué incluye este perfil?</h3>
                      <ul className="space-y-2">
                        {profile.tests.map((test, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {profile.conditions && profile.conditions.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">CONDICIONES PREANALÍTICAS</h3>
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm sm:text-base">Recomendaciones previas a la toma de muestra</h4>
                          <ul className="space-y-2">
                            {profile.conditions.map((condition, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                                <span>{condition}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

