"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Microscope, TestTube, Beaker, Baby, Dna, Search, Pencil, Trash2, Edit } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
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

export interface Analysis {
  id: number
  title: string
  description: string
  image: string
  category: string
  slug: string
  content: string
  heroIcons?: string[]
  sections: Array<{
    title: string
    content: React.ReactNode
  }>
  date?: string
  author?: string
  readTime?: string
  price?: number
}

// Solo mantener datos mínimos como ejemplo - la mayoría vendrá de Supabase
export const analysisData: Analysis[] = []

// Definir el tipo para los artículos
type Article = {
  id: number
  title: string
  description: string
  content: string
  image: string
  category: string
  date: string
  slug: string
  author?: string
  readTime?: string
}

// Datos de los artículos
export const articles: Article[] = [
  {
    id: 1,
    title: "La importancia del diagnóstico temprano",
    description: "Descubre por qué la detección temprana es clave para tu salud y cómo los análisis preventivos pueden salvar vidas.",
    content: `El diagnóstico temprano es fundamental para prevenir y tratar enfermedades de manera efectiva. Los análisis preventivos nos permiten:

1. Detectar enfermedades en etapas iniciales
2. Prevenir complicaciones futuras
3. Mejorar las probabilidades de éxito en el tratamiento
4. Reducir costos a largo plazo
5. Mantener una mejor calidad de vida

En ROE, contamos con una amplia gama de perfiles y análisis diseñados específicamente para la detección temprana de diversas condiciones de salud.`,
    image: "/articles/diagnostico-temprano.jpg",
    category: "Salud Preventiva",
    date: "2024-03-15",
    slug: "importancia-diagnostico-temprano",
    author: "Dr. Juan Pérez",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Nutrición y análisis clínicos",
    description: "Cómo los análisis pueden mejorar tu plan nutricional y optimizar tu salud a través de una alimentación personalizada.",
    content: `Los análisis clínicos son una herramienta valiosa para optimizar tu nutrición. Al conocer tus niveles de vitaminas, minerales y otros nutrientes, podemos:

1. Identificar deficiencias nutricionales
2. Personalizar tu plan alimenticio
3. Prevenir enfermedades relacionadas con la nutrición
4. Mejorar tu rendimiento físico y mental
5. Optimizar tu metabolismo

Nuestros perfiles nutricionales te ayudarán a entender mejor tus necesidades específicas y a tomar decisiones informadas sobre tu alimentación.`,
    image: "/articles/nutricion-analisis.jpg",
    category: "Nutrición",
    date: "2024-03-14",
    slug: "nutricion-analisis-clinicos",
    author: "Dra. María García",
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Avances en pruebas genéticas",
    description: "Las últimas innovaciones en diagnóstico genético y cómo están revolucionando la medicina preventiva.",
    content: `El campo de las pruebas genéticas está evolucionando rápidamente, ofreciendo nuevas posibilidades para la medicina preventiva:

1. Detección temprana de predisposiciones genéticas
2. Personalización de tratamientos
3. Evaluación de riesgos familiares
4. Planificación familiar informada
5. Desarrollo de terapias específicas

En ROE, nos mantenemos a la vanguardia de estas innovaciones, ofreciendo las pruebas genéticas más avanzadas y precisas del mercado.`,
    image: "/articles/pruebas-geneticas.jpg",
    category: "Genética",
    date: "2024-03-13",
    slug: "avances-pruebas-geneticas",
    author: "Dr. Carlos Rodríguez",
    readTime: "10 min"
  },
  {
    id: 4,
    title: "Salud hormonal y bienestar",
    description: "Entiende la importancia del equilibrio hormonal y cómo los análisis pueden ayudarte a mantenerlo.",
    content: `El equilibrio hormonal es crucial para tu salud y bienestar general. Los análisis hormonales nos permiten:

1. Evaluar la función tiroidea
2. Monitorear niveles de hormonas sexuales
3. Detectar desbalances hormonales
4. Optimizar tratamientos hormonales
5. Prevenir complicaciones relacionadas

Nuestros perfiles hormonales están diseñados para proporcionar una evaluación completa de tu salud endocrina.`,
    image: "/articles/salud-hormonal.jpg",
    category: "Endocrinología",
    date: "2024-03-12",
    slug: "salud-hormonal-bienestar",
    author: "Dra. Ana Martínez",
    readTime: "8 min"
  }
]

