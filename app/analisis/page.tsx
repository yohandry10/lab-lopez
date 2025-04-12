"use client"

import { CardFooter } from "../../components/ui/card"
import { CardDescription } from "../../components/ui/card"
import { CardTitle } from "../../components/ui/card"
import { CardHeader } from "../../components/ui/card"
import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Calendar, Check, Syringe, Edit, Trash } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { AnalysisDialog } from "../../components/analysis-dialog"
import { SchedulingFlow } from "../../components/scheduling-flow"
import { SuccessDialog } from "../../components/success-dialog"
import { HeroSchedulingDialog } from "../../components/hero-scheduling-dialog"
import { useCart } from "../../contexts/cart-context"
import { Card, CardContent } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useAuth } from "../../contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"

// Lista extendida de análisis
const analysisData = [
  // A
  {
    id: 1,
    name: "ÁCIDO FÓLICO",
    price: 120.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hematología",
  },
  {
    id: 2,
    name: "ÁCIDO ÚRICO",
    price: 80.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 3,
    name: "ALANINA AMINOTRANSFERASA (ALT/TGP)",
    price: 90.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 4,
    name: "ALBÚMINA",
    price: 85.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 5,
    name: "ALDOLASA",
    price: 150.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 6,
    name: "ALFA 1 ANTITRIPSINA",
    price: 180.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 7,
    name: "ALFA FETOPROTEÍNA (AFP)",
    price: 200.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Marcadores Tumorales",
  },
  {
    id: 8,
    name: "AMILASA",
    price: 110.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 9,
    name: "ANDROSTENEDIONA",
    price: 220.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },

  // B
  {
    id: 10,
    name: "BILIRRUBINA DIRECTA",
    price: 90.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 11,
    name: "BILIRRUBINA TOTAL",
    price: 90.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 12,
    name: "BETA HCG CUANTITATIVA",
    price: 150.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },

  // C
  {
    id: 13,
    name: "CALCIO",
    price: 85.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 14,
    name: "COLESTEROL HDL",
    price: 100.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Perfil Lipídico",
  },
  {
    id: 15,
    name: "COLESTEROL LDL",
    price: 100.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Perfil Lipídico",
  },
  {
    id: 16,
    name: "COLESTEROL TOTAL",
    price: 90.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Perfil Lipídico",
  },
  {
    id: 17,
    name: "CORTISOL",
    price: 130.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 18,
    name: "CREATININA",
    price: 80.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // D
  {
    id: 19,
    name: "DENGUE, ANTICUERPOS IGG E IGM",
    price: 250.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 20,
    name: "DÍMERO D",
    price: 280.0,
    conditions: "No",
    sample: "Plasma",
    protocol: "5 mL Plasma en Tubo Tapón Azul",
    suggestions: "",
    comments: "",
    category: "Coagulación",
  },

  // E
  {
    id: 21,
    name: "ESTRADIOL",
    price: 140.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },

  // F
  {
    id: 22,
    name: "FERRITINA",
    price: 150.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hematología",
  },
  {
    id: 23,
    name: "FIBRINÓGENO",
    price: 160.0,
    conditions: "Sí",
    sample: "Plasma",
    protocol: "5 mL Plasma en Tubo Tapón Azul",
    suggestions: "",
    comments: "",
    category: "Coagulación",
  },
  {
    id: 24,
    name: "FOSFATASA ALCALINA",
    price: 90.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 25,
    name: "FÓSFORO",
    price: 85.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // G
  {
    id: 26,
    name: "GAMMA GLUTAMIL TRANSFERASA (GGT)",
    price: 95.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 27,
    name: "GLUCOSA",
    price: 70.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // H
  {
    id: 28,
    name: "HEMOGLOBINA GLICOSILADA",
    price: 130.0,
    conditions: "No",
    sample: "Sangre Total",
    protocol: "5 mL Sangre Total en Tubo Tapón Lila",
    suggestions: "",
    comments: "",
    category: "Hematología",
  },
  {
    id: 29,
    name: "HIERRO SÉRICO",
    price: 100.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hematología",
  },
  {
    id: 30,
    name: "HORMONA ESTIMULANTE DE LA TIROIDES (TSH)",
    price: 120.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 31,
    name: "HORMONA FOLÍCULO ESTIMULANTE (FSH)",
    price: 130.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 32,
    name: "HORMONA LUTEINIZANTE (LH)",
    price: 130.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },

  // I
  {
    id: 33,
    name: "INSULINA",
    price: 140.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 34,
    name: "INMUNOGLOBULINA A (IGA)",
    price: 160.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 35,
    name: "INMUNOGLOBULINA G (IGG)",
    price: 160.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 36,
    name: "INMUNOGLOBULINA M (IGM)",
    price: 160.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },

  // M
  {
    id: 37,
    name: "MAGNESIO",
    price: 85.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // P
  {
    id: 38,
    name: "POTASIO",
    price: 80.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },
  {
    id: 39,
    name: "PROGESTERONA",
    price: 140.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 40,
    name: "PROLACTINA",
    price: 140.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 41,
    name: "PROTEÍNA C REACTIVA",
    price: 110.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 42,
    name: "PROTEÍNAS TOTALES",
    price: 90.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // R
  {
    id: 43,
    name: "RABIA VIRUS, ANTICUERPOS",
    price: 350.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 44,
    name: "RECUENTO CELULAR",
    price: 120.0,
    conditions: "No",
    sample: "Sangre Total",
    protocol: "5 mL Sangre Total en Tubo Tapón Lila",
    suggestions: "",
    comments: "",
    category: "Hematología",
  },
  {
    id: 45,
    name: "(4;14) TRANSLOCACION CROMOSOMICA, (FGFR3/IGH), FISH MEDULA OSEA",
    price: 2070.0,
    conditions: "No",
    sample: "Médula Ósea",
    protocol: "5 mL Médula ósea en Heparina Sódica",
    suggestions: "",
    comments: "",
    category: "Genética",
  },
  {
    id: 46,
    name: "(4;14) TRANSLOCACION CROMOSOMICA, (FGFR3/IGH), FISH SANGRE TOTAL",
    price: 2070.0,
    conditions: "No",
    sample: "Sangre Total",
    protocol: "5 mL Sangre Total en Heparina Sódica",
    suggestions: "",
    comments: "",
    category: "Genética",
  },
  {
    id: 47,
    name: "REORDENAMIENTO BCL2, FISH TEJIDO",
    price: 2200.0,
    conditions: "No",
    sample: "Tejido",
    protocol: "Muestra de Tejido en Formol",
    suggestions: "",
    comments: "",
    category: "Genética",
  },
  {
    id: 48,
    name: "RENINA PLASMÁTICA",
    price: 280.0,
    conditions: "Sí",
    sample: "Plasma",
    protocol: "5 mL Plasma en Tubo Tapón Lila",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 49,
    name: "ROTAVIRUS, ANTÍGENO EN HECES",
    price: 180.0,
    conditions: "No",
    sample: "Heces",
    protocol: "Muestra de Heces en Frasco Estéril",
    suggestions: "",
    comments: "",
    category: "Microbiología",
  },
  {
    id: 50,
    name: "RUBEOLA IGG, ANTICUERPOS",
    price: 160.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 51,
    name: "RUBEOLA IGM, ANTICUERPOS",
    price: 160.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },

  // S
  {
    id: 52,
    name: "SALMONELLA, ANTICUERPOS",
    price: 200.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 53,
    name: "SANGRE OCULTA EN HECES",
    price: 120.0,
    conditions: "No",
    sample: "Heces",
    protocol: "Muestra de Heces en Frasco Estéril",
    suggestions: "",
    comments: "",
    category: "Microbiología",
  },
  {
    id: 54,
    name: "SARS-COV-2, ANTICUERPOS TOTALES",
    price: 250.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Inmunología",
  },
  {
    id: 55,
    name: "SODIO",
    price: 80.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // T
  {
    id: 56,
    name: "TESTOSTERONA",
    price: 140.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 57,
    name: "TIEMPO DE PROTROMBINA",
    price: 100.0,
    conditions: "No",
    sample: "Plasma",
    protocol: "5 mL Plasma en Tubo Tapón Azul",
    suggestions: "",
    comments: "",
    category: "Coagulación",
  },
  {
    id: 58,
    name: "TIEMPO DE TROMBOPLASTINA PARCIAL ACTIVADA",
    price: 100.0,
    conditions: "No",
    sample: "Plasma",
    protocol: "5 mL Plasma en Tubo Tapón Azul",
    suggestions: "",
    comments: "",
    category: "Coagulación",
  },
  {
    id: 59,
    name: "TIROGLOBULINA",
    price: 180.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 60,
    name: "TIROXINA LIBRE (T4 LIBRE)",
    price: 120.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 61,
    name: "TIROXINA TOTAL (T4)",
    price: 120.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 62,
    name: "TRANSFERRINA",
    price: 150.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hematología",
  },
  {
    id: 63,
    name: "TRIGLICÉRIDOS",
    price: 90.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Perfil Lipídico",
  },
  {
    id: 64,
    name: "TRIYODOTIRONINA (T3)",
    price: 120.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Hormonas",
  },
  {
    id: 65,
    name: "TROPONINA I",
    price: 200.0,
    conditions: "No",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // U
  {
    id: 66,
    name: "UREA",
    price: 80.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Bioquímica",
  },

  // V
  {
    id: 67,
    name: "VITAMINA B12",
    price: 150.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Nutrición",
  },
  {
    id: 68,
    name: "VITAMINA D, 25-HIDROXI",
    price: 180.0,
    conditions: "Sí",
    sample: "Suero",
    protocol: "5 mL Suero en Tubo Tapón Rojo",
    suggestions: "",
    comments: "",
    category: "Nutrición",
  },
]

// Obtener categorías únicas para el filtro
const categories = [...new Set(analysisData.map((item) => item.category))].sort()

// Definir el tipo para los perfiles
type Profile = {
  title: string
  description: string
  price: number
  image: string
  tests: string[]
}

export default function AnalisisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState<(typeof analysisData)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [localAnalysisData, setLocalAnalysisData] = useState(analysisData)
  const { addItem } = useCart()
  const router = useRouter()
  const { user } = useAuth()
  const [popularProfiles, setPopularProfiles] = useState([
    {
      title: "Perfil Básico",
      description: "Evaluación general de tu salud",
      price: 180.00,
      image: "/placeholder.svg",
      tests: [
        "Hemograma completo",
        "Glucosa",
        "Colesterol total",
        "Triglicéridos",
        "Creatinina",
        "Urea"
      ]
    },
    {
      title: "Perfil Lipídico",
      description: "Evaluación completa de grasas en sangre",
      price: 220.00,
      image: "/placeholder.svg",
      tests: [
        "Colesterol total",
        "Colesterol HDL",
        "Colesterol LDL",
        "Triglicéridos",
        "Índice aterogénico"
      ]
    },
    {
      title: "Perfil Hepático",
      description: "Evaluación de la función del hígado",
      price: 250.00,
      image: "/placeholder.svg",
      tests: [
        "TGO",
        "TGP",
        "GGT",
        "Fosfatasa alcalina",
        "Bilirrubina total",
        "Bilirrubina directa",
        "Proteínas totales"
      ]
    }
  ])

  // States for scheduling flow
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<(typeof analysisData)[0] | null>(null)
  const [patientName, setPatientName] = useState("")

  // State for hero scheduling dialog
  const [isHeroSchedulingOpen, setIsHeroSchedulingOpen] = useState(false)

  const ITEMS_PER_PAGE = 10

  // Filtrar análisis por letra, término de búsqueda y categoría
  const filteredAnalysis = localAnalysisData.filter((analysis) => {
    const matchesSearch = searchTerm ? analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    const matchesLetter = selectedLetter ? analysis.name.charAt(0).toUpperCase() === selectedLetter : true
    const matchesCategory = selectedCategory ? analysis.category === selectedCategory : true

    return matchesSearch && matchesLetter && matchesCategory
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

  const handleAddToCart = (analysis: typeof analysisData[0]) => {
    setSelectedTest(analysis)
    setIsSchedulingOpen(true)
  }

  const handleScheduleComplete = (data: { firstName: string; lastName: string }) => {
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

  const [editingAnalysis, setEditingAnalysis] = useState<typeof analysisData[0] | null>(null)

  const handleUpdateAnalysis = (updatedAnalysis: typeof analysisData[0]) => {
    setLocalAnalysisData(prevData =>
      prevData.map(item =>
        item.id === updatedAnalysis.id ? updatedAnalysis : item
      )
    )
    setEditingAnalysis(null)
  }

  const handleDeleteAnalysis = (analysis: typeof analysisData[0]) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este análisis?')) {
      setLocalAnalysisData(prevData => prevData.filter(item => item.id !== analysis.id))
    }
  }

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  const handleDeleteProfile = (index: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      setPopularProfiles(prevProfiles => prevProfiles.filter((_, i) => i !== index))
    }
  }

  const handleUpdateProfile = (updatedProfile: Profile) => {
    console.log('Perfil antes de actualizar:', updatedProfile)
    setPopularProfiles(prevProfiles => {
      const newProfiles = prevProfiles.map(profile => {
        if (profile.title === editingProfile?.title) {
          console.log('Actualizando perfil:', updatedProfile)
          return updatedProfile
        }
        return profile
      })
      console.log('Nuevos perfiles:', newProfiles)
      return newProfiles
    })
    setEditingProfile(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Updated Hero Section */}
      <section className="relative w-full h-[500px] overflow-hidden">
        {/* Background image */}
        <Image src="/lab.webp" alt="Análisis Clínicos" fill className="object-cover" priority />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-[#EAF7FF]/50" />

        {/* Content */}
        <div className="container relative h-full flex flex-col justify-between max-w-[1200px] mx-auto px-4 py-12">
          <div className="flex flex-col items-start max-w-3xl mt-auto">
            <p className="text-lg font-medium mb-4">
              <span className="text-[#2F71B8]">Más de 2500 análisis</span>{" "}
              <span className="text-gray-600">a tu disposición</span>
            </p>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight mb-6 font-sans">
              <span className="text-[#2F71B8]">Directorio</span> <span className="text-black">de análisis</span>
            </h3>
          </div>
          <div className="flex justify-end mt-auto">
            <Button
              size="lg"
              className="bg-[#2F71B8] hover:bg-[#2EB9A5] text-white px-8 py-6 h-auto text-lg transition-all duration-300 hover:shadow-lg"
              onClick={() => setIsHeroSchedulingOpen(true)}
            >
              <Syringe className="mr-2 h-5 w-5" />
              Agenda tus análisis
            </Button>
          </div>
        </div>
      </section>

      {/* Rest of the content */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Tabs para perfiles populares */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-3xl mx-auto">
            <TabsTrigger value="all">Todos los análisis</TabsTrigger>
            <TabsTrigger value="popular">Perfiles populares</TabsTrigger>
            <TabsTrigger value="covid">COVID-19</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {/* Barra de búsqueda */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por análisis"
                  className="pl-10 h-12 text-base border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-12 min-w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="h-12 px-8 bg-[#1E5FAD] hover:bg-[#3DA64A] text-base">Buscar</Button>
              </div>
            </div>

            {/* Búsqueda alfabética */}
            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-500">Búsqueda alfabética</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-9 gap-2">
                <Button
                  variant={selectedLetter === null ? "default" : "outline"}
                  className={`h-12 text-base font-medium ${
                    selectedLetter === null
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                  onClick={() => setSelectedLetter(null)}
                >
                  Todos
                </Button>
                {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                  <Button
                    key={letter}
                    variant="outline"
                    className={`h-12 text-base font-medium ${
                      selectedLetter === letter
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                    onClick={() => handleLetterClick(letter)}
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Controles de visualización */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                {filteredAnalysis.length} {filteredAnalysis.length === 1 ? "resultado" : "resultados"} encontrados
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={viewMode === "list" ? "bg-blue-50" : ""}
                  onClick={() => setViewMode("list")}
                >
                  Lista
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={viewMode === "grid" ? "bg-blue-50" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  Cuadrícula
                </Button>
              </div>
            </div>

            {/* Tabla de resultados */}
            {viewMode === "list" ? (
              <div id="analysis-table" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Nombre del análisis</th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                        Categoría
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                        Precio
                      </th>
                      <th className="w-32 text-center py-4 px-4 text-sm font-medium text-gray-500">Detalle</th>
                      <th className="w-32 text-center py-4 px-4 text-sm font-medium text-gray-500">Carrito</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentAnalyses.map((analysis) => (
                      <tr key={analysis.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm text-gray-900">
                          <div className="flex items-center justify-between">
                            <span>{analysis.name}</span>
                            {user?.user_type === "admin" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingAnalysis(analysis)}
                                className="ml-2 border-blue-200 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 text-center hidden md:table-cell">
                          {analysis.category}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900 text-center hidden md:table-cell">
                          S/. {analysis.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 min-w-[80px]"
                            onClick={() => setSelectedAnalysis(analysis)}
                          >
                            VER
                          </Button>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            size="sm"
                            className="bg-[#3DA64A] hover:bg-[#1E5FAD] min-w-[80px]"
                            onClick={() => handleAddToCart(analysis)}
                          >
                            AGREGAR
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div id="analysis-table" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentAnalyses.map((analysis) => (
                  <Card key={analysis.id} className="w-full">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{analysis.name}</CardTitle>
                        <div className="flex gap-2">
                          {user?.user_type === "admin" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingAnalysis(analysis)}
                                className="border-blue-200 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteAnalysis(analysis)}
                                className="hover:bg-red-600"
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAddToCart(analysis)}
                            className="bg-[#3DA64A] hover:bg-[#1E5FAD]"
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                      <CardDescription>Categoría: {analysis.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Precio:</strong> S/. {analysis.price.toFixed(2)}</p>
                        <p><strong>Condiciones:</strong> {analysis.conditions}</p>
                        <p><strong>Muestra:</strong> {analysis.sample}</p>
                        <p><strong>Protocolo:</strong> {analysis.protocol}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredAnalysis.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No se encontraron análisis que coincidan con tu búsqueda
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 mt-6">
                <div className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredAnalysis.length)} de {filteredAnalysis.length}{" "}
                  resultados
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 w-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <Button
                        key={index}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`h-10 w-10 ${currentPage === page ? "bg-[#1E5FAD] hover:bg-[#3DA64A]" : ""}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ) : (
                      <span key={index} className="px-2">
                        {page}
                      </span>
                    ),
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 w-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularProfiles.map((profile, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-48">
                      <Image
                        src={profile.image}
                        alt={profile.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-4">
                      <div className="flex justify-between items-center">
                        <CardTitle>{profile.title}</CardTitle>
                        {user?.user_type === "admin" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingProfile(profile)}
                              className="border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProfile(i)}
                              className="hover:bg-red-600"
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </div>
                      <CardDescription className="mt-2">{profile.description}</CardDescription>
                    </div>
                    <div className="mb-4">
                      <div className="font-medium mb-2">Incluye:</div>
                      <ul className="text-sm space-y-1">
                        {profile.tests.map((test, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-bold text-lg">S/. {profile.price.toFixed(2)}</div>
                      <div className="flex gap-2">
                        <Button
                          className="bg-[#3DA64A] hover:bg-[#1E5FAD]"
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
                              comments: ""
                            })
                          }
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="covid" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Prueba Antígeno COVID-19",
                  description: "Resultados en 15-30 minutos",
                  price: 120.0,
                  details: "Detecta proteínas del virus. Ideal para casos sintomáticos recientes.",
                  turnaround: "15-30 minutos",
                  image: "/placeholder.svg?height=200&width=300&text=Prueba%20Antígeno",
                },
                {
                  title: "Prueba PCR COVID-19",
                  description: "Estándar de oro para diagnóstico",
                  price: 280.0,
                  details: "Detecta material genético del virus. Alta precisión.",
                  turnaround: "24-48 horas",
                  image: "/placeholder.svg?height=200&width=300&text=Prueba%20PCR",
                },
                {
                  title: "Anticuerpos COVID-19",
                  description: "Evalúa respuesta inmune",
                  price: 180.0,
                  details: "Detecta anticuerpos IgG e IgM. Útil para conocer exposición previa.",
                  turnaround: "24 horas",
                  image: "/placeholder.svg?height=200&width=300&text=Anticuerpos",
                },
              ].map((test, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow card-hover"
                >
                  <div className="relative h-40">
                    <Image src={test.image || "/placeholder.svg"} alt={test.title} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle>{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-700">{test.details}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Resultados: {test.turnaround}</span>
                        </div>
                        <div className="font-bold">S/. {test.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      Más info
                    </Button>
                    <Button
                      className="bg-[#3DA64A] hover:bg-[#1E5FAD]"
                      onClick={() =>
                        handleAddToCart({
                          id: 2000 + i,
                          name: test.title,
                          price: test.price,
                          category: "Test",
                          conditions: "No especificado",
                          sample: "No especificado",
                          protocol: "No especificado",
                          suggestions: "",
                          comments: ""
                        })
                      }
                    >
                      Agregar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AnalysisDialog
        isOpen={selectedAnalysis !== null}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />

      {selectedTest && (
        <SchedulingFlow
          isOpen={isSchedulingOpen}
          onClose={() => setIsSchedulingOpen(false)}
          onComplete={handleScheduleComplete}
          testName={selectedTest.name}
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
      />

      <HeroSchedulingDialog isOpen={isHeroSchedulingOpen} onClose={() => setIsHeroSchedulingOpen(false)} />

      {editingAnalysis && (
        <Dialog open={!!editingAnalysis} onOpenChange={() => setEditingAnalysis(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Análisis</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const updatedAnalysis = {
                ...editingAnalysis,
                name: formData.get('name') as string,
                price: parseFloat(formData.get('price') as string),
                category: formData.get('category') as string,
                conditions: formData.get('conditions') as string,
                sample: formData.get('sample') as string,
                protocol: formData.get('protocol') as string,
                suggestions: formData.get('suggestions') as string,
                comments: formData.get('comments') as string,
              }
              handleUpdateAnalysis(updatedAnalysis)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingAnalysis.name}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Precio</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingAnalysis.price}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Categoría</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingAnalysis.category}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="conditions" className="text-right">Condiciones</Label>
                  <Input
                    id="conditions"
                    name="conditions"
                    defaultValue={editingAnalysis.conditions}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sample" className="text-right">Muestra</Label>
                  <Input
                    id="sample"
                    name="sample"
                    defaultValue={editingAnalysis.sample}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="protocol" className="text-right">Protocolo</Label>
                  <Textarea
                    id="protocol"
                    name="protocol"
                    defaultValue={editingAnalysis.protocol}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="suggestions" className="text-right">Sugerencias</Label>
                  <Textarea
                    id="suggestions"
                    name="suggestions"
                    defaultValue={editingAnalysis.suggestions}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comments" className="text-right">Comentarios</Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    defaultValue={editingAnalysis.comments}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setEditingAnalysis(null)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#3DA64A] hover:bg-[#1E5FAD]">
                  Guardar cambios
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de edición de perfiles */}
      <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingProfile.title}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Descripción</Label>
                  <Input
                    id="description"
                    name="description"
                    defaultValue={editingProfile.description}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Precio</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProfile.price}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tests" className="text-right">Análisis incluidos</Label>
                  <Textarea
                    id="tests"
                    name="tests"
                    defaultValue={editingProfile.tests.join('\n')}
                    className="col-span-3"
                    placeholder="Un análisis por línea"
                    rows={5}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setEditingProfile(null)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#3DA64A] hover:bg-[#1E5FAD]">
                  Guardar cambios
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

