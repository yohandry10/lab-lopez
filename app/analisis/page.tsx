"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, Plus, Pencil, Trash2, AlertTriangle, Settings, Check, Syringe, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnalysisDialog } from "@/components/analysis-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import CategoriasAdminModal from "@/components/categorias-admin-modal"
import { getSupabaseClient } from "@/lib/supabase-client"
import { SchedulingFlow } from "@/components/scheduling-flow"
import { SuccessDialog } from "@/components/success-dialog"
import { HeroSchedulingDialog } from "@/components/hero-scheduling-dialog"
import { TariffsAdminPanel } from "@/components/tariffs-admin-panel"
import { tariffsService } from "@/lib/tariffs-service"
import { useDynamicPricing } from "@/hooks/use-dynamic-pricing"

// Componente para mostrar precios dinámicos en la tabla
function PriceDisplay({ analysisId }: { analysisId: number }) {
  const { getExamPrice, formatPrice, canSeePrice } = useDynamicPricing()
  const [priceInfo, setPriceInfo] = useState<{ price: number; tariff_name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!canSeePrice() || !analysisId) return

    const loadPrice = async () => {
      setIsLoading(true)
      try {
        const price = await getExamPrice(analysisId)
        setPriceInfo(price)
      } catch (error) {
        console.error('Error loading price:', error)
        setPriceInfo(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadPrice()
  }, [analysisId, getExamPrice, canSeePrice])

  if (!canSeePrice()) return null

  if (isLoading) {
    return <div className="text-xs text-gray-500">Cargando...</div>
  }

  if (!priceInfo) {
    return <div className="text-xs text-gray-500">No disponible</div>
  }

  return (
    <div className="text-sm">
      <div className="font-medium text-green-600">
        {formatPrice(priceInfo.price)}
      </div>
      <div className="text-xs text-gray-500">
        {priceInfo.tariff_name}
      </div>
    </div>
  )
}

// Definir el tipo para los análisis
type Analysis = {
  id: number;
  name: string;
  price: number;
  reference_price?: number;
  show_public?: boolean;
  conditions: string;
  sample: string;
  protocol: string;
  suggestions?: string;
  comments?: string;
  category: string;
  deliveryTime?: string;
  sample_quantity?: string;
}

// Definir el tipo para los perfiles
type Profile = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  tests: string[];
}

