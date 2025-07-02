"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, User, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { analysisData } from "@/components/digital-library"
import { motion } from "framer-motion"
import type { Analysis } from "@/components/digital-library"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useAuth } from "@/contexts/auth-context"

// Función para normalizar slugs (remover acentos y caracteres especiales)
function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remueve acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remueve caracteres especiales excepto espacios y guiones
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-') // Reemplaza múltiples guiones con uno solo
    .trim(); // Remueve espacios al inicio y final
}

interface CartItem {
  id: number
  name: string
  price: number
  category: string
}

export default function ArticlePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [article, setArticle] = useState<Analysis | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Analysis[]>([])
  const [allArticles, setAllArticles] = useState<Analysis[]>([]) // Iniciar vacío

  useEffect(() => {
    if (!params.slug) return

    async function fetchArticles() {
      console.log("🔄 Cargando artículos desde Supabase...");
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("biblioteca_digital")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true });
        
      if (error) {
        console.error("❌ Error al cargar artículos desde Supabase:", error);
        return [];
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Artículos cargados desde Supabase:", data.length);
        // Mapear datos de Supabase al formato esperado
        const mappedArticles: Analysis[] = data.map((item: any) => {
          const imageToUse = item.imagen_url && item.imagen_url.trim() !== '' ? item.imagen_url : '/placeholder.svg';
          
          const generatedSlug = normalizeSlug(String(item.titulo || ''));
          
          return {
            id: Number(item.id),
            title: String(item.titulo || ''),
            description: String(item.descripcion || ''),
            content: String(item.contenido || ''),
            image: imageToUse,
            category: String(item.categoria || 'General'),
            slug: generatedSlug,
            date: item.created_at,
            price: item.precio ? Number(item.precio) : undefined,
            sections: []
          } as Analysis;
        });
        
        return mappedArticles;
      }
      
      return [];
    }

    async function loadArticleData() {
      const articles = await fetchArticles();
      
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
      console.log("🔍 Buscando artículo con slug:", slug)
      
      const foundArticle = articles.find((a) => a.slug === slug)

      if (!foundArticle) {
        console.log("❌ Artículo no encontrado")
        router.push("/promociones")
        return
      }

      console.log("✅ Artículo encontrado:", foundArticle)

      setArticle(foundArticle)

      // Find related articles (same category, excluding current)
      const related = articles
        .filter((a) => a.category === foundArticle.category && a.id !== foundArticle.id)
        .slice(0, 2)
      setRelatedArticles(related)

      setIsLoading(false)
    }

    loadArticleData();
  }, [params, router])

  const handleWhatsAppContact = () => {
    const message = `Hola, estoy interesado en el ${article?.title}. ¿Podrían darme más información sobre este análisis?`
    const whatsappUrl = `https://wa.me/51900649599?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="container px-4 pt-24 pb-12 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    )
  }

  if (!article) return null

  return (
    <div className="min-h-screen bg-[#f3f9fe]">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
        <Image 
          src={article.image || "/placeholder.svg"} 
          alt={article.title} 
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
                {article.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                {article.description}
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
                <h2 className="text-blue-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">PROMOCIÓN ESPECIAL</h2>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 leading-tight">{article.description}</h3>
                <div className="text-sm sm:text-base text-gray-600 leading-relaxed space-y-4">
                  {article.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>{paragraph}</p>
                    )
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Categoría</h4>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm sm:text-base">{article.category}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Fecha de publicación</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="text-sm sm:text-base">
                        {article.date ? new Date(article.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : "Fecha no disponible"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* SIEMPRE mostrar precio si existe - sin importar configuración del admin */}
                {article.price && (
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-green-200 bg-green-50">
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base text-green-800">Precio Especial</h4>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-green-600">S/ {article.price}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 sm:mb-8">
                <div className="text-green-600 font-medium text-sm sm:text-base">Disponible</div>
                <Button
                  className="w-full sm:w-auto bg-[#25d366] hover:bg-[#25d366]/90 text-white px-6 py-3 h-auto text-sm sm:text-base"
                  onClick={handleWhatsAppContact}
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.079.549 4.090 1.595 5.945L0 24l6.256-1.623c1.783.986 3.821 1.514 5.939 1.514 6.624 0 11.99-5.367 11.99-11.988C24.186 5.367 18.641.001 12.017.001zM12.017 21.989c-1.737 0-3.449-.434-4.96-1.263l-.356-.213-3.675.964.983-3.595-.233-.372C2.69 15.963 2.201 14.018 2.201 11.987c0-5.411 4.404-9.815 9.816-9.815 2.618 0 5.082 1.021 6.941 2.88 1.858 1.858 2.88 4.322 2.88 6.941-.001 5.411-4.406 9.816-9.821 9.816zm5.384-7.348c-.295-.148-1.744-.861-2.014-.958-.269-.098-.465-.148-.661.148-.197.295-.762.958-.934 1.155-.172.197-.344.221-.639.074-.295-.148-1.244-.459-2.37-1.462-.875-.781-1.465-1.746-1.637-2.041-.172-.295-.018-.455.129-.602.132-.131.295-.344.443-.516.148-.172.197-.295.295-.492.098-.197.049-.369-.025-.516-.074-.148-.661-1.591-.906-2.18-.238-.574-.479-.496-.661-.504-.172-.008-.369-.01-.565-.01-.197 0-.516.074-.787.369-.271.295-1.034 1.01-1.034 2.463 0 1.453 1.059 2.857 1.207 3.054.148.197 2.080 3.176 5.041 4.456.705.305 1.256.487 1.686.623.708.225 1.353.193 1.863.117.568-.084 1.744-.713 1.989-1.402.246-.689.246-1.279.172-1.402-.074-.123-.271-.197-.566-.345z"/>
                  </svg>
                  <span className="hidden sm:inline">Consultar por WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </Button>
              </div>

              {/* Sección de Más promociones */}
              {relatedArticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-8 sm:mt-10 md:mt-12"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Más promociones</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {relatedArticles.map((relatedArticle) => (
                        <Card
                          key={relatedArticle.id}
                          className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row h-full">
                            <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                              <Image
                                src={relatedArticle.image || "/placeholder.svg"}
                                alt={relatedArticle.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4">
                              <div className="mb-2">
                                <span className="text-sm text-blue-600">{relatedArticle.category}</span>
                              </div>
                              <h3 className="text-lg font-bold mb-2">{relatedArticle.title}</h3>
                              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{relatedArticle.description}</p>
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/promociones/${relatedArticle.slug}`}>Ver promoción</Link>
                              </Button>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

