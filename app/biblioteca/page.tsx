"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { analysisData } from "@/components/digital-library"
import { motion } from "framer-motion"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { Analysis } from "@/components/digital-library"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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

export default function BibliotecaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [allArticles, setAllArticles] = useState<Analysis[]>([]) // Iniciar vacío
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newArticle, setNewArticle] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    imagen_url: "",
    categoria: "Análisis clínicos",
    tiempo_entrega: "5 min"
  })

  // Cargar artículos desde Supabase al iniciar
  const fetchArticles = async () => {
    console.log("📚 Página biblioteca - Cargando artículos desde Supabase...");
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("biblioteca_digital")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });
      
    if (error) {
      console.error("❌ Error al cargar artículos desde Supabase:", error);
      // Mantener datos locales como fallback
      setLoading(false);
      return;
    }
    
    if (data && Array.isArray(data) && data.length > 0) {
      console.log("✅ Página biblioteca - Artículos cargados desde Supabase:", data.length);
      // Mapear datos de Supabase al formato esperado
      const mappedArticles: Analysis[] = data.map((item: any) => {
        // Priorizar imagen de la base de datos, con fallback a imágenes originales
        let imageToUse = '/placeholder.svg';
        
        // Primero usar imagen_url si existe
        if (item.imagen_url && item.imagen_url.trim() !== '') {
          imageToUse = item.imagen_url;
        } else {
          // Solo si no hay imagen_url, usar las imágenes originales por título
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
        console.log("📝 Página biblioteca - Generando slug:", { titulo: item.titulo, slug: generatedSlug });
        
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
          readTime: String(item.tiempo_entrega || '5 min')
        };
      });
      setAllArticles(mappedArticles);
      console.log("🎨 Página biblioteca - Artículos que se van a renderizar:", mappedArticles.map(a => ({ title: a.title, slug: a.slug })));
    } else {
      console.log("⚠️ No hay artículos en Supabase, usando datos locales");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  // Obtener categorías únicas
  const categories = ["all", ...new Set(allArticles.map((article) => article.category))]

  // Filtrar artículos
  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Función para agregar nuevo artículo
  const handleAddArticle = async () => {
    if (!newArticle.titulo.trim() || !newArticle.descripcion.trim() || !newArticle.contenido.trim()) {
      alert("Por favor completa los campos obligatorios (título, descripción y contenido)")
      return
    }

    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("biblioteca_digital")
        .insert({
          titulo: newArticle.titulo.trim(),
          descripcion: newArticle.descripcion.trim(),
          contenido: newArticle.contenido.trim(),
          imagen_url: newArticle.imagen_url.trim() || '/placeholder.svg',
          categoria: newArticle.categoria,
          tiempo_entrega: newArticle.tiempo_entrega.trim() || '5 min',
          activo: true,
          orden: allArticles.length + 1
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Error al agregar artículo:", error)
        const errorMessage = error?.message || error?.details || JSON.stringify(error) || "Error desconocido"
        alert("Error al agregar artículo: " + errorMessage)
        return
      }

      console.log("✅ Artículo agregado correctamente:", data)
      
      // Recargar artículos
      fetchArticles()
      
      // Limpiar formulario y cerrar modal
      setNewArticle({ titulo: "", descripcion: "", contenido: "", imagen_url: "", categoria: "Análisis clínicos", tiempo_entrega: "5 min" })
      setShowAddModal(false)
      
      alert("✅ Artículo agregado correctamente")
    } catch (err) {
      console.error("❌ Error inesperado:", err)
      alert("Error inesperado: " + String(err))
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="container px-4 py-12 md:py-24">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl text-gray-900">
            Biblioteca Digital
          </h1>
          {/* Botón de agregar artículo solo para admin */}
          {user?.user_type === "admin" && (
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("🔵 Botón Agregar Artículo clickeado")
                setShowAddModal(true)
              }}
              className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Artículo
            </Button>
          )}
        </div>
        <p className="text-xl text-gray-500">
          Explora nuestra colección de artículos sobre salud, bienestar y avances médicos
        </p>
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar artículos"
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px] h-12">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories
                .filter((cat) => cat !== "all")
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {loading ? (
          // Estado de loading
          [...Array(6)].map((_, i) => (
            <motion.div key={i} variants={item}>
              <Card className="h-full">
                <div className="relative h-48 bg-gray-200 animate-pulse"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <motion.div key={article.id} variants={item}>
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {article.category}
                  </div>
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <time className="text-sm text-gray-500">
                      {article.date ? new Date(article.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "Fecha no disponible"}
                    </time>
                    <Button asChild variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Link href={`/biblioteca/${article.slug}`}>Leer más</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron artículos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </motion.div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar nuevo artículo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titulo" className="text-right">
                Título *
              </Label>
              <Input
                id="titulo"
                value={newArticle.titulo}
                onChange={(e) => setNewArticle({ ...newArticle, titulo: e.target.value })}
                className="col-span-3"
                placeholder="Ej: Los beneficios del análisis preventivo"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción *
              </Label>
              <Textarea
                id="descripcion"
                value={newArticle.descripcion}
                onChange={(e) => setNewArticle({ ...newArticle, descripcion: e.target.value })}
                className="col-span-3"
                placeholder="Breve descripción del artículo"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="contenido" className="text-right pt-2">
                Contenido *
              </Label>
              <Textarea
                id="contenido"
                value={newArticle.contenido}
                onChange={(e) => setNewArticle({ ...newArticle, contenido: e.target.value })}
                className="col-span-3"
                placeholder="Contenido completo del artículo..."
                rows={8}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagen_url" className="text-right">
                URL Imagen
              </Label>
              <Input
                id="imagen_url"
                value={newArticle.imagen_url}
                onChange={(e) => setNewArticle({ ...newArticle, imagen_url: e.target.value })}
                className="col-span-3"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <select
                id="categoria"
                value={newArticle.categoria}
                onChange={(e) => setNewArticle({ ...newArticle, categoria: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Análisis clínicos">Análisis clínicos</option>
                <option value="Salud Preventiva">Salud Preventiva</option>
                <option value="Nutrición">Nutrición</option>
                <option value="Genética">Genética</option>
                <option value="Endocrinología">Endocrinología</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tiempo_entrega" className="text-right">
                Tiempo de entrega
              </Label>
              <Input
                id="tiempo_entrega"
                value={newArticle.tiempo_entrega}
                onChange={(e) => setNewArticle({ ...newArticle, tiempo_entrega: e.target.value })}
                className="col-span-3"
                placeholder="Ej: 24 horas, 3-5 días hábiles, 1 semana"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("🔵 Botón Agregar Artículo en modal clickeado")
                handleAddArticle()
              }} 
              className="bg-[#3da64a] hover:bg-[#3da64a]/90 text-white"
            >
              Agregar Artículo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

