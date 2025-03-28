"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Microscope, TestTube, Beaker, Baby, Dna, Search } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"

export type Analysis = {
  id: number
  title: string
  description: string
  image: string
  category: string
  slug: string
  content: string
  heroIcons?: string[]
  sections?: {
    title: string
    content: React.ReactNode
  }[]
}

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

export const articles = analysisData.map(analysis => ({
  ...analysis,
  date: new Date().toISOString()
}))

export default function DigitalLibrary() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Calcular los artículos visibles (siempre 3)
  const visibleArticles = useMemo(() => {
    const endIndex = currentIndex + 3
    return analysisData.slice(currentIndex, endIndex)
  }, [currentIndex])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= analysisData.length - 2 ? 0 : nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1
      return nextIndex < 0 ? analysisData.length - 3 : nextIndex
    })
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-light text-gray-900 mb-2">Biblioteca Digital</h2>
          <p className="text-gray-500 text-lg">Servicios diseñados para mejorar tu calidad de vida</p>
        </div>

        <div className="relative mx-16">
          <div className="flex gap-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {visibleArticles.map((analysis) => (
                <motion.div
                  key={analysis.id}
                  className="w-1/3 flex-shrink-0"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={analysis.image}
                        alt={analysis.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={true}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1E5FAD] text-white px-4 py-1 rounded-full text-sm">
                          {analysis.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{analysis.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{analysis.description}</p>
                      <div className="flex justify-end">
                        <Link 
                          href={`/analisis/${analysis.slug}`}
                          className="text-[#1E5FAD] hover:text-[#1E5FAD]/90 font-medium"
                        >
                          Leer más
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={prevSlide}
            className="absolute -left-16 top-1/2 -translate-y-1/2 bg-[#1E5FAD] hover:bg-[#1E5FAD]/90 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-16 top-1/2 -translate-y-1/2 bg-[#1E5FAD] hover:bg-[#1E5FAD]/90 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

