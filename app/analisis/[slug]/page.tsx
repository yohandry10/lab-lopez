"use client"

import { useState, useMemo, Suspense, lazy } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { analysisData } from "@/components/digital-library"
import { useCart } from "@/contexts/cart-context"
import dynamic from 'next/dynamic'
import { Baby, Dna, Search, TestTube, Microscope, Beaker } from "lucide-react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import type { Analysis } from "@/components/digital-library"

// Cargar el formulario de manera dinámica
const AnalysisForm = dynamic(() => import("@/components/analysis-form"), {
  loading: () => <p>Cargando formulario...</p>,
  ssr: false
})

interface CartItem {
  id: number
  name: string
  price: number
  patientInfo?: any
}

const iconMap = {
  Baby,
  Dna,
  Search,
  TestTube,
  Microscope,
  Beaker
}

// Componente para la sección de artículos relacionados
const RelatedArticles = ({ articles, category }: { articles: Analysis[], category: string }) => {
  const relatedArticles = useMemo(() => {
    return articles
      .filter((a) => a.category === category)
      .slice(0, 2)
  }, [articles, category])

  if (relatedArticles.length === 0) return null

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Análisis relacionados</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {relatedArticles.map((relatedArticle) => (
          <Link
            key={relatedArticle.id}
            href={`/analisis/${relatedArticle.slug}`}
            className="block group"
          >
            <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg">
              <div className="p-4">
                <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                  {relatedArticle.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {relatedArticle.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Componente para las secciones expandibles
const ExpandableSection = ({ section, index, expandedSection, setExpandedSection }: {
  section: { title: string; content: React.ReactNode }
  index: number
  expandedSection: number | null
  setExpandedSection: (index: number | null) => void
}) => (
  <div key={index} className="border rounded-lg overflow-hidden">
    <button
      className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
      onClick={() => setExpandedSection(expandedSection === index ? null : index)}
    >
      <h2 className="text-lg font-semibold">{section.title}</h2>
      <ChevronDown
        className={`w-5 h-5 transition-transform ${
          expandedSection === index ? "transform rotate-180" : ""
        }`}
      />
    </button>
    <AnimatePresence>
      {expandedSection === index && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-6 py-4"
        >
          {section.content}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

export default function AnalysisPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { addItem } = useCart()
  
  const slug = params?.slug as string
  if (!slug) {
    router.push('/analisis')
    return null
  }

  try {
    const foundArticle = useMemo(() => analysisData.find((a) => a.slug === slug), [slug])

    if (!foundArticle) {
      router.push('/analisis')
      return null
    }

    // Memoize los iconos para evitar recreaciones innecesarias
    const heroIcons = useMemo(() => {
      return foundArticle.heroIcons?.map((iconName) => {
        const Icon = iconMap[iconName as keyof typeof iconMap]
        return Icon ? <Icon key={iconName} className="w-6 h-6" /> : null
      }) || []
    }, [foundArticle.heroIcons])

    const handleSubmit = (values: any) => {
      const item: CartItem = {
        id: foundArticle.id,
        name: foundArticle.title,
        price: 0,
        patientInfo: values
      }
      addItem(item)
      setIsFormOpen(false)
    }

    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{foundArticle.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {foundArticle.category}
              </span>
              <div className="flex items-center gap-2">
                {heroIcons}
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-12">
            <p className="text-gray-700">{foundArticle.content}</p>
          </div>

          <div className="space-y-4 mb-12">
            {foundArticle.sections?.map((section, index) => (
              <ExpandableSection
                key={index}
                section={section}
                index={index}
                expandedSection={expandedSection}
                setExpandedSection={setExpandedSection}
              />
            ))}
          </div>

          <div className="flex justify-center mb-12">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1E5FAD] hover:bg-[#3DA64A] text-white">
                  Agendar este análisis
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Agendar {foundArticle.title}</DialogTitle>
                </DialogHeader>
                <Suspense fallback={<div>Cargando...</div>}>
                  <AnalysisForm onSubmit={handleSubmit} />
                </Suspense>
              </DialogContent>
            </Dialog>
          </div>

          <Suspense fallback={<div>Cargando artículos relacionados...</div>}>
            <RelatedArticles articles={analysisData} category={foundArticle.category} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading analysis:', error)
    router.push('/analisis')
    return null
  }
} 