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
}

// Datos de fallback (se mantendrán como respaldo)
export const analysisData: Analysis[] = [
  {
    id: 1,
    title: "ZUMA test no invasivo prenatal (NIPT)",
    description: "Las pruebas prenatales convencionales que permiten detectar anomalías cromosómicas fetales requieren una muestra de vellosidades coriónicas (biopsia corial) o bien una amniocentesis.",
    image: "/emba.webp",
    category: "Análisis clínicos",
    slug: "zuma-test-prenatal",
    content: "Las pruebas prenatales convencionales que permiten detectar anomalías cromosómicas fetales requieren una muestra de vellosidades coriónicas (biopsia corial) o bien una amniocentesis. Estos procedimientos son altamente invasivos y conllevan un elevado riesgo de aborto espontáneo. A pesar de ello, constituyen pruebas confirmatorias debido a sus altos niveles de precisión y variedad de anomalías que pueden detectar. ZUMA TEST NO INVASIVO PRENATAL es una prueba prenatal no invasiva que se realiza a partir de la muestra de sangre materna y que evalúa de forma rápida y precisa la mayoría de alteraciones cromosómicas más frecuentes en el feto.",
    heroIcons: ["Baby", "Dna", "Search"],
    sections: [
      {
        title: "¿Qué detecta este análisis?",
        content: (
          <div className="space-y-4">
            <p>Esta prueba analiza el material genético (ADN) fetal libre que circula en la sangre materna y determina la presencia de alteraciones en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cromosoma 21 (Síndrome de Down)</li>
              <li>Cromosoma 18 (Síndrome de Edwards)</li>
              <li>Cromosoma 13 (Síndrome de Patau)</li>
              <li>Cromosomas sexuales (X e Y)</li>
              <li>Identificación del sexo fetal</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Sensibilidad y Especificidad:</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Trisomía</th>
                    <th className="border p-2 text-left">Sensibilidad</th>
                    <th className="border p-2 text-left">Especificidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Trisomía 21 (Síndrome de Down)</td>
                    <td className="border p-2">99.9%</td>
                    <td className="border p-2">99.9%</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Trisomía 18 (Síndrome de Edwards)</td>
                    <td className="border p-2">99.0%</td>
                    <td className="border p-2">99.9%</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Trisomía 13 (Síndrome de Patau)</td>
                    <td className="border p-2">99.9%</td>
                    <td className="border p-2">99.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      },
      {
        title: "Prueba disponible",
        content: (
          <div className="space-y-4">
            <p>El procedimiento consiste en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Extracción de sangre materna a partir de la semana 10 de gestación</li>
              <li>Análisis del ADN fetal libre circulante</li>
              <li>Detección de anomalías cromosómicas mediante tecnología de última generación</li>
              <li>Resultados con alta precisión y sin riesgos para el embarazo</li>
            </ul>
            <p>Tiempo de entrega: 5-7 días hábiles</p>
          </div>
        )
      },
      {
        title: "Indicaciones",
        content: (
          <div className="space-y-4">
            <p>Este análisis está especialmente indicado en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Edad materna avanzada (≥35 años)</li>
              <li>Screening bioquímico de alto riesgo</li>
              <li>Hallazgos ecográficos sugestivos de cromosomopatía</li>
              <li>Antecedentes de gestación previa con cromosomopatía</li>
              <li>Ansiedad materna</li>
              <li>Como alternativa a pruebas invasivas (amniocentesis o biopsia corial)</li>
            </ul>
          </div>
        )
      },
      {
        title: "Interpretación de resultados",
        content: (
          <div className="space-y-4">
            <p>La interpretación de los resultados incluye:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Evaluación del riesgo individual para cada alteración cromosómica</li>
              <li>Determinación del sexo fetal (si se solicita)</li>
              <li>Recomendaciones sobre la necesidad de pruebas confirmatorias</li>
              <li>Asesoramiento genético personalizado</li>
            </ul>
            <p className="mt-4 text-gray-700">En caso de resultado positivo, se recomienda confirmar mediante prueba invasiva (amniocentesis o biopsia corial) antes de tomar decisiones clínicas importantes.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 2,
    title: "Cofactor ristocetina Von Willebrand",
    description: "La enfermedad de Von Willebrand (EVW) es el trastorno hemorrágico hereditario (autosómico) más frecuente.",
    image: "/hemo.jpeg",
    category: "Análisis clínicos",
    slug: "cofactor-ristocetina",
    content: "La enfermedad de Von Willebrand (EVW) es el trastorno hemorrágico hereditario (autosómico) más frecuente. El Factor Von Willebrand (FVW) es una glicoproteína multimérica de alto peso molecular que interviene en la hemostasia primaria, favoreciendo la adhesión y agregación plaquetaria al unirse al receptor de la glicoproteína Ib (GPIb) de las plaquetas por las fuerzas de cizallamiento en el lugar de la lesión.",
    heroIcons: ["TestTube", "Microscope"],
    sections: [
      {
        title: "Clasificación",
        content: (
          <div className="space-y-4">
            <p>En función de los hallazgos fenotípicos, la EVW se puede clasificar de acuerdo a la Sociedad Internacional de Trombosis y Hemostasia y su Comité Científico y de Estandarización como:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tipo 1: Déficit cuantitativo parcial del FVW</li>
              <li>Tipo 2: Defectos cualitativos del FVW</li>
              <li>Tipo 3: Déficit casi total del FVW</li>
            </ul>
          </div>
        )
      },
      {
        title: "Mecanismo de acción",
        content: (
          <div className="space-y-4">
            <p>El INNOVANCE® VWF Ac es un ensayo reforzado con partículas para la determinación automática de la actividad del factor de Von Willebrand.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Las partículas de poliestireno están recubiertas de anticuerpos contra la GPIb</li>
              <li>Se añade GPIb recombinante con dos mutaciones de ganancia de función</li>
              <li>El FVW se une a la GPIb sin requerir ristocetina</li>
              <li>La unión provoca una aglutinación de partículas medible por turbidimetría</li>
            </ul>
          </div>
        )
      },
      {
        title: "Aplicaciones clínicas",
        content: (
          <div className="space-y-4">
            <p>Este análisis es útil para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Diagnóstico de la enfermedad de Von Willebrand</li>
              <li>Clasificación del tipo de EVW</li>
              <li>Monitorización del tratamiento</li>
              <li>Evaluación del riesgo hemorrágico</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: 3,
    title: "Antifosfolípidos panel completo",
    description: "Los anticuerpos antifosfolípidos conforman uno de los pilares diagnósticos del síndrome antifosfolipídico (SAF).",
    image: "/anti.jpeg",
    category: "Análisis clínicos",
    slug: "antifosfolipidos-panel",
    content: "Los anticuerpos antifosfolípidos conforman uno de los pilares diagnósticos del síndrome antifosfolipídico (SAF) junto con la predisposición a la trombosis (venosa/arterial), morbilidad en la gestación y alteraciones hematológicas (trombocitopenia/anemia hemolítica).",
    heroIcons: ["TestTube", "Microscope"],
    sections: [
      {
        title: "Criterios de clasificación",
        content: (
          <div className="space-y-4">
            <p>Los anticuerpos incluidos en los criterios de clasificación son:</p>
            <h4 className="font-semibold mt-4 mb-2">Criterios mayores:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anticoagulante lúpico (AL)</li>
              <li>Anticuerpos anticardiolipina (aCL) IgG e IgM</li>
              <li>Anti-β2 glicoproteína I (aβ2GPI) IgG e IgM</li>
            </ul>
            <h4 className="font-semibold mt-4 mb-2">Criterios menores:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cardiolipina IgA</li>
              <li>Anti-β2 glicoproteína IgA</li>
              <li>Anticuerpos anti Fosfatidilserina/Protrombina (aPS/PT) IgG e IgM</li>
            </ul>
          </div>
        )
      },
      {
        title: "Metodología",
        content: (
          <div className="space-y-4">
            <p>La determinación en el laboratorio se realiza mediante:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enzimo inmuno ensayo (ELISA) automatizado</li>
              <li>Determinación cuantitativa y específica de cada anticuerpo</li>
              <li>Verificación de positividad a las 12 semanas según recomendaciones internacionales</li>
              <li>Resultados cuantitativos superiores a los ensayos de coagulación</li>
            </ul>
          </div>
        )
      },
      {
        title: "Importancia clínica",
        content: (
          <div className="space-y-4">
            <p>La determinación de este panel completo es importante porque:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Los anticuerpos pueden variar y ser indetectables en diferentes momentos</li>
              <li>Permite detectar el Síndrome Antifosfolipídico Seronegativo (SAF-SN)</li>
              <li>Incrementa la posibilidad de detección y diagnóstico</li>
              <li>Solo la persistencia de los anticuerpos tiene importancia clínica</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: 4,
    title: "Despistaje de Alergias",
    description: "El diagnóstico de pacientes alérgicos hoy en día se ha visto revolucionado por los paneles de alérgenos preespecificados.",
    image: "/alergia.jpg",
    category: "Análisis clínicos",
    slug: "despistaje-alergias",
    content: "La determinación de la IgE específica a través de la metodología ImmunoCAP es una medida objetiva de la IgE circulante y de la sensibilización del paciente a un alérgeno específico.",
    heroIcons: ["TestTube", "Microscope"],
    sections: []
  },
  {
    id: 5,
    title: "Toxoplasma Gondii, prueba de avidez IgG",
    description: "A pesar de la existencia de marcadores de infección aguda como IgM e IgA, la persistencia de ellos hasta por dos años luego de ocurrida la infección, hace que la interpretación y evaluación del riesgo de transmisión durante el embarazo sea incierta.",
    image: "/toxo.png",
    category: "Análisis clínicos",
    slug: "toxoplasma-gondii",
    content: "La prueba de avidez de la IgG para toxoplasmosis se realiza en un sistema totalmente automatizado, basado en la técnica ELISA y aporta una variable adicional que permite ayudar a diferenciar una infección aguda o primaria de una crónica.",
    heroIcons: ["TestTube", "Microscope"],
    sections: []
  },
  {
    id: 6,
    title: "Cadenas ligeras libres séricas",
    description: "Existe una pequeña fracción de cadenas ligeras (κ y λ ) que circulan libres en condiciones fisiológicas.",
    image: "/cade.jpeg",
    category: "Análisis clínicos",
    slug: "cadenas-ligeras",
    content: "Las alteraciones de su concentración y, sobre todo, del cociente κ/λ, son características de las enfermedades causadas por la proliferación incontrolada de un clon de célula plasmática, como el mieloma múltiple.",
    heroIcons: ["TestTube", "Microscope"],
    sections: []
  },
  {
    id: 7,
    title: "Panel de anticuerpos para encefalitis autoinmune",
    description: "La encefalitis aguda es una enfermedad neurológica debilitante que se desarrolla como una encefalopatía rápidamente progresiva.",
    image: "/ence.jpeg",
    category: "Análisis clínicos",
    slug: "encefalitis-autoinmune",
    content: "Las encefalitis autoinmunes están asociadas a anticuerpos (Acs) anti células de superficie neuronales o proteínas sinápticas, desarrollándose una serie de síntomas que se asemejan a la encefalitis de origen infeccioso.",
    heroIcons: ["TestTube", "Microscope"],
    sections: []
  }
]

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
  const [articles, setArticles] = useState(analysisData) // Fallback a datos locales
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
          // Usar las imágenes originales del proyecto
          let originalImage = '/placeholder.svg';
          const titulo = String(item.titulo || '').toLowerCase();
          
          if (titulo.includes('zuma')) {
            originalImage = '/emba.webp';
          } else if (titulo.includes('cofactor') || titulo.includes('willebrand')) {
            originalImage = '/hemo.jpeg';
          } else if (titulo.includes('antifosfolípidos') || titulo.includes('antifosfolipidos')) {
            originalImage = '/anti.jpeg';
          }
          
          return {
            id: Number(item.id) || 0,
            title: String(item.titulo || ''),
            description: String(item.descripcion || ''),
            image: originalImage, // Usar imagen original del proyecto
            category: "Análisis clínicos",
            slug: String(item.titulo || '').toLowerCase().replace(/\s+/g, '-'),
            content: String(item.descripcion || ''),
            heroIcons: [],
            sections: []
          };
        });
        setArticles(mappedArticles);
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
          imagen_url: updatedArticle.image.trim() || '/placeholder.svg'
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
      
      // Actualizar estado local
      setArticles(prevArticles =>
        prevArticles.map(article =>
          article.id === updatedArticle.id ? updatedArticle : article
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
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2 text-center">Biblioteca Digital</h2>
          <p className="text-gray-500 text-base sm:text-lg text-center">Servicios diseñados para mejorar tu calidad de vida</p>
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
                        src={article.image}
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
                          <Link href={`/analisis/${article.slug}`}>
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
        <DialogContent className="sm:max-w-[500px]">
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
              image: formData.get('image') as string || editingArticle.image
            };
            
            handleUpdateArticle(updatedArticle);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingArticle?.title || ''}
                  className="w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-1 items-start gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingArticle?.description || ''}
                  className="w-full min-h-[100px]"
                  required
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
                {loading ? 'Actualizando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}