export default function AnalisisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [localAnalysisData, setLocalAnalysisData] = useState<Analysis[]>([])
  const [categories, setCategories] = useState<string[]>([]) // Add state for categories
  const [availableTariffs, setAvailableTariffs] = useState<any[]>([]) // Estado para tarifas disponibles
  const [availableReferences, setAvailableReferences] = useState<any[]>([]) // Estado para referencias disponibles
  const [userAnalysisIds, setUserAnalysisIds] = useState<Set<string>>(new Set()) // 🆕 IDs de análisis visibles para el usuario
  const { addItem } = useCart()
  const router = useRouter()
  const { user } = useAuth()
  console.log("Usuario logueado:", user)
  console.log("Tipo de usuario:", user?.user_type)
  console.log("¿Es admin?", user && user.user_type === "admin")
  // Estado para perfiles populares - Inicializar VACÍO para cargar desde BD
  const [popularProfiles, setPopularProfiles] = useState<Profile[]>([])


  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<Analysis | null>(null)
  const [patientName, setPatientName] = useState("")

  // State for hero scheduling dialog
  const [isHeroSchedulingOpen, setIsHeroSchedulingOpen] = useState(false)

  // State for tariffs admin panel
  const [isTariffsAdminOpen, setIsTariffsAdminOpen] = useState(false)

  const ITEMS_PER_PAGE = 10

  // Filtrar análisis por letra, término de búsqueda y categoría
  const filteredAnalysis = localAnalysisData.filter((analysis) => {
    const matchesSearch = searchTerm ? analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    const matchesLetter = selectedLetter ? analysis.name.charAt(0).toUpperCase() === selectedLetter : true
    const matchesCategory = selectedCategory ? analysis.category === selectedCategory : true
    
    // 🆕 LÓGICA COMPLETA DE VISIBILIDAD POR REFERENCIAS Y TARIFAS
    const isVisibleToUser = (() => {
      if (!user) {
        // Usuario NO logueado: solo ve análisis marcados como públicos
        return analysis.show_public === true
      }

      // Admin ve todos los análisis
      if (user.user_type === "admin") {
        return true
      }

      // Si es público, siempre se muestra (análisis con precios en tarifas Base y Referencial)
      if (analysis.show_public === true) {
        return true
      }

      // Para usuarios logueados con referencias, verificar si tienen acceso al análisis
      // basándose en las tarifas configuradas para sus referencias
      return userAnalysisIds.has(analysis.id.toString())
    })()

    return matchesSearch && matchesLetter && matchesCategory && isVisibleToUser
  })

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredAnalysis.length / ITEMS_PER_PAGE)

  // Obtener los análisis para la página actual
  const currentAnalyses = filteredAnalysis.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Resetear a la página 1 cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLetter, searchTerm, selectedCategory])

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? null : value)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll al inicio de la tabla
    window.scrollTo({ top: document.getElementById("analysis-table")?.offsetTop || 0, behavior: "smooth" })
  }

  // Generar array de páginas para la paginación
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Mostrar un subconjunto de páginas con la actual en el centro
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      // Ajustar si estamos cerca del final
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      // Añadir primera página y puntos suspensivos si es necesario
      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) pages.push("...")
      }

      // Añadir páginas del rango
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Añadir última página y puntos suspensivos si es necesario
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handleAddToCart = (analysis: Analysis) => {
    setSelectedTest(analysis)
    setIsSchedulingOpen(true)
  }

  const handleScheduleComplete = (data: { firstName: string; lastName: string }, qty: number) => {
    setIsSchedulingOpen(false)

    // Extract patient name from form data
    const fullName = `${data.firstName} ${data.lastName}`
    setPatientName(fullName)

    // Add item to cart
    if (selectedTest) {
      addItem({
        id: selectedTest.id,
        name: selectedTest.name,
        price: selectedTest.price,
        quantity: qty,
        patientDetails: data,
      })
    }

    // Show success dialog
    setIsSuccessOpen(true)
  }

  const handleContinueShopping = () => {
    setIsSuccessOpen(false)
    setSelectedTest(null)
  }

  const handleNewPatient = () => {
    setIsSuccessOpen(false)
    setSelectedTest(null)
    // Could reset the form or open a new scheduling dialog here
  }

  const handleViewCart = () => {
    setIsSuccessOpen(false)
    setSelectedTest(null)
    router.push("/carrito")
  }

  const [editingAnalysis, setEditingAnalysis] = useState<Analysis | null>(null)

  const handleUpdateAnalysis = async (updatedAnalysis: Analysis) => {
    console.log("🔄 INICIANDO ACTUALIZACIÓN COMPLETA");
    console.log("📊 Datos a actualizar:", updatedAnalysis);
    
    try {
      const supabase = getSupabaseClient();
      console.log("🔗 Cliente Supabase obtenido");
      
      // Verificar conexión a Supabase primero
      console.log("🧪 Verificando conexión a Supabase...");
      const { data: testData, error: testError } = await supabase
        .from("analyses")
        .select("count")
        .limit(1);
      
      if (testError) {
        console.error("❌ ERROR DE CONEXIÓN A SUPABASE:", testError);
        alert("❌ Error de conexión a Supabase: " + testError.message);
        return;
      }
      
      console.log("✅ Conexión a Supabase exitosa");
      
      // Verificar que el registro existe
      console.log("🔍 Verificando que el análisis existe...");
      const { data: existingData, error: existingError } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", updatedAnalysis.id)
        .single();
        
      if (existingError || !existingData) {
        console.error("❌ El análisis no existe en Supabase:", existingError);
        alert("❌ Error: El análisis no existe en la base de datos");
        return;
      }
      
      console.log("✅ Análisis encontrado:", existingData);
      
             // Actualizar en Supabase PRIMERO
       console.log("💾 Actualizando en Supabase...");
       const { data, error } = await supabase
         .from("analyses")
         .update({
           name: updatedAnalysis.name,
           price: updatedAnalysis.price,
           reference_price: updatedAnalysis.reference_price,
        show_public: updatedAnalysis.show_public,
           category: updatedAnalysis.category,
           conditions: updatedAnalysis.conditions,
           sample: updatedAnalysis.sample,
           protocol: updatedAnalysis.protocol,
           suggestions: updatedAnalysis.suggestions,
           comments: updatedAnalysis.comments,
           deliverytime: updatedAnalysis.deliveryTime,
         })
         .eq("id", updatedAnalysis.id)
         .select()
         .single();

      if (error) {
        console.error("❌ ERROR AL GUARDAR EN SUPABASE:", error);
        console.error("Detalles del error:", error);
        alert("❌ Error al guardar en Supabase: " + error.message);
        return;
      }
      
      console.log("✅ GUARDADO EXITOSO EN SUPABASE:", data);
      
      // Solo después actualizar el estado local
      setLocalAnalysisData(prevData =>
        prevData.map(item =>
          item.id === updatedAnalysis.id ? updatedAnalysis : item
        )
      )
      console.log("✅ Estado local actualizado");
      
      setEditingAnalysis(null);
      alert("🎉 ¡ANÁLISIS ACTUALIZADO CORRECTAMENTE!");
      
    } catch (err) {
      console.error("❌ ERROR INESPERADO:", err);
      alert("❌ Error inesperado: " + String(err));
    }
  }



  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  const handleDeleteProfile = async (index: number) => {
    const profile = popularProfiles[index];
    console.log("🗑️ Intentando eliminar perfil:", profile.title);
    
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el perfil "${profile.title}"?`)) {
      console.log("❌ Eliminación cancelada por usuario");
      return;
    }
    
    const supabase = getSupabaseClient();
    
    // Eliminar de Supabase
    const { error } = await supabase.from("profiles").delete().eq("id", profile.id);
    if (error) {
      console.error("❌ Error al eliminar perfil:", error);
      alert("Error al eliminar perfil: " + error.message);
      return;
    }
    
    console.log("✅ Perfil eliminado de Supabase");
    
    // Recargar todos los perfiles desde la BD para mantener sincronización
    await fetchProfiles();
    alert("✅ Perfil eliminado correctamente");
  }

  const handleUpdateProfile = async (updatedProfile: Profile) => {
    console.log("📝 Actualizando perfil:", updatedProfile);
    
    // Validar datos antes de enviar
    if (!updatedProfile.title.trim()) {
      alert("El título es requerido");
      return;
    }
    
    if (updatedProfile.price < 0) {
      alert("El precio no puede ser negativo");
      return;
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        title: updatedProfile.title.trim(),
        description: updatedProfile.description.trim(),
        price: Math.max(0, updatedProfile.price), // Asegurar que no sea negativo
        image: updatedProfile.image.trim() || getProfileImage(updatedProfile.title, ''),
        tests: updatedProfile.tests.filter(test => test && test.trim()),
      })
      .eq("id", updatedProfile.id)
      .select()
      .single();
      
    if (error) {
      console.error("❌ Error al guardar perfil:", error);
      alert("Error al guardar perfil en Supabase: " + error.message);
      return;
    }
    
    console.log("✅ Perfil actualizado en Supabase:", data);
    
    // Recargar todos los perfiles desde la BD para mantener sincronización
    await fetchProfiles();
    setEditingProfile(null);
    alert("✅ Perfil actualizado correctamente");
  }

  // Función para cargar análisis desde Supabase
  const fetchAnalyses = async () => {
    console.log("🔄 Cargando análisis desde Supabase...");
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("analyses").select("*");
    if (error) {
      console.error("❌ Error al cargar análisis desde Supabase:", error);
      // Usar datos locales como fallback
      setLocalAnalysisData([]);
      return;
    }
    if (data && Array.isArray(data) && data.length > 0) {
      console.log("✅ Análisis cargados desde Supabase:", data.length);
      // Mapear datos de Supabase al formato esperado
      const mappedData: Analysis[] = data.map((item: any) => {
        return {
          id: parseInt(item.id?.toString() || '0') || 0,
          name: item.name?.toString() || '',
          price: parseFloat(item.price?.toString() || '0') || 0,
          reference_price: item.reference_price ? parseFloat(item.reference_price?.toString() || '0') : undefined,
        show_public: item.show_public || false,
          conditions: item.conditions?.toString() || '',
          sample: item.sample?.toString() || '',
          protocol: item.protocol?.toString() || '',
          suggestions: item.suggestions?.toString() || '',
          comments: item.comments?.toString() || '',
          category: item.category?.toString() || '',
          deliveryTime: item.deliverytime?.toString() || '2-4 horas', // Use deliverytime from DB
          sample_quantity: item.sample_quantity?.toString() || '5 mL', // Add sample_quantity field with fallback
        };
      });
      setLocalAnalysisData(mappedData);
    } else {
      console.log("⚠️ No hay datos en Supabase, usando array vacío");
      setLocalAnalysisData([]);
    }
  }

  // Función para cargar perfiles desde Supabase - SIEMPRE carga desde BD
  const fetchProfiles = async () => {
    console.log("🔄 Cargando perfiles desde Supabase...");
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").order('id');
    
    if (error) {
      console.error("❌ Error al cargar perfiles desde Supabase:", error.message);
      // En caso de error, mostrar array vacío para evitar datos hardcodeados
      setPopularProfiles([]);
      return;
    }
    
    if (data && Array.isArray(data) && data.length > 0) {
      console.log("✅ Perfiles cargados desde Supabase:", data.length);
      try {
        // Mapear y validar datos de Supabase
        const profiles = data.map((profile: any) => ({
          id: Number(profile.id) || Math.random(),
          title: String(profile.title || '').trim() || 'Perfil sin nombre',
          description: String(profile.description || '').trim() || 'Sin descripción',
          price: Math.max(0, Number(profile.price) || 0),
          image: getProfileImage(profile.title || '', profile.image || ''),
          tests: Array.isArray(profile.tests) ? profile.tests.filter((test: string) => test && test.trim()) : []
        })) as Profile[];
        
        setPopularProfiles(profiles);
        console.log("✅ Perfiles procesados correctamente:", profiles.length);
      } catch (e) {
        console.error("❌ Error procesando perfiles:", e);
        setPopularProfiles([]);
      }
    } else {
      console.log("⚠️ No hay perfiles en Supabase, estableciendo array vacío");
      setPopularProfiles([]);
    }
  }

  // Función para cargar tarifas disponibles
  const fetchTariffs = async () => {
    try {
      const response = await tariffsService.getAllTariffs()
      if (response.success && Array.isArray(response.data)) {
        setAvailableTariffs(response.data)
        console.log("✅ Tarifas cargadas:", response.data)
      } else {
        console.error("❌ Error al cargar tarifas:", response.error)
        setAvailableTariffs([])
      }
    } catch (err) {
      console.error("❌ Error inesperado al cargar tarifas:", err)
      setAvailableTariffs([])
    }
  }

  // Función para cargar categorías desde la base de datos
  const fetchCategories = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("categorias_analisis")
        .select("nombre")
        .eq("activo", true)
        .order("orden", { ascending: true })

      if (error) {
        console.error("❌ Error al cargar categorías:", error)
        return
      }

      if (data && data.length > 0) {
        const categoryNames = (data as { nombre: string }[]).map(cat => cat.nombre)
        setCategories(categoryNames)
        console.log("✅ Categorías cargadas desde BD:", categoryNames)
      } else {
        console.log("⚠️ No se encontraron categorías activas")
        setCategories([])
      }
    } catch (err) {
      console.error("❌ Error inesperado al cargar categorías:", err)
      setCategories([])
    }
  }

  // Función para cargar referencias disponibles
  const fetchReferences = async () => {
    try {
      const response = await tariffsService.getAllReferences()
      if (response.success && response.data) {
        const referencesArray = Array.isArray(response.data) ? response.data : [response.data]
        setAvailableReferences(referencesArray)
        console.log("✅ Referencias cargadas:", referencesArray)
      }
    } catch (error) {
      console.error("❌ Error al cargar referencias:", error)
    }
  }

  // 🆕 Función para determinar qué análisis puede ver el usuario
  const fetchUserVisibleAnalysis = async () => {
    if (!user || user.user_type === "admin") {
      // Admin ve todo, usuarios no logueados verán solo públicos
      return
    }

    try {
      console.log("🔍 Calculando análisis visibles para usuario:", user.email)
      
      // Obtener las referencias del usuario
      const userReferences = user.user_references || []
      
      if (userReferences.length === 0) {
        console.log("❌ Usuario sin referencias asignadas")
        setUserAnalysisIds(new Set())
        return
      }

      // Obtener las tarifas default de las referencias del usuario
      const userTariffIds = userReferences
        .map(ur => ur.reference?.default_tariff_id)
        .filter(Boolean) as string[]

      console.log("💰 Tarifas del usuario:", userTariffIds)

      if (userTariffIds.length === 0) {
        console.log("⚠️ Referencias del usuario no tienen tarifas configuradas")
        setUserAnalysisIds(new Set())
        return
      }

      // Consultar análisis que tienen precios para las tarifas del usuario
      const response = await tariffsService.getAllTariffPrices()
      if (!response.success || !response.data) {
        console.error("❌ Error al obtener precios de tarifas:", response.error)
        return
      }

      const allTariffPrices = Array.isArray(response.data) ? response.data : [response.data]
      
      // Filtrar precios que corresponden a las tarifas del usuario
      const userTariffPrices = allTariffPrices.filter(tp => 
        userTariffIds.includes(tp.tariff_id)
      )

      // Extraer IDs únicos de análisis
      const visibleAnalysisIds = new Set(
        userTariffPrices.map(tp => tp.exam_id.toString())
      )

      console.log("✅ Análisis visibles para usuario:", visibleAnalysisIds.size)
      setUserAnalysisIds(visibleAnalysisIds)

    } catch (error) {
      console.error("❌ Error al calcular análisis visibles:", error)
      setUserAnalysisIds(new Set())
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchAnalyses()
    fetchProfiles()
    fetchCategories() // Add categories loading
    fetchTariffs() // Add tariffs loading
    fetchReferences() // Add references loading
  }, [])

  // 🆕 Ejecutar cuando cambie el usuario
  useEffect(() => {
    fetchUserVisibleAnalysis()
  }, [user])

  // 1. Estado para el modal de agregar análisis
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false)
  const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false)
  const [newAnalysis, setNewAnalysis] = useState({
    name: '',
    price_public: '', // Precio para público general
    price_business: '', // Precio para médicos y empresas
    show_public: false,
    conditions: '',
    sample: '',
    sample_quantity: '5 mL', // Cantidad de muestra por defecto
    protocol: '',
    suggestions: '',
    comments: '',
    category: '',
    deliveryTime: '2-4 horas',
    // Nuevos campos para sistema de referencias
    visibility_type: 'public', // "public" o "references"
    allowed_references: [] as string[], // Array de IDs de referencias
    tariff_prices: {} as { [tariffId: string]: string } // Precios por tarifa específica
  } as {
    name: string;
    price_public: string;
    price_business: string;
    show_public: boolean;
    conditions: string;
    sample: string;
    sample_quantity: string;
    protocol: string;
    suggestions: string;
    comments: string;
    category: string;
    deliveryTime: string;
    visibility_type: string;
    allowed_references: string[];
    tariff_prices: { [tariffId: string]: string };
  });
  
  const [newProfile, setNewProfile] = useState({
    title: '',
    description: '',
    price: 0,
    image: '',
    tests: [] as string[],
  });

  // Función para limpiar el formulario
  const clearAnalysisForm = () => {
    setNewAnalysis({
      name: '',
      price_public: '',
      price_business: '',
      show_public: false,
      conditions: '',
      sample: '',
      sample_quantity: '5 mL',
      protocol: '',
      suggestions: '',
      comments: '',
      category: '',
      deliveryTime: '2-4 horas',
      visibility_type: 'public',
      allowed_references: [],
      tariff_prices: {}
    });
  };

  // 2. Función para agregar análisis con sistema completo de referencias
  const handleAddAnalysis = async () => {
    console.log("🚀 INICIANDO CREACIÓN DE ANÁLISIS AVANZADO")
    console.log("📊 Datos del formulario:", newAnalysis)
    
    // Validar campos básicos
    if (!newAnalysis.name || !newAnalysis.category) {
      alert("Por favor completa al menos el nombre y categoría")
      return
    }

    // Validar precios según el modo
    if (newAnalysis.visibility_type === 'public') {
      // Modo público: validar precios público/empresarial
      if (!newAnalysis.price_public && !newAnalysis.price_business) {
        alert("Por favor ingresa al menos el precio público o empresarial")
        return
      }

      const pricePublic = newAnalysis.price_public ? parseFloat(newAnalysis.price_public) : 0
      const priceBusiness = newAnalysis.price_business ? parseFloat(newAnalysis.price_business) : 0

      if ((newAnalysis.price_public && (isNaN(pricePublic) || pricePublic < 0)) ||
          (newAnalysis.price_business && (isNaN(priceBusiness) || priceBusiness < 0))) {
        alert("Por favor ingresa precios válidos")
        return
      }
    } else {
      // Modo referencias: validar referencia y precios por tarifa
      if (newAnalysis.allowed_references.length === 0 || !newAnalysis.allowed_references[0]) {
        alert("Por favor selecciona una referencia específica para este análisis")
        return
      }

      const hasAnyPrice = Object.values(newAnalysis.tariff_prices).some(price => price && parseFloat(price) > 0)
      if (!hasAnyPrice) {
        alert("Por favor configura al menos un precio por tarifa")
        return
      }

      // Validar que los precios por tarifa sean válidos
      for (const [tariffId, price] of Object.entries(newAnalysis.tariff_prices)) {
        if (price && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
          alert("Por favor ingresa precios válidos para todas las tarifas")
          return
        }
      }
    }

    try {
      const supabase = getSupabaseClient()
      
      console.log("💾 Guardando análisis en base de datos...")
      
      // Calcular precio principal para compatibilidad legacy
      let mainPrice = 0
      let referencePrice = 0
      
      if (newAnalysis.visibility_type === 'public') {
        const pricePublic = newAnalysis.price_public ? parseFloat(newAnalysis.price_public) : 0
        const priceBusiness = newAnalysis.price_business ? parseFloat(newAnalysis.price_business) : 0
        mainPrice = pricePublic || priceBusiness
        referencePrice = priceBusiness || pricePublic
      } else {
        // En modo referencias, usar el primer precio configurado como principal
        const firstPrice = Object.values(newAnalysis.tariff_prices).find(p => p && parseFloat(p) > 0)
        mainPrice = firstPrice ? parseFloat(firstPrice) : 0
        referencePrice = mainPrice
      }
      
      // Insertar análisis
      const analysisData = {
        name: newAnalysis.name,
        category: newAnalysis.category,
        show_public: newAnalysis.show_public || false,
        conditions: newAnalysis.conditions || "",
        sample: newAnalysis.sample || "",
        sample_quantity: newAnalysis.sample_quantity || "5 mL",
        protocol: newAnalysis.protocol || "",
        suggestions: newAnalysis.suggestions || "",
        comments: newAnalysis.comments || "",
        deliverytime: newAnalysis.deliveryTime || "2-4 horas",
        // Compatibilidad legacy
        price: mainPrice,
        reference_price: referencePrice
      }

      const { data: analysisResult, error: analysisError } = await supabase
        .from("analyses")
        .insert([analysisData])
        .select()
        .single()

      if (analysisError) {
        console.error("❌ Error al insertar análisis:", analysisError)
        alert("Error al agregar análisis: " + analysisError.message)
        return
      }

      console.log("✅ Análisis creado:", analysisResult)

      // Crear precios en sistema de tarifas
      const pricePromises = []
      let priceCreationSummary = ""

      if (newAnalysis.visibility_type === 'public') {
        // MODO PÚBLICO: Crear precios simplificados
        const baseTariff = availableTariffs.find(t => t.name === 'Base' && t.type === 'sale')
        const referenceTariff = availableTariffs.find(t => t.name === 'Referencial con IGV' && t.type === 'sale')
        
        if (!baseTariff || !referenceTariff) {
          console.warn("⚠️ No se encontraron tarifas Base y Referencial")
        }
        
        // Precio público
        if (newAnalysis.price_public && baseTariff) {
          pricePromises.push(
            tariffsService.createTariffPrice({
              tariff_id: baseTariff.id as string,
              exam_id: Number((analysisResult as any).id),
              price: parseFloat(newAnalysis.price_public)
            })
          )
        }
        
        // Precio empresarial
        if (newAnalysis.price_business && referenceTariff) {
          pricePromises.push(
            tariffsService.createTariffPrice({
              tariff_id: referenceTariff.id as string,
              exam_id: Number((analysisResult as any).id),
              price: parseFloat(newAnalysis.price_business)
            })
          )
        }
        
        priceCreationSummary = "Modo público: precios Base y Referencial"
        
      } else {
        // MODO REFERENCIAS: Crear precios específicos por tarifa
        for (const [tariffId, price] of Object.entries(newAnalysis.tariff_prices)) {
          if (price && parseFloat(price) > 0) {
            pricePromises.push(
              tariffsService.createTariffPrice({
                tariff_id: tariffId,
                exam_id: Number((analysisResult as any).id),
                price: parseFloat(price)
              })
            )
          }
        }
        
        priceCreationSummary = `Modo referencias: ${pricePromises.length} precios por tarifa`
      }

      // Ejecutar creación de precios
      if (pricePromises.length > 0) {
        console.log(`💰 Creando ${pricePromises.length} precios...`)
        const tariffResults = await Promise.all(pricePromises)
        
        let successCount = 0
        tariffResults.forEach((result, index) => {
          if (result.success) {
            successCount++
            console.log(`✅ Precio ${index + 1} creado exitosamente`)
          } else {
            console.error(`❌ Error creando precio ${index + 1}:`, result.error)
          }
        })
        
        console.log(`✅ ${successCount}/${pricePromises.length} precios creados`)
      }

      // En modo referencias, la visibilidad se maneja en el frontend basándose en las tarifas configuradas
      if (newAnalysis.visibility_type === 'references') {
        console.log("🔗 Análisis configurado para referencia específica")
        console.log("📌 La visibilidad se manejará mediante lógica de frontend basada en tarifas")
      }
      
      // Recargar datos
      await fetchAnalyses()
      await fetchCategories()
      
      // Limpiar formulario y cerrar modal
      clearAnalysisForm()
      setIsAddModalOpen(false)
      
      // Mensaje de éxito
      const selectedReference = availableReferences.find(ref => ref.id === newAnalysis.allowed_references[0])
      const successMessage = newAnalysis.visibility_type === 'public' 
        ? `✅ Análisis público agregado exitosamente`
        : `✅ Análisis agregado para referencia: ${selectedReference?.name || 'Seleccionada'}`
        
      alert(successMessage)
      console.log("🎉 PROCESO COMPLETADO EXITOSAMENTE")
      
    } catch (err) {
      console.error("❌ Error inesperado:", err)
      alert("Error inesperado al agregar análisis: " + String(err))
    }
  }

  // Función para agregar perfil
  const handleAddProfile = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert([newProfile])
      .select()
      .single();
    if (error) {
      alert("Error al agregar perfil: " + error.message);
      return;
    }
    
    // Recargar todos los perfiles desde la BD para mantener sincronización
    await fetchProfiles();
    
    setIsAddProfileModalOpen(false);
    setNewProfile({
      title: '', description: '', price: 0, image: '', tests: [],
    });
    alert("✅ Perfil agregado exitosamente");
  };

  // 3. Modifica handleDeleteAnalysis para borrar en Supabase
  const handleDeleteAnalysis = async (analysis: Analysis) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este análisis?')) return;
    const supabase = getSupabaseClient();

    // Eliminar primero los precios relacionados para evitar violar FK
    const { error: priceError } = await supabase
      .from("tariff_prices")
      .delete()
      .eq("exam_id", analysis.id)

    if (priceError) {
      alert("Error al eliminar precios asociados: " + priceError.message);
      return;
    }

    // Ahora eliminar el análisis
    const { error } = await supabase.from("analyses").delete().eq("id", analysis.id);
    if (error) {
      alert("Error al eliminar análisis: " + error.message);
      return;
    }
    setLocalAnalysisData(prevData => prevData.filter(item => item.id !== analysis.id));
  };

  // Función para obtener imagen específica según el perfil
  const getProfileImage = (title: string, currentImage: string) => {
    // Si ya tiene una imagen válida de la BD, usarla
    if (currentImage && currentImage.trim() && !currentImage.includes('photo-1559757148-5c350d0d3c56')) {
      return currentImage;
    }

    // Mapeo de imágenes específicas por tipo de perfil
    const imageMap: { [key: string]: string } = {
      // Perfiles de laboratorio específicos - TODAS DIFERENTES
      'lipídico': 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Análisis de sangre
      'hepático': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Médico/hígado
      'tiroideo': 'https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Endocrinología
      'renal': 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Riñones/nefrología
      'diabético': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Diabetes/glucosa
      'cardiaco': 'https://images.unsplash.com/photo-1628348068343-c6a848d2d6b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Cardiología
      
      // Perfiles hormonales - TODAS DIFERENTES
      'hormonal': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Hormonas generales
      'femenino': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Ginecología
      'masculino': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Andrología
      
      // Perfiles especiales por edad - TODAS DIFERENTES
      'pediátrico': 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Pediatría
      'geriátrico': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Geriatría
      
      // Perfiles específicos - TODAS DIFERENTES
      'deportivo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Medicina deportiva
      'preoperatorio': 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Cirugía
      'básico': 'https://images.unsplash.com/photo-1559885543-cd0db8c4d773?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Chequeo general
      
      // Perfiles específicos adicionales - TODAS DIFERENTES
      'ggtp': 'https://images.unsplash.com/photo-1582560469781-1146b80a3c91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Hígado específico
    };

    // Buscar coincidencia en el título (insensible a mayúsculas)
    const titleLower = title.toLowerCase();
    for (const [key, image] of Object.entries(imageMap)) {
      if (titleLower.includes(key)) {
        console.log(`🎯 Imagen específica asignada para "${title}": ${key}`);
        return image;
      }
    }

    // Imagen por defecto diferente si no encuentra coincidencia
    console.log(`⚠️ Usando imagen por defecto para: ${title}`);
    return 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  };

  // Mostrar todos los análisis por defecto si el usuario es admin y no hay búsqueda activa
  const mostrarTodos = user && user.user_type === "admin" && !searchTerm && !selectedCategory && !selectedLetter;
  const analisisParaMostrar = mostrarTodos ? localAnalysisData : filteredAnalysis;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Updated Hero Section */}
      <section className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
        {/* Background image */}
        <Image src="/lab.webp" alt="Análisis Clínicos" fill className="object-cover" priority />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-[#EAF7FF]/50" />

        {/* Content */}
        <div className="container relative h-full flex flex-col justify-between max-w-[1200px] mx-auto px-4 py-6 sm:py-8 md:py-12">
          <div className="flex flex-col items-start max-w-3xl mt-auto">
            <p className="text-sm sm:text-base md:text-lg font-medium mb-2 sm:mb-3 md:mb-4">
              <span className="text-[#2F71B8]">Más de 200 análisis</span>{" "}
              <span className="text-gray-600">a tu disposición</span>
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight mb-4 sm:mb-5 md:mb-6 font-sans leading-tight">
              <span className="text-[#2F71B8]">Directorio</span> <span className="text-black">de análisis</span>
            </h3>
          </div>
          <div className="flex justify-center sm:justify-end mt-auto">
            <Button
              size="lg"
              className="bg-[#2F71B8] hover:bg-[#2EB9A5] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 h-auto text-sm sm:text-base md:text-lg transition-all duration-300 hover:shadow-lg"
              onClick={() => setIsHeroSchedulingOpen(true)}
            >
              <Syringe className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {user ? "PROGRAMA TU RECOJO" : "AGENDA TU ANÁLISIS"}
            </Button>
          </div>
        </div>
      </section>

      {/* Rest of the content */}
      <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 xl:py-12">
        {/* Tabs para perfiles populares - Solo visible para pacientes y usuarios no autenticados */}
        <Tabs defaultValue="all" className="w-full">
          {/* Ocultar tabs para empresas y médicos */}
          {!(user && (user.user_type === "doctor" || user.user_type === "company")) && (
            <TabsList className="w-full max-w-2xl sm:max-w-3xl mx-auto bg-gray-100 p-1 rounded-xl h-10 sm:h-12 lg:h-14 flex relative overflow-hidden">
              {/* Underline animado */}
              <span id="tab-underline" className="absolute bottom-0 left-0 h-1 w-1/2 bg-gradient-to-r from-[#1E5FAD] via-[#3DA64A] to-[#1E5FAD] rounded-full transition-transform duration-500 ease-out z-0" style={{transform: `translateX(var(--tab-underline-x,0%))`}} />
              {/* Tabs con gradiente animado y rebote */}
              <TabsTrigger 
                value="all" 
                className="flex-1 h-8 sm:h-10 lg:h-12 text-xs sm:text-sm lg:text-base font-bold rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E5FAD] data-[state=active]:to-[#3DA64A] data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 data-[state=active]:ring-2 data-[state=active]:ring-[#3DA64A] data-[state=active]:ring-offset-2 transform hover:scale-105 hover:shadow-lg relative z-10 animate-tab-bounce px-2 sm:px-4"
                onMouseEnter={() => { document.documentElement.style.setProperty('--tab-underline-x', '0%') }}
              >
                <span className="hidden sm:inline">Todos los análisis</span>
                <span className="sm:hidden text-center">Todos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="popular" 
                className="flex-1 h-8 sm:h-10 lg:h-12 text-xs sm:text-sm lg:text-base font-bold rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E5FAD] data-[state=active]:to-[#3DA64A] data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 data-[state=active]:ring-2 data-[state=active]:ring-[#3DA64A] data-[state=active]:ring-offset-2 transform hover:scale-105 hover:shadow-lg relative z-10 animate-tab-bounce px-2 sm:px-4"
                onMouseEnter={() => { document.documentElement.style.setProperty('--tab-underline-x', '100%') }}
              >
                <span className="hidden sm:inline">Perfiles populares</span>
                <span className="sm:hidden text-center">Perfiles</span>
              </TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="all" className="mt-4 sm:mt-6 lg:mt-8">
            {/* Barra de búsqueda */}
            <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar análisis..."
                  className="pl-10 sm:pl-12 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-gray-300 focus:border-[#1E5FAD] focus:ring-[#1E5FAD] transition-all duration-300 w-full rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-10 sm:h-12 lg:h-14 w-full sm:min-w-[160px] lg:min-w-[200px] border-gray-300 focus:border-[#1E5FAD] focus:ring-[#1E5FAD] transition-all duration-300 text-sm sm:text-base lg:text-lg rounded-xl">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="focus:bg-[#1E5FAD] focus:text-white">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="focus:bg-[#1E5FAD] focus:text-white transition-colors duration-200">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="h-10 sm:h-12 lg:h-14 px-6 sm:px-8 lg:px-10 bg-[#1E5FAD] hover:bg-[#3DA64A] text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-xl">
                  Buscar
                </Button>
              </div>
            </div>

            {/* Búsqueda alfabética OPTIMIZADA */}
            <div className="space-y-3 mb-4 sm:mb-6 lg:mb-8">
              <div className="text-sm sm:text-base text-gray-600 font-medium">Búsqueda alfabética</div>
              {/* Layout responsivo mejorado */}
              <div className="w-full overflow-hidden">
                {/* Móvil: 6 columnas compactas */}
                <div className="grid grid-cols-6 gap-1.5 sm:hidden">
                  <Button
                    variant={selectedLetter === null ? "default" : "outline"}
                    className={`h-8 text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedLetter === null
                        ? "bg-[#1E5FAD] hover:bg-[#3DA64A] shadow-md scale-105 text-white"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E5FAD] hover:from-[#1E5FAD] hover:to-[#3DA64A] hover:text-white border-[#1E5FAD]/30 hover:shadow-md"
                    }`}
                    onClick={() => setSelectedLetter(null)}
                  >
                    *
                  </Button>
                  {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                    <Button
                      key={letter}
                      variant="outline"
                      className={`h-8 text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedLetter === letter
                          ? "bg-[#1E5FAD] text-white hover:bg-[#3DA64A] shadow-md border-[#1E5FAD] scale-105"
                          : "bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E5FAD] hover:from-[#1E5FAD] hover:to-[#3DA64A] hover:text-white border-[#1E5FAD]/30 hover:shadow-md"
                      }`}
                      onClick={() => handleLetterClick(letter)}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
                
                {/* Tablet: 9 columnas */}
                <div className="hidden sm:grid md:hidden grid-cols-9 gap-2">
                  <Button
                    variant={selectedLetter === null ? "default" : "outline"}
                    className={`h-10 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedLetter === null
                        ? "bg-[#1E5FAD] hover:bg-[#3DA64A] shadow-lg scale-105"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E5FAD] hover:from-[#1E5FAD] hover:to-[#3DA64A] hover:text-white border-[#1E5FAD]/30 hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedLetter(null)}
                  >
                    Todos
                  </Button>
                  {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                    <Button
                      key={letter}
                      variant="outline"
                      className={`h-10 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedLetter === letter
                          ? "bg-[#1E5FAD] text-white hover:bg-[#3DA64A] shadow-lg border-[#1E5FAD] scale-105"
                          : "bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E5FAD] hover:from-[#1E5FAD] hover:to-[#3DA64A] hover:text-white border-[#1E5FAD]/30 hover:shadow-lg"
                      }`}
                      onClick={() => handleLetterClick(letter)}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
                
                {/* Desktop: EXACTAMENTE como estaba antes */}
                <div className="hidden md:grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-9 lg:grid-cols-10 xl:grid-cols-12 gap-1 sm:gap-2">
                  <Button
                    variant={selectedLetter === null ? "default" : "outline"}
                    className={`h-8 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${
                      selectedLetter === null
                        ? "bg-[#1E5FAD] hover:bg-[#3DA64A] shadow-lg scale-105"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E5FAD] hover:from-[#1E5FAD] hover:to-[#3DA64A] hover:text-white border-[#1E5FAD]/30 hover:border-[#1E5FAD] hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedLetter(null)}
                  >
                    <span className="hidden xs:inline">Todos</span>
                    <span className="xs:hidden">*</span>
                  </Button>
                  {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                    <Button
                      key={letter}
                      variant="outline"
                      className={`h-8 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${
                        selectedLetter === letter
                          ? "bg-[#1E5FAD] text-white hover:bg-[#3DA64A] shadow-lg border-[#1E5FAD] scale-105"
                          : "bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E5FAD] hover:from-[#1E5FAD] hover:to-[#3DA64A] hover:text-white border-[#1E5FAD]/30 hover:border-[#1E5FAD] hover:shadow-lg"
                      }`}
                      onClick={() => handleLetterClick(letter)}
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón para agregar análisis (solo admin) */}
            {user && user.user_type === "admin" && (
              <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base h-10 sm:h-12 rounded-xl px-6" 
                  onClick={() => setIsAddModalOpen(true)}
                >
                  + Agregar análisis
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base h-10 sm:h-12 rounded-xl px-6" 
                  onClick={() => setIsCategoriasModalOpen(true)}
                >
                  📂 Gestionar categorías
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base h-10 sm:h-12 rounded-xl px-6" 
                  onClick={() => setIsTariffsAdminOpen(true)}
                >
                  💰 Sistema de Tarifas
                </Button>
              </div>
            )}

            {/* Resultados de búsqueda - Solo mostrar cuando hay búsqueda activa */}
            {analisisParaMostrar.length > 0 ? (
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Contador de resultados */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#1E5FAD]/20 shadow-sm">
                  <p className="text-[#1E5FAD] font-medium text-sm sm:text-base lg:text-lg">
                    {analisisParaMostrar.length} {analisisParaMostrar.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedCategory && ` en ${selectedCategory}`}
                    {selectedLetter && ` que comienzan con "${selectedLetter}"`}
                  </p>
                </div>

                {/* Tabla de resultados OPTIMIZADA */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Vista móvil: Cards en lugar de tabla */}
                  <div className="block lg:hidden space-y-3 p-4">
                    {currentAnalyses.map((analysis) => (
                      <div key={analysis.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-semibold text-sm text-gray-900 leading-tight flex-1">{analysis.name}</h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                            {analysis.category}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          {user && (
                            <PriceDisplay analysisId={analysis.id} />
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 text-xs flex-1"
                            onClick={() => setSelectedAnalysis(analysis)}
                          >
                            VER DETALLE
                          </Button>
                          
                          {user && (
                            <Button
                              size="sm"
                              className="bg-[#3DA64A] hover:bg-[#1E5FAD] h-8 text-xs flex-1"
                              onClick={() => handleAddToCart(analysis)}
                            >
                              Agregar
                            </Button>
                          )}
                          
                          {user && user.user_type === "admin" && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 text-xs px-2"
                                onClick={() => setEditingAnalysis(analysis)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs px-2"
                                onClick={() => handleDeleteAnalysis(analysis)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Vista desktop: Tabla normal */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Análisis
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Categoría
                          </th>
                          {user && (
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Precio
                            </th>
                          )}
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Detalle
                          </th>
                          {user && (
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Carrito
                            </th>
                          )}
                          {user && user.user_type === "admin" && (
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentAnalyses.map((analysis) => (
                          <tr key={analysis.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 leading-tight">{analysis.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {analysis.category}
                              </span>
                            </td>
                            {user && (
                              <td className="px-6 py-4">
                                <PriceDisplay analysisId={analysis.id} />
                              </td>
                            )}
                            <td className="px-6 py-4 text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 text-xs"
                                onClick={() => setSelectedAnalysis(analysis)}
                              >
                                VER
                              </Button>
                            </td>
                            {user && (
                              <td className="px-6 py-4 text-sm font-medium">
                                <Button
                                  size="sm"
                                  className="bg-[#3DA64A] hover:bg-[#1E5FAD] h-8 text-xs"
                                  onClick={() => handleAddToCart(analysis)}
                                >
                                  Agregar
                                </Button>
                              </td>
                            )}
                            {user && user.user_type === "admin" && (
                              <td className="px-6 py-4 text-sm font-medium">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 text-xs"
                                    onClick={() => setEditingAnalysis(analysis)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Editar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs"
                                    onClick={() => handleDeleteAnalysis(analysis)}
                                  >
                                    <Trash className="h-3 w-3 mr-1" />
                                    Eliminar
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Paginación OPTIMIZADA */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-6 lg:mt-8">
                    <div className="text-sm sm:text-base text-gray-700 text-center lg:text-left order-2 lg:order-1">
                      Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, analisisParaMostrar.length)} de {analisisParaMostrar.length} resultados
                    </div>
                    <div className="flex items-center justify-center space-x-1 order-1 lg:order-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-300 h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Anterior</span>
                      </Button>
                      <div className="flex space-x-1">
                        {getPageNumbers().slice(0, 5).map((page, index) => (
                          <Button
                            key={index}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 text-xs sm:text-sm ${
                              currentPage === page
                                ? "bg-[#1E5FAD] hover:bg-[#3DA64A]"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => typeof page === "number" && handlePageChange(page)}
                            disabled={page === "..."}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-300 h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
                      >
                        <span className="hidden sm:inline mr-1">Siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (searchTerm || selectedCategory || selectedLetter) && analisisParaMostrar.length === 0 ? (
              /* No hay resultados */
              <div className="text-center py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-red-50 to-orange-100 rounded-xl border border-red-200 mx-2 sm:mx-0">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Search className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-red-600 mb-3 sm:mb-4">
                    No se encontraron resultados
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">
                    No encontramos análisis que coincidan con tu búsqueda
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedCategory && ` en ${selectedCategory}`}
                    {selectedLetter && ` que comienzan con "${selectedLetter}"`}
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory(null)
                      setSelectedLetter(null)
                    }}
                    className="bg-[#1E5FAD] hover:bg-[#3DA64A] text-sm sm:text-base lg:text-lg h-10 sm:h-12 px-6 sm:px-8 rounded-xl"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </div>
            ) : (
              /* Mensaje de bienvenida - Solo cuando NO hay búsqueda */
              <div className="text-center py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-[#1E5FAD]/20 mx-2 sm:mx-0">
                <div className="max-w-md sm:max-w-lg mx-auto px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1E5FAD] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Search className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1E5FAD] mb-3 sm:mb-4">
                    Encuentra el análisis que necesitas
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">
                    Utiliza el buscador o selecciona una categoría para encontrar rápidamente el análisis clínico que estás buscando.
                    Tenemos más de 200 análisis disponibles para ti.
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-sm sm:text-base lg:text-lg text-gray-700">
                      🔬 Análisis de laboratorio con tecnología de vanguardia
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg text-gray-700">
                      📋 Más de 15 categorías especializadas disponibles
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg text-gray-700">
                      ⚡ Resultados rápidos y precisos
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Solo mostrar perfiles populares para pacientes y usuarios no autenticados */}
          {!(user && (user.user_type === "doctor" || user.user_type === "company")) && (
            <TabsContent value="popular" className="mt-4 sm:mt-6 lg:mt-8">
            {/* Botón para agregar perfil (solo admin) */}
            {user && user.user_type === "admin" && (
              <div className="mb-6 sm:mb-8">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base h-10 sm:h-12 rounded-xl px-6" 
                  onClick={() => setIsAddProfileModalOpen(true)}
                >
                  + Agregar perfil
                </Button>
              </div>
            )}
            
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {popularProfiles.map((profile, i) => (
                <Card
                  key={i}
                  className="overflow-hidden transition-all duration-300 shadow hover:shadow-2xl hover:scale-[1.02] hover:border-[#1E5FAD] border border-transparent group"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-40 sm:h-48 lg:h-52 bg-gray-200 overflow-hidden">
                      <Image
                        src={getProfileImage(profile.title, profile.image)}
                        alt={profile.title}
                        fill
                        className="object-cover transition-opacity duration-300"
                        onError={(e) => {
                          console.log("❌ Error cargando imagen para:", profile.title);
                          const target = e.target as HTMLImageElement;
                          target.src = getProfileImage(profile.title, '');
                        }}
                        onLoad={() => {
                          console.log("✅ Imagen cargada para:", profile.title);
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex-1 pr-2">{profile.title}</CardTitle>
                      {user && user.user_type === "admin" && (
                        <div className="flex flex-col gap-1 ml-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log("🖊️ Editando perfil:", profile.title);
                              setEditingProfile(profile);
                            }}
                            className="border-blue-200 hover:bg-blue-50 text-xs h-7 px-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              console.log("🗑️ Eliminando perfil:", profile.title);
                              handleDeleteProfile(i);
                            }}
                            className="hover:bg-red-600 text-xs h-7 px-2"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardDescription className="mt-2 mb-4 text-sm sm:text-base text-gray-600">{profile.description}</CardDescription>
                    <div className="mb-4 sm:mb-6">
                      <div className="font-medium mb-3 text-base sm:text-lg">Incluye:</div>
                      <ul className="text-sm sm:text-base space-y-2">
                        {profile.tests.map((test, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 sm:mt-6 gap-3 sm:gap-4">
                      <div className="font-bold text-xl sm:text-2xl text-center sm:text-left">
                        S/. {profile.price.toFixed(2)}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-[#25d366] hover:bg-[#128C7E] text-white border-[#25d366] transition-all duration-200 group-hover:scale-105 text-sm h-9 sm:h-10 px-4 flex-1 sm:flex-none"
                          onClick={() => {
                            const message = `Hola, estoy interesado en el ${profile.title}. ¿Podrían darme más información?`
                            const whatsappUrl = `https://wa.me/51900649599?text=${encodeURIComponent(message)}`
                            window.open(whatsappUrl, '_blank')
                          }}
                        >
                          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.079.549 4.090 1.595 5.945L0 24l6.256-1.623c1.783.986 3.821 1.514 5.939 1.514 6.624 0 11.99-5.367 11.99-11.988C24.186 5.367 18.641.001 12.017.001zM12.017 21.989c-1.737 0-3.449-.434-4.96-1.263l-.356-.213-3.675.964.983-3.595-.233-.372C2.69 15.963 2.201 14.018 2.201 11.987c0-5.411 4.404-9.815 9.816-9.815 2.618 0 5.082 1.021 6.941 2.88 1.858 1.858 2.88 4.322 2.88 6.941-.001 5.411-4.406 9.816-9.821 9.816zm5.384-7.348c-.295-.148-1.744-.861-2.014-.958-.269-.098-.465-.148-.661.148-.197.295-.762.958-.934 1.155-.172.197-.344.221-.639.074-.295-.148-1.244-.459-2.37-1.462-.875-.781-1.465-1.746-1.637-2.041-.172-.295-.018-.455.129-.602.132-.131.295-.344.443-.516.148-.172.197-.295.295-.492.098-.197.049-.369-.025-.516-.074-.148-.661-1.591-.906-2.18-.238-.574-.479-.496-.661-.504-.172-.008-.369-.01-.565-.01-.197 0-.516.074-.787.369-.271.295-1.034 1.01-1.034 2.463 0 1.453 1.059 2.857 1.207 3.054.148.197 2.080 3.176 5.041 4.456.705.305 1.256.487 1.686.623.708.225 1.353.193 1.863.117.568-.084 1.744-.713 1.989-1.402.246-.689.246-1.279.172-1.402-.074-.123-.271-.197-.566-.345z"/>
                          </svg>
                          WhatsApp
                        </Button>
                        {user && (user.user_type === "doctor" || user.user_type === "company" || user.user_type === "admin") && (
                          <Button
                            size="sm"
                            className="bg-[#3DA64A] hover:bg-[#1E5FAD] text-sm h-9 sm:h-10 px-4 flex-1 sm:flex-none"
                            onClick={() =>
                              handleAddToCart({
                                id: 1000 + i,
                                name: profile.title,
                                price: profile.price,
                                category: "Perfil",
                                conditions: "No especificado",
                                sample: "No especificado",
                                protocol: "No especificado",
                                suggestions: "",
                                comments: "",
                                deliveryTime: "24-48 horas"
                              })
                            }
                          >
                            Agregar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Dialogs */}
      <AnalysisDialog
        isOpen={selectedAnalysis !== null}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
        user={user}
      />

      {/* Sistema de Tarifas - Solo para administradores */}
      {user && user.user_type === "admin" && (
        <TariffsAdminPanel
          isOpen={isTariffsAdminOpen}
          onClose={() => setIsTariffsAdminOpen(false)}
        />
      )}

      {selectedTest && (
        <SchedulingFlow
          isOpen={isSchedulingOpen}
          onClose={() => setIsSchedulingOpen(false)}
          onComplete={handleScheduleComplete}
          testName={selectedTest.name}
          initialSelectedAnalyses={[{ ...selectedTest, quantity: 1 }]}
        />
      )}

      <SuccessDialog
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        testName={selectedTest?.name || ""}
        patientName={patientName}
        onContinueShopping={handleContinueShopping}
        onNewPatient={handleNewPatient}
        onViewCart={handleViewCart}
        items={selectedTest ? [{ name: selectedTest.name, price: selectedTest.price, quantity: 1 }] : []}
        showWhatsAppButton={true}
      />

      <HeroSchedulingDialog isOpen={isHeroSchedulingOpen} onClose={() => setIsHeroSchedulingOpen(false)} />

        <Dialog open={!!editingAnalysis} onOpenChange={() => setEditingAnalysis(null)}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-hidden p-4 sm:p-6">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-sm sm:text-lg">Editar Análisis: {editingAnalysis?.name || 'Cargando...'}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2">
              {editingAnalysis && (
              <form onSubmit={async (e) => {
                e.preventDefault()
                console.log("📝 Formulario enviado");
                const formData = new FormData(e.currentTarget)
                const updatedAnalysis = {
                  ...editingAnalysis,
                  name: formData.get('name') as string,
                  price: parseFloat(formData.get('price') as string),
                  reference_price: formData.get('reference_price') ? parseFloat(formData.get('reference_price') as string) : undefined,
                  show_public: formData.get('show_public') === 'on',
                  category: formData.get('category') as string,
                  conditions: formData.get('conditions') as string,
                  sample: formData.get('sample') as string,
                  sample_quantity: formData.get('sample_quantity') as string,
                  protocol: formData.get('protocol') as string,
                  suggestions: formData.get('suggestions') as string,
                  comments: formData.get('comments') as string,
                  deliveryTime: formData.get('deliveryTime') as string,
                }
                console.log("📊 Datos a actualizar:", updatedAnalysis);
                await handleUpdateAnalysis(updatedAnalysis)
              }}>
                <div className="grid gap-3 sm:gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="name" className="text-left sm:text-right font-medium text-sm">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingAnalysis.name}
                      className="sm:col-span-3 h-8 text-sm"
                    />
                  </div>
                  {/* Campos de precios */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="price" className="text-left sm:text-right font-medium text-sm">Precio Público</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingAnalysis.price}
                      className="sm:col-span-3 h-8 text-sm border-green-300"
                      placeholder="Precio para pacientes"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="reference_price" className="text-left sm:text-right font-medium text-sm">Precio Empresarial</Label>
                    <Input
                      id="reference_price"
                      name="reference_price"
                      type="number"
                      step="0.01"
                      defaultValue={editingAnalysis.reference_price || ''}
                      className="sm:col-span-3 h-8 text-sm border-blue-300"
                      placeholder="Precio para médicos y empresas"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="category" className="text-left sm:text-right font-medium text-sm">Categoría</Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={editingAnalysis.category}
                      className="sm:col-span-3 h-8 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="conditions" className="text-left sm:text-right font-medium text-sm">Condiciones</Label>
                    <Input
                      id="conditions"
                      name="conditions"
                      defaultValue={editingAnalysis.conditions}
                      className="sm:col-span-3 h-8 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="sample" className="text-left sm:text-right font-medium text-sm">Muestra</Label>
                    <Input
                      id="sample"
                      name="sample"
                      defaultValue={editingAnalysis.sample}
                      className="sm:col-span-3 h-8 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="sample_quantity" className="text-left sm:text-right font-medium text-sm">Cantidad de muestra</Label>
                    <Input
                      id="sample_quantity"
                      name="sample_quantity"
                      defaultValue={editingAnalysis.sample_quantity}
                      className="sm:col-span-3 h-8 text-sm"
                      placeholder="Ej: 5 mL, 10 mL"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <Label htmlFor="protocol" className="text-left sm:text-right font-medium text-sm">Protocolo</Label>
                    <Textarea
                      id="protocol"
                      name="protocol"
                      defaultValue={editingAnalysis.protocol}
                      className="sm:col-span-3 min-h-[50px] text-sm resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <Label htmlFor="suggestions" className="text-left sm:text-right font-medium text-sm">Sugerencias</Label>
                    <Textarea
                      id="suggestions"
                      name="suggestions"
                      defaultValue={editingAnalysis.suggestions}
                      className="sm:col-span-3 min-h-[50px] text-sm resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-1 sm:gap-4">
                    <Label htmlFor="comments" className="text-left sm:text-right font-medium text-sm">Comentarios</Label>
                    <Textarea
                      id="comments"
                      name="comments"
                      defaultValue={editingAnalysis.comments}
                      className="sm:col-span-3 min-h-[50px] text-sm resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="deliveryTime" className="text-left sm:text-right font-medium text-sm">Tiempo de entrega</Label>
                    <Input
                      id="deliveryTime"
                      name="deliveryTime"
                      type="text"
                      defaultValue={editingAnalysis.deliveryTime}
                      className="sm:col-span-3 h-8 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-1 sm:gap-4">
                    <Label htmlFor="show_public" className="text-left sm:text-right font-medium text-sm">Mostrar al público</Label>
                    <div className="sm:col-span-3 flex items-center space-x-2">
                      <Checkbox
                        id="show_public"
                        name="show_public"
                        defaultChecked={editingAnalysis?.show_public ?? false}
                      />
                      <span className="text-sm text-gray-600">Visible para usuarios no registrados</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 mt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setEditingAnalysis(null)} className="w-full sm:w-auto h-8 text-sm">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#3DA64A] hover:bg-[#1E5FAD] w-full sm:w-auto h-8 text-sm">
                    Guardar cambios
                  </Button>
                </div>
              </form>
              )}
            </div>
          </DialogContent>
        </Dialog>

      {/* Diálogo de edición de perfiles */}
      <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Editar Perfil</DialogTitle>
          </DialogHeader>
          {editingProfile && (
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const title = formData.get('title') as string
              const description = formData.get('description') as string
              const price = parseFloat(formData.get('price') as string)
              const tests = (formData.get('tests') as string)
                .split('\n')
                .filter(test => test.trim() !== '')

              const updatedProfile: Profile = {
                id: editingProfile.id,
                title,
                description,
                price,
                tests,
                image: editingProfile.image
              }

              console.log('Enviando actualización:', updatedProfile)
              handleUpdateProfile(updatedProfile)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                  <Label htmlFor="title" className="text-left sm:text-right font-medium">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingProfile.title}
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                  <Label htmlFor="description" className="text-left sm:text-right font-medium">Descripción</Label>
                  <Input
                    id="description"
                    name="description"
                    defaultValue={editingProfile.description}
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                  <Label htmlFor="price" className="text-left sm:text-right font-medium">Precio</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingProfile.price}
                    className="sm:col-span-3"
                    required
                    onFocus={(e) => {
                      // Seleccionar todo el texto al hacer foco para facilitar edición
                      setTimeout(() => e.target.select(), 10);
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                  <Label htmlFor="tests" className="text-left sm:text-right font-medium">Análisis incluidos</Label>
                  <Textarea
                    id="tests"
                    name="tests"
                    defaultValue={editingProfile.tests.join('\n')}
                    className="sm:col-span-3 min-h-[120px]"
                    placeholder="Un análisis por línea"
                    rows={5}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingProfile(null)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#3DA64A] hover:bg-[#1E5FAD] w-full sm:w-auto">
                  Guardar cambios
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para agregar análisis */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">🧪 Agregar nuevo análisis</DialogTitle>
              <DialogDescription>
                Configura el análisis y define su visibilidad según referencias de clientes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              
              {/* INFORMACIÓN BÁSICA */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">📋 Información Básica</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nombre del Análisis *</Label>
                    <Input 
                      placeholder="Ej: Hemograma Completo" 
                      value={newAnalysis.name} 
                      onChange={e => setNewAnalysis(a => ({ ...a, name: e.target.value }))} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Categoría *</Label>
                    <Select value={newAnalysis.category} onValueChange={(value) => setNewAnalysis(a => ({ ...a, category: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Muestra</Label>
                    <Input 
                      placeholder="Ej: Sangre venosa" 
                      value={newAnalysis.sample} 
                      onChange={e => setNewAnalysis(a => ({ ...a, sample: e.target.value }))} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Cantidad de muestra</Label>
                    <Input 
                      placeholder="Ej: 5 mL, 10 mL" 
                      value={newAnalysis.sample_quantity} 
                      onChange={e => setNewAnalysis(a => ({ ...a, sample_quantity: e.target.value }))} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Condiciones</Label>
                    <Input 
                      placeholder="Ej: 8-12 horas de ayuno" 
                      value={newAnalysis.conditions} 
                      onChange={e => setNewAnalysis(a => ({ ...a, conditions: e.target.value }))} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Tiempo de entrega</Label>
                    <Input 
                      placeholder="Ej: 2-4 horas" 
                      value={newAnalysis.deliveryTime} 
                      onChange={e => setNewAnalysis(a => ({ ...a, deliveryTime: e.target.value }))} 
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* VISIBILIDAD Y REFERENCIAS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">👥 Visibilidad del Análisis</h3>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">¿Quién puede ver este análisis?</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="visibility_public"
                          name="visibility"
                          checked={newAnalysis.visibility_type === 'public'}
                          onChange={() => setNewAnalysis(a => ({ ...a, visibility_type: 'public', allowed_references: [] }))}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="visibility_public" className="cursor-pointer">
                          🌍 <strong>Público</strong> - Todos los usuarios
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="visibility_references"
                          name="visibility"
                          checked={newAnalysis.visibility_type === 'references'}
                          onChange={() => setNewAnalysis(a => ({ ...a, visibility_type: 'references' }))}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="visibility_references" className="cursor-pointer">
                          🏢 <strong>Por Referencias Específicas</strong> - Solo clientes seleccionados
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* SELECTOR DE REFERENCIA ESPECÍFICA */}
                  {newAnalysis.visibility_type === 'references' && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                      <Label className="text-sm font-medium text-blue-800">Selecciona la referencia específica para este análisis:</Label>
                      <Select 
                        value={newAnalysis.allowed_references[0] || ''} 
                        onValueChange={(value) => setNewAnalysis(a => ({ ...a, allowed_references: [value] }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar referencia específica" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableReferences.map((reference: any) => (
                            <SelectItem key={reference.id} value={reference.id}>
                              🏢 {reference.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-blue-600">
                        💡 Solo los usuarios con esta referencia podrán ver este análisis
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* PRECIOS POR TARIFA */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">💰 Configuración de Precios</h3>
                
                {newAnalysis.visibility_type === 'public' ? (
                  /* MODO PÚBLICO - Precios simplificados */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <span>💰</span> Precio Público
                      </Label>
                      <Input 
                        placeholder="Precio para pacientes" 
                        type="number" 
                        step="0.01"
                        value={newAnalysis.price_public} 
                        onChange={e => setNewAnalysis(a => ({ ...a, price_public: e.target.value }))} 
                        className="border-green-300"
                      />
                      <p className="text-xs text-gray-500">Para pacientes y público general</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <span>🏢</span> Precio Empresarial
                      </Label>
                      <Input 
                        placeholder="Precio para médicos y empresas" 
                        type="number" 
                        step="0.01"
                        value={newAnalysis.price_business} 
                        onChange={e => setNewAnalysis(a => ({ ...a, price_business: e.target.value }))} 
                        className="border-blue-300"
                      />
                      <p className="text-xs text-gray-500">Para médicos y empresas</p>
                    </div>
                  </div>
                ) : (
                  /* MODO REFERENCIAS - Precios por tarifa específica */
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-4">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Modo Avanzado:</strong> Configura precios específicos para cada tarifa
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableTariffs
                        .filter(tariff => tariff.type === 'sale')
                        .map((tariff: any) => (
                          <div key={tariff.id} className="space-y-2">
                            <Label className="text-sm font-medium">
                              {tariff.name} {tariff.is_taxable ? '(con IGV)' : '(sin IGV)'}
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newAnalysis.tariff_prices[tariff.id] || ''}
                              onChange={e => setNewAnalysis(a => ({
                                ...a,
                                tariff_prices: {
                                  ...a.tariff_prices,
                                  [tariff.id]: e.target.value
                                }
                              }))}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* INFORMACIÓN ADICIONAL */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">📝 Información Adicional</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Protocolo</Label>
                    <Textarea 
                      placeholder="Descripción del procedimiento..." 
                      value={newAnalysis.protocol} 
                      onChange={e => setNewAnalysis(a => ({ ...a, protocol: e.target.value }))} 
                      className="mt-1 min-h-[80px]"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Sugerencias</Label>
                      <Textarea 
                        placeholder="Recomendaciones para el paciente..." 
                        value={newAnalysis.suggestions} 
                        onChange={e => setNewAnalysis(a => ({ ...a, suggestions: e.target.value }))} 
                        className="mt-1 min-h-[80px]"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Comentarios</Label>
                      <Textarea 
                        placeholder="Notas internas..." 
                        value={newAnalysis.comments} 
                        onChange={e => setNewAnalysis(a => ({ ...a, comments: e.target.value }))} 
                        className="mt-1 min-h-[80px]"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Checkbox para mostrar al público */}
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="show_public_new"
                    checked={newAnalysis.show_public || false}
                    onCheckedChange={(checked) => setNewAnalysis(a => ({ ...a, show_public: checked as boolean }))}
                  />
                  <Label htmlFor="show_public_new" className="text-sm font-medium">
                    🌐 Mostrar al público (visible para usuarios no registrados)
                  </Label>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                  onClick={handleAddAnalysis}
                >
                  💾 Guardar Análisis
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      {/* Modal para agregar perfil */}
        <Dialog open={isAddProfileModalOpen} onOpenChange={setIsAddProfileModalOpen}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Agregar nuevo perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input 
                placeholder="Título del perfil" 
                value={newProfile.title} 
                onChange={e => setNewProfile(p => ({ ...p, title: e.target.value }))} 
              />
              <Input 
                placeholder="Descripción" 
                value={newProfile.description} 
                onChange={e => setNewProfile(p => ({ ...p, description: e.target.value }))} 
              />
              <Input 
                placeholder="Precio" 
                type="number" 
                value={newProfile.price} 
                onChange={e => setNewProfile(p => ({ ...p, price: Number(e.target.value) }))} 
              />
              <Input 
                placeholder="URL de la imagen" 
                value={newProfile.image} 
                onChange={e => setNewProfile(p => ({ ...p, image: e.target.value }))} 
              />
              <div>
                <label className="block text-sm font-medium mb-2">Análisis incluidos (uno por línea):</label>
                <Textarea 
                  placeholder="Hemograma completo&#10;Glucosa&#10;Colesterol total"
                  rows={6}
                  value={newProfile.tests.join('\n')}
                  onChange={e => setNewProfile(p => ({ ...p, tests: e.target.value.split('\n').filter(test => test.trim() !== '') }))}
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6" onClick={handleAddProfile}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>

      {/* Modal de gestión de categorías */}
      <CategoriasAdminModal 
        isOpen={isCategoriasModalOpen} 
        onClose={() => {
          setIsCategoriasModalOpen(false)
          fetchCategories() // Refresh categories when modal closes
        }} 
      />

    </div>
  )
}

