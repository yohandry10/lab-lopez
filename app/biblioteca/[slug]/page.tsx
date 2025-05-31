"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { analysisData } from "@/components/digital-library"
import { motion } from "framer-motion"
import type { Analysis } from "@/components/digital-library"
import { getSupabaseClient } from "@/lib/supabase-client"

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
  const [isLoading, setIsLoading] = useState(true)
  const [article, setArticle] = useState<Analysis | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Analysis[]>([])
  const [allArticles, setAllArticles] = useState<Analysis[]>([]) // Iniciar vacío

  useEffect(() => {
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
        // Mantener datos locales como fallback
        return [];
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Artículos cargados desde Supabase:", data.length);
        // Mapear datos de Supabase al formato esperado
        const mappedArticles: Analysis[] = data.map((item: any) => {
          // Usar las imágenes originales del proyecto
          let originalImage = '/placeholder.svg';
          const titulo = String(item.titulo || '').toLowerCase();
          
          if (titulo.includes('zuma')) {
            originalImage = '/emba.webp';
          } else if (titulo.includes('cofactor') || titulo.includes('willebrand')) {
            originalImage = '/hemo.jpeg';
          } else if (titulo.includes('antifosfolípidos') || titulo.includes('antifosfolipidos')) {
            originalImage = '/anti.jpeg';
          } else if (item.imagen_url && item.imagen_url.trim() !== '') {
            originalImage = item.imagen_url;
          }
          
          const generatedSlug = normalizeSlug(String(item.titulo || ''));
          console.log("📝 Página individual - Generando slug:", { titulo: item.titulo, slug: generatedSlug });
          
          return {
            id: Number(item.id) || 0,
            title: String(item.titulo || ''),
            description: String(item.descripcion || ''),
            image: originalImage, // Usar imagen original del proyecto
            category: String(item.categoria || "Análisis clínicos"),
            slug: generatedSlug,
            content: String(item.contenido || item.descripcion || ''),
            heroIcons: [],
            sections: [],
            date: item.created_at || new Date().toISOString(),
            author: 'Dr. López',
            readTime: '5 min'
          };
        });
        return mappedArticles;
      } else {
        console.log("⚠️ No hay artículos en Supabase, usando datos locales");
        return [];
      }
    }

    async function loadArticleData() {
      const articles = await fetchArticles();
      setAllArticles(articles);
      
      const slug = params?.slug as string
      console.log("🔍 Slug buscado:", slug);
      console.log("🔍 Slug normalizado:", normalizeSlug(decodeURIComponent(slug)));
      console.log("📚 Artículos disponibles:", articles.map(a => ({ id: a.id, title: a.title, slug: a.slug })));
      
      // Normalizar el slug de búsqueda para comparar
      const normalizedSearchSlug = normalizeSlug(decodeURIComponent(slug));
      const foundArticle = articles.find((a) => a.slug === normalizedSearchSlug)
      console.log("🎯 Artículo encontrado:", foundArticle ? foundArticle.title : "No encontrado");

      if (!foundArticle) {
        console.log("❌ Artículo no encontrado, redirigiendo a biblioteca");
        router.push('/biblioteca')
        return
      }

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
    <div className="container px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-6">
            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">{article.title}</h1>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-600 mb-6">{article.description}</p>

            {article.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {article.sections?.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="prose prose-lg">{section.content}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Artículos relacionados</h2>
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
                          <Link href={`/biblioteca/${relatedArticle.slug}`}>Leer más</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

