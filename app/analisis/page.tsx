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
import { getSupabaseClient } from "../../lib/supabase-client"

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
  const [selectedAnalysis, setSelectedAnalysis] = useState<(typeof analysisData)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [localAnalysisData, setLocalAnalysisData] = useState(analysisData)
  const { addItem } = useCart()
  const router = useRouter()
  const { user } = useAuth()
  console.log("Usuario logueado:", user)
  const [popularProfiles, setPopularProfiles] = useState([
    {
      id: 1,
      title: "Perfil Básico",
      description: "Evaluación general de tu salud",
      price: 180.00,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
      id: 2,
      title: "Perfil Lipídico",
      description: "Evaluación completa de grasas en sangre",
      price: 220.00,
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "Colesterol total",
        "Colesterol HDL",
        "Colesterol LDL",
        "Triglicéridos",
        "Índice aterogénico"
      ]
    },
    {
      id: 3,
      title: "Perfil Hepático",
      description: "Evaluación de la función del hígado",
      price: 250.00,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "TGO",
        "TGP",
        "GGT",
        "Fosfatasa alcalina",
        "Bilirrubina total",
        "Bilirrubina directa",
        "Proteínas totales"
      ]
    },
    {
      id: 4,
      title: "Perfil Renal",
      description: "Evaluación completa de la función renal",
      price: 200.00,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "Creatinina",
        "Urea",
        "Ácido úrico",
        "Examen completo de orina",
        "Microalbuminuria",
        "Depuración de creatinina"
      ]
    },
    {
      id: 5,
      title: "Perfil Tiroideo",
      description: "Evaluación completa de la función tiroidea",
      price: 280.00,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "TSH",
        "T3 libre",
        "T4 libre",
        "Anticuerpos anti-TPO",
        "Anticuerpos anti-tiroglobulina"
      ]
    },
    {
      id: 6,
      title: "Perfil Diabético",
      description: "Control y seguimiento de diabetes",
      price: 190.00,
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "Glucosa en ayunas",
        "Hemoglobina glicosilada",
        "Insulina",
        "Péptido C",
        "Microalbuminuria"
      ]
    },
    {
      id: 7,
      title: "Perfil Cardiaco",
      description: "Evaluación de riesgo cardiovascular",
      price: 320.00,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "Troponina I",
        "CK-MB",
        "LDH",
        "Perfil lipídico completo",
        "Proteína C reactiva",
        "Homocisteína"
      ]
    },
    {
      id: 8,
      title: "Perfil Hormonal Femenino",
      description: "Evaluación hormonal completa para mujeres",
      price: 350.00,
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "FSH",
        "LH",
        "Estradiol",
        "Progesterona",
        "Prolactina",
        "Testosterona"
      ]
    },
    {
      id: 9,
      title: "Perfil Hormonal Masculino",
      description: "Evaluación hormonal completa para hombres",
      price: 300.00,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tests: [
        "Testosterona total",
        "Testosterona libre",
        "PSA total",
        "PSA libre",
        "LH",
        "FSH"
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

  const handleUpdateAnalysis = async (updatedAnalysis: typeof analysisData[0]) => {
    const supabase = getSupabaseClient();
    // Intentar actualizar en la tabla 'analyses' (ajusta el nombre si es diferente)
    const { data, error } = await supabase
      .from("analyses")
      .update({
        name: updatedAnalysis.name,
        price: updatedAnalysis.price,
        category: updatedAnalysis.category,
        conditions: updatedAnalysis.conditions,
        sample: updatedAnalysis.sample,
        protocol: updatedAnalysis.protocol,
        suggestions: updatedAnalysis.suggestions,
        comments: updatedAnalysis.comments,
      })
      .eq("id", updatedAnalysis.id)
      .select()
      .single();

    if (error) {
      alert("Error al guardar en Supabase: " + error.message)
      return;
    }
    // Usar el análisis actualizado directamente en lugar del dato de Supabase
    setLocalAnalysisData(prevData =>
      prevData.map(item =>
        item.id === updatedAnalysis.id ? updatedAnalysis : item
      )
    )
    setEditingAnalysis(null)
  }



  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  const handleDeleteProfile = (index: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      setPopularProfiles(prevProfiles => prevProfiles.filter((_, i) => i !== index))
    }
  }

  const handleUpdateProfile = async (updatedProfile: Profile) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        title: updatedProfile.title,
        description: updatedProfile.description,
        price: updatedProfile.price,
        image: updatedProfile.image,
        tests: updatedProfile.tests,
      })
      .eq("id", updatedProfile.id)
      .select()
      .single();
    if (error) {
      alert("Error al guardar perfil en Supabase: " + error.message);
      return;
    }
    setPopularProfiles(prevProfiles =>
      prevProfiles.map(profile =>
        profile.id === updatedProfile.id ? updatedProfile : profile
      )
    );
    setEditingProfile(null);
  }

  // Mostrar todos los análisis por defecto si el usuario es admin y no hay búsqueda activa
  const mostrarTodos = user && user.user_type === "admin" && !searchTerm && !selectedCategory && !selectedLetter;
  const analisisParaMostrar = mostrarTodos ? localAnalysisData : filteredAnalysis;

  useEffect(() => {
    async function fetchProfiles() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error al cargar perfiles desde Supabase:", error.message);
        return;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        try {
          // Casting directo y seguro
          const profiles = data.map((profile: any) => ({
            id: profile.id || Math.random(),
            title: profile.title || '',
            description: profile.description || '',
            price: Number(profile.price) || 0,
            image: profile.image || '',
            tests: Array.isArray(profile.tests) ? profile.tests : []
          })) as Profile[];
          
          setPopularProfiles(profiles);
        } catch (e) {
          console.error("Error procesando perfiles:", e);
          // Mantener los datos locales si hay error
        }
      }
    }
    fetchProfiles();
  }, []);

  // 1. Estado para el modal de agregar análisis
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAnalysis, setNewAnalysis] = useState({
    name: '',
    price: 0,
    conditions: '',
    sample: '',
    protocol: '',
    suggestions: '',
    comments: '',
    category: '',
  });

  // 2. Función para agregar análisis
  const handleAddAnalysis = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("analyses")
      .insert([newAnalysis])
      .select()
      .single();
    if (error) {
      alert("Error al agregar análisis: " + error.message);
      return;
    }
    // Casting más explícito y seguro
    const newAnalysisData = {
      id: Number(data?.id) || Date.now(),
      name: String(data?.name || newAnalysis.name),
      price: Number(data?.price || newAnalysis.price),
      conditions: String(data?.conditions || newAnalysis.conditions),
      sample: String(data?.sample || newAnalysis.sample),
      protocol: String(data?.protocol || newAnalysis.protocol),
      suggestions: String(data?.suggestions || newAnalysis.suggestions),
      comments: String(data?.comments || newAnalysis.comments),
      category: String(data?.category || newAnalysis.category),
    };
    setLocalAnalysisData(prev => [...prev, newAnalysisData]);
    setIsAddModalOpen(false);
    setNewAnalysis({
      name: '', price: 0, conditions: '', sample: '', protocol: '', suggestions: '', comments: '', category: '',
    });
  };

  // 3. Modifica handleDeleteAnalysis para borrar en Supabase
  const handleDeleteAnalysis = async (analysis: typeof analysisData[0]) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este análisis?')) return;
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("analyses").delete().eq("id", analysis.id);
    if (error) {
      alert("Error al eliminar análisis: " + error.message);
      return;
    }
    setLocalAnalysisData(prevData => prevData.filter(item => item.id !== analysis.id));
  };

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
              Agenda tus análisis
            </Button>
          </div>
        </div>
      </section>

      {/* Rest of the content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Tabs para perfiles populares */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-3xl mx-auto bg-gray-100 p-1 rounded-xl h-12 sm:h-14 flex relative overflow-hidden">
            {/* Underline animado */}
            <span id="tab-underline" className="absolute bottom-0 left-0 h-1 w-1/3 bg-gradient-to-r from-[#1E5FAD] via-[#3DA64A] to-[#1E5FAD] rounded-full transition-transform duration-500 ease-out z-0" style={{transform: `translateX(var(--tab-underline-x,0%))`}} />
            {/* Tabs con gradiente animado y rebote */}
            <TabsTrigger 
              value="all" 
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E5FAD] data-[state=active]:to-[#3DA64A] data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 data-[state=active]:ring-2 data-[state=active]:ring-[#3DA64A] data-[state=active]:ring-offset-2 transform hover:scale-105 hover:shadow-lg relative z-10 animate-tab-bounce"
              onMouseEnter={() => { document.documentElement.style.setProperty('--tab-underline-x', '0%') }}
            >
              <span className="hidden sm:inline">Todos los análisis</span>
              <span className="sm:hidden">Todos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E5FAD] data-[state=active]:to-[#3DA64A] data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 data-[state=active]:ring-2 data-[state=active]:ring-[#3DA64A] data-[state=active]:ring-offset-2 transform hover:scale-105 hover:shadow-lg relative z-10 animate-tab-bounce"
              onMouseEnter={() => { document.documentElement.style.setProperty('--tab-underline-x', '100%') }}
            >
              <span className="hidden sm:inline">Perfiles populares</span>
              <span className="sm:hidden">Perfiles</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {/* Barra de búsqueda */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por análisis"
                  className="pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-[#1E5FAD] focus:ring-[#1E5FAD] transition-all duration-300 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-10 sm:h-12 w-full sm:w-auto sm:min-w-[180px] border-gray-300 focus:border-[#1E5FAD] focus:ring-[#1E5FAD] transition-all duration-300">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="focus:bg-[#1E5FAD] focus:text-white">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="focus:bg-[#1E5FAD] focus:text-white transition-colors duration-200">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="h-10 sm:h-12 px-4 sm:px-8 bg-[#1E5FAD] hover:bg-[#3DA64A] text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Buscar
                </Button>
              </div>
            </div>

            {/* Búsqueda alfabética */}
            <div className="space-y-3 mb-6">
              <div className="text-xs sm:text-sm text-gray-500">Búsqueda alfabética</div>
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10 gap-1 sm:gap-2">
                <Button
                  variant={selectedLetter === null ? "default" : "outline"}
                  className={`h-8 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${
                    selectedLetter === null
                      ? "bg-[#1E5FAD] hover:bg-[#3DA64A] shadow-lg scale-105"
                      : "bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E5FAD] hover:from-[#1E5FAD] hover:to-[#3DA64A] hover:text-white border-[#1E5FAD]/30 hover:border-[#1E5FAD] hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedLetter(null)}
                >
                  <span className="hidden sm:inline">Todos</span>
                  <span className="sm:hidden">*</span>
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

            {/* Resultados de búsqueda - Solo mostrar cuando hay búsqueda activa */}
            {analisisParaMostrar.length > 0 ? (
              <div className="space-y-6">
                {/* Contador de resultados */}
                <div className="bg-white rounded-lg p-4 border border-[#1E5FAD]/20">
                  <p className="text-[#1E5FAD] font-medium">
                    {analisisParaMostrar.length} {analisisParaMostrar.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedCategory && ` en ${selectedCategory}`}
                    {selectedLetter && ` que comienzan con "${selectedLetter}"`}
                  </p>
                </div>

                {/* Tabla de resultados */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre del análisis
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoría
                          </th>
                          {user && (user.user_type === "doctor" || user.user_type === "company" || user.user_type === "admin") && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Precio
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detalle
                          </th>
                          {user && (user.user_type === "doctor" || user.user_type === "company" || user.user_type === "admin") && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Carrito
                            </th>
                          )}
                          {user && user.user_type === "admin" && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Editar
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentAnalyses.map((analysis) => (
                          <tr key={analysis.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{analysis.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {analysis.category}
                              </span>
                            </td>
                            {user && (user.user_type === "doctor" || user.user_type === "company" || user.user_type === "admin") && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                S/. {analysis.price.toFixed(2)}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="outline"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={() => setSelectedAnalysis(analysis)}
                              >
                                VER
                              </Button>
                            </td>
                            {user && (user.user_type === "doctor" || user.user_type === "company" || user.user_type === "admin") && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  className="bg-[#3DA64A] hover:bg-[#1E5FAD]"
                                  onClick={() => handleAddToCart(analysis)}
                                >
                                  Agregar
                                </Button>
                              </td>
                            )}
                            {user && user.user_type === "admin" && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                  onClick={() => setEditingAnalysis(analysis)}
                                >
                                  Editar
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Paginación - Solo si hay muchos resultados */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 sm:mt-8">
                    <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                      Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, analisisParaMostrar.length)} de {analisisParaMostrar.length} resultados
                    </div>
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-300"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <div className="flex space-x-1">
                        {getPageNumbers().map((page, index) => (
                          <Button
                            key={index}
                            variant={currentPage === page ? "default" : "outline"}
                            className={`min-w-[40px] ${
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-300"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (searchTerm || selectedCategory || selectedLetter) && analisisParaMostrar.length === 0 ? (
              /* No hay resultados */
              <div className="text-center py-10 sm:py-12 bg-gradient-to-br from-red-50 to-orange-100 rounded-xl border border-red-200">
                <div className="max-w-md sm:max-w-lg mx-auto px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-red-600 mb-3">
                    No se encontraron resultados
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
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
                    className="bg-[#1E5FAD] hover:bg-[#3DA64A]"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </div>
            ) : (
              /* Mensaje de bienvenida - Solo cuando NO hay búsqueda */
              <div className="text-center py-10 sm:py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-[#1E5FAD]/20">
                <div className="max-w-md sm:max-w-lg mx-auto px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1E5FAD] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#1E5FAD] mb-3">
                    Encuentra el análisis que necesitas
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Utiliza el buscador o selecciona una categoría para encontrar rápidamente el análisis clínico que estás buscando.
                    Tenemos más de 200 análisis disponibles para ti.
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-base sm:text-lg text-gray-700">
                      🔬 Análisis de laboratorio con tecnología de vanguardia
                    </div>
                    <div className="text-base sm:text-lg text-gray-700">
                      📋 Más de 15 categorías especializadas disponibles
                    </div>
                    <div className="text-base sm:text-lg text-gray-700">
                      ⚡ Resultados rápidos y precisos
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularProfiles.map((profile, i) => (
                <Card
                  key={i}
                  className="overflow-hidden transition-all duration-300 shadow hover:shadow-2xl hover:scale-[1.03] hover:border-[#1E5FAD] border border-transparent group"
                >
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
                      <div className="font-bold text-lg">{user && (user.user_type === "doctor" || user.user_type === "company" || user.user_type === "admin") ? `S/. ${profile.price.toFixed(2)}` : ''}</div>
                      <div className="flex gap-2">
                          {/* Botón WhatsApp */}
                          <Button
                            variant="outline"
                            className="bg-[#25d366] hover:bg-[#128C7E] text-white border-[#25d366] transition-all duration-200 group-hover:scale-105"
                            onClick={() => {
                              const message = `Hola, estoy interesado en el ${profile.title}. ¿Podrían darme más información?`
                              const whatsappUrl = `https://wa.me/51900649599?text=${encodeURIComponent(message)}`
                              window.open(whatsappUrl, '_blank')
                            }}
                          >
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.079.549 4.090 1.595 5.945L0 24l6.256-1.623c1.783.986 3.821 1.514 5.939 1.514 6.624 0 11.99-5.367 11.99-11.988C24.186 5.367 18.641.001 12.017.001zM12.017 21.989c-1.737 0-3.449-.434-4.96-1.263l-.356-.213-3.675.964.983-3.595-.233-.372C2.69 15.963 2.201 14.018 2.201 11.987c0-5.411 4.404-9.815 9.816-9.815 2.618 0 5.082 1.021 6.941 2.88 1.858 1.858 2.88 4.322 2.88 6.941-.001 5.411-4.406 9.816-9.821 9.816zm5.384-7.348c-.295-.148-1.744-.861-2.014-.958-.269-.098-.465-.148-.661.148-.197.295-.762.958-.934 1.155-.172.197-.344.221-.639.074-.295-.148-1.244-.459-2.37-1.462-.875-.781-1.465-1.746-1.637-2.041-.172-.295-.018-.455.129-.602.132-.131.295-.344.443-.516.148-.172.197-.295.295-.492.098-.197.049-.369-.025-.516-.074-.148-.661-1.591-.906-2.18-.238-.574-.479-.496-.661-.504-.172-.008-.369-.01-.565-.01-.197 0-.516.074-.787.369-.271.295-1.034 1.01-1.034 2.463 0 1.453 1.059 2.857 1.207 3.054.148.197 2.080 3.176 5.041 4.456.705.305 1.256.487 1.686.623.708.225 1.353.193 1.863.117.568-.084 1.744-.713 1.989-1.402.246-.689.246-1.279.172-1.402-.074-.123-.271-.197-.566-.345z"/>
                            </svg>
                            Consultar por WhatsApp
                          </Button>
                          {/* Botón Agregar solo para usuarios logueados tipo doctor/company/admin */}
                        {user && (user.user_type === "doctor" || user.user_type === "company" || user.user_type === "admin") && (
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
                        )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
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
        user={user}
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

      {/* Modal para agregar análisis */}
      {isAddModalOpen && (
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nuevo análisis</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Nombre" value={newAnalysis.name} onChange={e => setNewAnalysis(a => ({ ...a, name: e.target.value }))} />
              <Input placeholder="Precio" type="number" value={newAnalysis.price} onChange={e => setNewAnalysis(a => ({ ...a, price: Number(e.target.value) }))} />
              <Input placeholder="Condiciones" value={newAnalysis.conditions} onChange={e => setNewAnalysis(a => ({ ...a, conditions: e.target.value }))} />
              <Input placeholder="Muestra" value={newAnalysis.sample} onChange={e => setNewAnalysis(a => ({ ...a, sample: e.target.value }))} />
              <Input placeholder="Protocolo" value={newAnalysis.protocol} onChange={e => setNewAnalysis(a => ({ ...a, protocol: e.target.value }))} />
              <Input placeholder="Sugerencias" value={newAnalysis.suggestions} onChange={e => setNewAnalysis(a => ({ ...a, suggestions: e.target.value }))} />
              <Input placeholder="Comentarios" value={newAnalysis.comments} onChange={e => setNewAnalysis(a => ({ ...a, comments: e.target.value }))} />
              <Input placeholder="Categoría" value={newAnalysis.category} onChange={e => setNewAnalysis(a => ({ ...a, category: e.target.value }))} />
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleAddAnalysis}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* En el render, justo antes de la tabla de análisis: */}
      {user && user.user_type === "admin" && (
        <Button className="mb-4 bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsAddModalOpen(true)}>
          + Agregar análisis
        </Button>
      )}
    </div>
  )
}

