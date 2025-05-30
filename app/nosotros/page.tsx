"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useState, useEffect } from "react"

interface AboutContent {
  id: number
  titulo_principal: string
  subtitulo: string
  texto_conocenos: string
  descripcion_principal: string
  areas_texto: string
  areas_lista: string[]
  texto_proceso: string
  texto_experiencia: string
  mision_titulo: string
  mision_texto: string
  vision_titulo: string
  vision_texto: string
  valores_titulo: string
  valores_lista: string[]
  is_active: boolean
}

export default function NosotrosPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)

  // Datos fallback
  const fallbackData = {
    titulo_principal: "Nosotros",
    subtitulo: "Tus exámenes son nuestra prioridad.",
    texto_conocenos: "Conócenos",
    descripcion_principal: "En Laboratorios López, nos dedicamos a brindar servicios de análisis clínicos de alta calidad con más de 20 años de experiencia en el sector salud. Nuestro compromiso es proporcionar resultados precisos y confiables que contribuyan al diagnóstico y tratamiento médico.",
    areas_texto: "Atendemos diversas áreas del laboratorio clínico, incluyendo:",
    areas_lista: ["Bioquímica", "Hematología", "Inmunología", "Microbiología", "Parasitología", "Uroanálisis", "Pruebas especiales y más"],
    texto_proceso: "Nuestro proceso se caracteriza por mantener los más altos estándares de calidad, desde la toma de muestra hasta la entrega de resultados, garantizando la trazabilidad y confidencialidad en cada etapa.",
    texto_experiencia: "Con más de dos décadas de experiencia, hemos logrado posicionarnos como un laboratorio de referencia en la región, atendiendo tanto a pacientes particulares como a instituciones de salud.",
    mision_titulo: "MISIÓN",
    mision_texto: "Brindar servicios de laboratorio clínico con excelencia científica y tecnológica, contribuyendo al diagnóstico médico oportuno y confiable, con un equipo humano comprometido con la calidad y el servicio al paciente.",
    vision_titulo: "VISIÓN", 
    vision_texto: "Ser reconocidos como el laboratorio clínico líder en la región, destacando por nuestra innovación tecnológica, calidad en el servicio y compromiso con la salud de nuestros pacientes.",
    valores_titulo: "VALORES",
    valores_lista: ["Calidad y precisión en todos nuestros procesos", "Compromiso con la salud de nuestros pacientes", "Innovación y actualización tecnológica constante", "Profesionalismo y ética en el servicio", "Confidencialidad y respeto por la privacidad"]
  }

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    const supabase = getSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("is_active", true)
        .single()

      if (error) {
        // Si la tabla no existe o no hay datos, usar fallback silenciosamente
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log("ℹ️ Tabla about_content no existe, usando datos fallback")
        } else {
          console.log("ℹ️ No hay contenido personalizado, usando datos fallback")
        }
        return
      }

      if (data) {
        // Convertir de manera segura los datos de Supabase
        const aboutData: AboutContent = {
          id: Number(data.id) || 0,
          titulo_principal: String(data.titulo_principal || fallbackData.titulo_principal),
          subtitulo: String(data.subtitulo || fallbackData.subtitulo),
          texto_conocenos: String(data.texto_conocenos || fallbackData.texto_conocenos),
          descripcion_principal: String(data.descripcion_principal || fallbackData.descripcion_principal),
          areas_texto: String(data.areas_texto || fallbackData.areas_texto),
          areas_lista: Array.isArray(data.areas_lista) ? data.areas_lista : fallbackData.areas_lista,
          texto_proceso: String(data.texto_proceso || fallbackData.texto_proceso),
          texto_experiencia: String(data.texto_experiencia || fallbackData.texto_experiencia),
          mision_titulo: String(data.mision_titulo || fallbackData.mision_titulo),
          mision_texto: String(data.mision_texto || fallbackData.mision_texto),
          vision_titulo: String(data.vision_titulo || fallbackData.vision_titulo),
          vision_texto: String(data.vision_texto || fallbackData.vision_texto),
          valores_titulo: String(data.valores_titulo || fallbackData.valores_titulo),
          valores_lista: Array.isArray(data.valores_lista) ? data.valores_lista : fallbackData.valores_lista,
          is_active: Boolean(data.is_active)
        }
        setAboutContent(aboutData)
      }
    } catch (err) {
      console.log("ℹ️ Error al cargar contenido, usando datos fallback")
    }
  }

  // Usar datos de BD si están disponibles, sino fallback
  const displayData = aboutContent || fallbackData

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">{displayData.titulo_principal}</h2>
          <p className="text-xl font-light mb-4">{displayData.subtitulo}</p>
          <h3 className="text-sm text-blue-600 uppercase tracking-wider mb-4">{displayData.texto_conocenos}</h3>
          <div className="prose max-w-none space-y-4">
            <p>{displayData.descripcion_principal}</p>
            <p>{displayData.areas_texto}</p>
            <ul className="list-disc pl-6 space-y-1">
              {displayData.areas_lista.map((area, index) => (
                <li key={index}>✔ {area}</li>
              ))}
            </ul>
            <p>{displayData.texto_proceso}</p>
            <p>{displayData.texto_experiencia}</p>
            <p>En Laboratorio Clínico López, trabajamos todos los días con una sola misión: <strong>Cuidar tu salud con precisión, responsabilidad y compromiso.</strong></p>
          </div>
          <h4 className="text-2xl font-semibold mt-8 mb-4">{displayData.mision_titulo}</h4>
          <div className="prose max-w-none mb-6">
            <p>{displayData.mision_texto}</p>
          </div>
          <h4 className="text-2xl font-semibold mb-4">{displayData.vision_titulo}</h4>
          <div className="prose max-w-none">
            <p>{displayData.vision_texto}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