export default function DigitalLibrary() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { user } = useAuth()
  const [articles, setArticles] = useState<Analysis[]>([]) // Iniciar vacío, solo datos de Supabase
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)

  // Cargar artículos desde Supabase al iniciar
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
        return;
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Artículos cargados desde Supabase:", data.length);
        // Mapear datos de Supabase al formato esperado
        const mappedArticles: Analysis[] = data.map((item: any) => {
          // Usar la imagen de la base de datos, con fallback a imágenes originales solo si no hay imagen_url
          let imageToUse = item.imagen_url && item.imagen_url.trim() !== '' ? item.imagen_url : '/placeholder.svg';
          
          // Solo usar imágenes originales si NO hay imagen en la base de datos
          if (!item.imagen_url || item.imagen_url.trim() === '') {
            const titulo = String(item.titulo || '').toLowerCase();
          if (titulo.includes('zuma')) {
              imageToUse = '/emba.webp';
          } else if (titulo.includes('cofactor') || titulo.includes('willebrand')) {
              imageToUse = '/hemo.jpeg';
          } else if (titulo.includes('antifosfolípidos') || titulo.includes('antifosfolipidos')) {
              imageToUse = '/anti.jpeg';
            }
          }
          
          const generatedSlug = normalizeSlug(String(item.titulo || ''));
          console.log("📝 Generando slug:", { titulo: item.titulo, slug: generatedSlug });
          
          return {
            id: Number(item.id) || 0,
            title: String(item.titulo || ''),
            description: String(item.descripcion || ''),
            image: imageToUse, // USAR LA IMAGEN DE LA BASE DE DATOS
            category: String(item.categoria || "Análisis clínicos"),
            slug: generatedSlug,
            content: String(item.contenido || item.descripcion || ''), // USAR EL CONTENIDO DE LA BASE DE DATOS
            heroIcons: [],
            sections: [],
            date: item.created_at || new Date().toISOString(),
            author: 'Dr. López',
            readTime: '5 min',
            price: item.precio ? Number(item.precio) : undefined
          };
        });
        setArticles(mappedArticles);
        console.log("🎨 DigitalLibrary - Artículos que se van a renderizar:", mappedArticles.map(a => ({ title: a.title, slug: a.slug })));
      } else {
        console.log("⚠️ No hay artículos en Supabase, usando datos locales");
      }
    }
    fetchArticles();
  }, []);

  const handleEditArticle = (article: Analysis) => {
    setEditingArticle(article)
    setIsEditModalOpen(true)
  }

  const handleUpdateArticle = async (updatedArticle: Analysis) => {
    console.log("📝 Actualizando artículo:", updatedArticle);
    
    if (!updatedArticle.title.trim()) {
      alert("El título es requerido");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("biblioteca_digital")
        .update({
          titulo: updatedArticle.title.trim(),
          descripcion: updatedArticle.description.trim(),
          contenido: updatedArticle.content.trim(),
          imagen_url: updatedArticle.image.trim() || '/placeholder.svg',
          categoria: updatedArticle.category,
          precio: updatedArticle.price
        })
        .eq("id", updatedArticle.id)
        .select()
        .single();
        
      if (error) {
        console.error("❌ Error al actualizar artículo:", error);
        alert("Error al actualizar artículo: " + error.message);
        return;
      }
      
      console.log("✅ Artículo actualizado en Supabase:", data);
      
      // Actualizar estado local inmediatamente
      setArticles(prevArticles =>
        prevArticles.map(article =>
          article.id === updatedArticle.id ? {
            ...updatedArticle,
            title: String(updatedArticle.title || article.title),
            description: String(updatedArticle.description || article.description),
            content: String(updatedArticle.content || article.content),
            image: String(updatedArticle.image || article.image),
            category: String(updatedArticle.category || article.category),
            readTime: String(updatedArticle.readTime || article.readTime),
            date: updatedArticle.date || article.date,
            author: updatedArticle.author || article.author,
            slug: article.slug,
            heroIcons: article.heroIcons,
            sections: article.sections,
            price: updatedArticle.price || article.price
          } : article
        )
      );
      
      setIsEditModalOpen(false);
      setEditingArticle(null);
      alert("✅ Artículo actualizado correctamente");
      
    } catch (err) {
      console.error("❌ Error inesperado:", err);
      alert("Error inesperado: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-full flex flex-col items-center md:flex-row md:justify-center md:items-center">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2 text-center md:text-left md:mr-8 md:mb-0">Biblioteca Digital</h2>
            <div className="mt-4 md:mt-0 md:relative">
              <Link href="/biblioteca" passHref>
                <Button className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-transform hover:scale-105">
                  VER MAS
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-gray-500 text-base sm:text-lg text-center mt-4">Servicios diseñados para mejorar tu calidad de vida</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {articles.slice(currentIndex * 3, (currentIndex + 1) * 3).map((article) => (
                  <Card key={article.id} className="group relative overflow-hidden border shadow-lg transition-all duration-300 hover:shadow-2xl">
                    {/* Botón de editar solo para admin */}
                    {user?.user_type === "admin" && (
                      <div className="absolute top-2 right-2 z-10">
                        <Button
                          onClick={() => handleEditArticle(article)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                          size="icon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="relative h-64 bg-gray-200">
                      <Image
                        src={article.image || '/placeholder.svg'}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-medium line-clamp-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{article.description}</p>
                      <div className="mt-4">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/biblioteca/${article.slug}`}>
                            Leer más
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          {articles.length > 3 && (
            <div className="flex justify-center mt-6 gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.min(Math.floor(articles.length / 3), currentIndex + 1))}
                disabled={currentIndex >= Math.floor(articles.length / 3)}
                className="flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar artículo</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            if (!editingArticle) return;
            
            const updatedArticle: Analysis = {
              ...editingArticle,
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              content: formData.get('content') as string,
              image: formData.get('image') as string || editingArticle.image,
              category: formData.get('category') as string,
              price: formData.get('price') ? Number(formData.get('price')) : undefined
            };
            
            handleUpdateArticle(updatedArticle);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingArticle?.title || ''}
                  className="w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-1 items-start gap-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingArticle?.description || ''}
                  className="w-full min-h-[80px]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 items-start gap-2">
                <Label htmlFor="content">Contenido completo *</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingArticle?.content || ''}
                  className="w-full min-h-[120px]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={editingArticle?.category || 'Análisis clínicos'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DA64A]"
                >
                  <option value="Análisis clínicos">Análisis clínicos</option>
                  <option value="Medicina preventiva">Medicina preventiva</option>
                  <option value="Laboratorio">Laboratorio</option>
                  <option value="Endocrinología">Endocrinología</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Nutrición">Nutrición</option>
                </select>
              </div>
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  defaultValue={editingArticle?.price?.toString() || ''}
                  className="w-full"
                  placeholder="Ej: 100.00"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="image">URL de la imagen</Label>
                <Input
                  id="image"
                  name="image"
                  defaultValue={editingArticle?.image || ''}
                  className="w-full"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#3DA64A] hover:bg-[#3DA64A]/90 text-white" disabled={loading}>
                {loading ? 'Actualizando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}

