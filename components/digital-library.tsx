"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Microscope, TestTube, Beaker, Baby, Dna, Search, Pencil, Trash2, Edit, Settings } from "lucide-react"
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
  reference_price?: number // Precio para médicos/empresas
  target_audience?: 'publico' | 'medicos_empresas' // Audiencia objetivo
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
  const { user } = useAuth()
  const [articles, setArticles] = useState<Analysis[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [sectionTitle, setSectionTitle] = useState("Promociones Disponibles")
  const [editingTitle, setEditingTitle] = useState(false)
  const [showPrices, setShowPrices] = useState(false) // Estado para mostrar/ocultar precios
  const [editingArticle, setEditingArticle] = useState<Analysis | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Función para cargar artículos desde Supabase
  const fetchArticles = async () => {
    console.log("🔄 Cargando artículos desde Supabase...");
    setArticlesLoading(true);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("biblioteca_digital")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });
      
    if (error) {
      console.error("❌ Error al cargar artículos desde Supabase:", error);
      setArticlesLoading(false);
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
          image: imageToUse,
          category: String(item.categoria || "Análisis clínicos"),
          slug: generatedSlug,
          content: String(item.contenido || item.descripcion || ''),
          heroIcons: [],
          sections: [],
          date: item.created_at || new Date().toISOString(),
          author: 'Dr. López',
          readTime: '5 min',
          price: item.precio ? Number(item.precio) : undefined,
          reference_price: item.precio_referencia ? Number(item.precio_referencia) : undefined,
          target_audience: item.audiencia_objetivo || 'publico'
        };
      });
      setArticles(mappedArticles);
      console.log("🎨 DigitalLibrary - Artículos que se van a renderizar:", mappedArticles.map(a => ({ title: a.title, slug: a.slug })));
    } else {
      console.log("⚠️ No hay artículos en Supabase, usando datos locales");
    }
    setArticlesLoading(false);
  }

  // Cargar artículos desde Supabase al iniciar
  useEffect(() => {
    fetchArticles();
    fetchSectionConfig();
  }, []);

  const fetchSectionConfig = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("configuracion_secciones")
        .select("titulo, mostrar_precios")
        .eq("seccion", "biblioteca_digital")
        .single()

      if (error) {
        console.log("⚠️ Error al obtener configuración de sección, usando valores por defecto:", error)
        setSectionTitle("Promociones Disponibles");
        setShowPrices(false);
        return
      }

      if (data) {
        setSectionTitle(String(data.titulo || "Promociones Disponibles"));
        setShowPrices(Boolean(data.mostrar_precios));
      }
    } catch (err) {
      console.error("❌ Error al obtener configuración:", err)
      setSectionTitle("Promociones Disponibles");
      setShowPrices(false);
    }
  }

  // Guardar título de la sección en Supabase
  const saveSectionTitle = async (newTitle: string) => {
    if (!newTitle.trim()) {
      alert("El título no puede estar vacío");
      return;
    }

    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from("configuracion_secciones")
        .upsert({
          seccion: "biblioteca_digital",
          titulo: newTitle.trim()
        }, {
          onConflict: "seccion"
        })
        .select();

      if (error) {
        console.error("❌ Error en upsert biblioteca digital:", error);
        alert(`Error al guardar: ${error.message}`);
        handleTitleCancel();
        return;
      }

      console.log("✅ Título biblioteca digital guardado exitosamente:", data);
      setSectionTitle(newTitle.trim());
      setEditingTitle(false);
      alert("✅ Título guardado correctamente");
      
    } catch (err) {
      console.error("❌ Error inesperado:", err);
      alert(`Error inesperado: ${String(err)}`);
      handleTitleCancel();
    }
  };

  const handleTitleEdit = () => {
    if (editingTitle) {
      saveSectionTitle(sectionTitle);
    } else {
      setEditingTitle(true);
    }
  };

  const handleTitleCancel = () => {
    setEditingTitle(false);
    fetchSectionConfig();
  };

  const handleEditArticle = (article: Analysis) => {
    setEditingArticle(article)
    setIsEditModalOpen(true)
  }

  const handleUpdateArticle = async (updatedArticle: Analysis) => {
    console.log("📝 Actualizando artículo:", updatedArticle);
    
    if (!updatedArticle.title?.trim()) {
      alert("El título es requerido");
      return;
    }

    if (!updatedArticle.description?.trim()) {
      alert("La descripción es requerida");
      return;
    }

    if (!updatedArticle.content?.trim()) {
      alert("El contenido es requerido");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // Preparar el precio público: convertir a número o null
      let precioValue = null;
      if (updatedArticle.price !== undefined && updatedArticle.price !== null) {
        const priceNumber = Number(updatedArticle.price);
        if (!isNaN(priceNumber) && priceNumber > 0) {
          precioValue = priceNumber;
        }
      }

      // Preparar el precio de referencia: convertir a número o null
      let referencePriceValue = null;
      if (updatedArticle.reference_price !== undefined && updatedArticle.reference_price !== null) {
        const referencePriceNumber = Number(updatedArticle.reference_price);
        if (!isNaN(referencePriceNumber) && referencePriceNumber > 0) {
          referencePriceValue = referencePriceNumber;
        }
      }

      console.log("💰 Precios a actualizar:", { precio: precioValue, referencia: referencePriceValue, audiencia: updatedArticle.target_audience });
      
      const updateData = {
        titulo: updatedArticle.title.trim(),
        descripcion: updatedArticle.description.trim(),
        contenido: updatedArticle.content.trim(),
        imagen_url: updatedArticle.image?.trim() || '/placeholder.svg',
        categoria: updatedArticle.category || 'Análisis clínicos',
        precio: precioValue,
        precio_referencia: referencePriceValue,
        audiencia_objetivo: updatedArticle.target_audience || 'publico',
        updated_at: new Date().toISOString()
      };

      console.log("📊 Datos a actualizar:", updateData);

      const { data, error } = await supabase
        .from("biblioteca_digital")
        .update(updateData)
        .eq("id", updatedArticle.id)
        .select()
        .single();
        
      if (error) {
        console.error("❌ Error al actualizar artículo:", error);
        alert("Error al actualizar artículo: " + (error.message || JSON.stringify(error)));
        return;
      }
      
      console.log("✅ Artículo actualizado en Supabase:", data);
      
      // Recargar artículos desde la base de datos para asegurar sincronización
      await fetchArticles();
      
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

  const toggleShowPrices = async () => {
    try {
      const supabase = getSupabaseClient()
      const newShowPrices = !showPrices
      
      const { error } = await supabase
        .from("configuracion_secciones")
        .update({ 
          mostrar_precios: newShowPrices,
          updated_at: new Date().toISOString()
        })
        .eq("seccion", "biblioteca_digital")

      if (error) {
        console.error("❌ Error al actualizar configuración de precios:", error)
        alert("Error al actualizar configuración")
        return
      }

      setShowPrices(newShowPrices)
      console.log(`✅ Configuración actualizada: mostrar precios = ${newShowPrices}`)
    } catch (err) {
      console.error("❌ Error inesperado:", err)
      alert("Error inesperado al actualizar configuración")
    }
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none text-center"
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
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900">
                    {sectionTitle}
                  </h2>
                  
                  {/* Botón de editar título solo para admin */}
                  {user?.user_type === "admin" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleTitleEdit()
                      }}
                      className="ml-2 h-8 w-8 p-0 border-blue-500 text-blue-600 hover:bg-blue-100"
                      title="Editar título"
                    >
                      ✏️
                    </Button>
                  )}
                </>
              )}
            </div>
            
            {/* Controles de admin */}
            {user?.user_type === "admin" && (
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  onClick={toggleShowPrices}
                  variant="outline"
                  size="sm"
                  className={`
                    border transition-all duration-200
                    ${showPrices 
                      ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }
                  `}
                  title={showPrices ? "Ocultar precios" : "Mostrar precios"}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {showPrices ? "Ocultar Precios" : "Mostrar Precios"}
                </Button>
                
                <Link href="/biblioteca" passHref>
                  <Button className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white px-4 py-2 text-sm font-semibold shadow-lg transition-transform hover:scale-105">
                    VER MAS
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Solo mostrar VER MAS para usuarios no admin */}
            {(!user || user.user_type !== "admin") && (
              <Link href="/biblioteca" passHref>
                <Button className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-transform hover:scale-105">
                  VER MAS
                </Button>
              </Link>
            )}
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
                      {/* Mostrar precio solo si está habilitado y existe el precio */}
                      {showPrices && article.price && (
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          S/ {article.price}
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-medium line-clamp-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{article.description}</p>
                      <div className="mt-4">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/biblioteca/${article.slug}`}>
                            Ver promoción
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
          <form onSubmit={async (e) => {
            e.preventDefault();
            console.log("🚀 Formulario enviado");
            
            if (!editingArticle) {
              console.log("❌ No hay artículo en edición");
              return;
            }
            
            const formData = new FormData(e.currentTarget);
            
            // Obtener todos los valores del formulario
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const content = formData.get('content') as string;
            const image = formData.get('image') as string;
            const category = formData.get('category') as string;
            const priceInput = formData.get('price') as string;
            const referencePriceInput = formData.get('reference_price') as string;
            const targetAudience = formData.get('target_audience') as 'publico' | 'medicos_empresas';
            
            console.log("📝 Datos del formulario:", {
              title,
              description,
              content,
              image,
              category,
              priceInput,
              referencePriceInput,
              targetAudience
            });
            
            // Procesar el precio público
            let price: number | undefined = undefined;
            if (priceInput && priceInput.trim() !== '') {
              const priceNumber = parseFloat(priceInput.trim());
              if (!isNaN(priceNumber) && priceNumber > 0) {
                price = priceNumber;
              }
            }

            // Procesar el precio de referencia (empresarial)
            let referencePrice: number | undefined = undefined;
            if (referencePriceInput && referencePriceInput.trim() !== '') {
              const referencePriceNumber = parseFloat(referencePriceInput.trim());
              if (!isNaN(referencePriceNumber) && referencePriceNumber > 0) {
                referencePrice = referencePriceNumber;
              }
            }
            
            console.log("💰 Precios procesados:", { price, referencePrice, targetAudience });
            
            const updatedArticle: Analysis = {
              ...editingArticle,
              title: title || editingArticle.title,
              description: description || editingArticle.description,
              content: content || editingArticle.content,
              image: image || editingArticle.image,
              category: category || editingArticle.category,
              price: price,
              reference_price: referencePrice,
              target_audience: targetAudience || 'publico'
            };
            
            console.log("🔄 Artículo actualizado a enviar:", updatedArticle);
            
            await handleUpdateArticle(updatedArticle);
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
              {/* Audiencia objetivo */}
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="target_audience">Audiencia objetivo *</Label>
                <select
                  id="target_audience"
                  name="target_audience"
                  defaultValue={editingArticle?.target_audience || 'publico'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DA64A]"
                >
                  <option value="publico">👥 Público general</option>
                  <option value="medicos_empresas">🏥 Médicos y Empresas</option>
                </select>
              </div>

              {/* Precio público */}
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="price">💰 Precio Público (S/) - Para pacientes</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingArticle?.price?.toString() || ''}
                  className="w-full border-green-300 focus:border-green-500"
                  placeholder="Ej: 200.00"
                />
              </div>

              {/* Precio empresarial */}
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="reference_price">🏢 Precio Empresarial (S/) - Para médicos/empresas (opcional)</Label>
                <Input
                  id="reference_price"
                  name="reference_price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingArticle?.reference_price?.toString() || ''}
                  className="w-full border-blue-300 focus:border-blue-500"
                  placeholder="Ej: 150.00"
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
              <Button 
                type="submit" 
                className="bg-[#3DA64A] hover:bg-[#3DA64A]/90 text-white" 
                disabled={loading}
                onClick={() => console.log("🔴 CLICK en botón de guardar - loading:", loading)}
              >
                {loading ? 'Actualizando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}

