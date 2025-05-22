"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const milestones = [
  {
    year: "2023",
    content:
      "Inicia operaciones la sede La Molina, Breña y San Juan de Miraflores; ampliando a 30, nuestros puntos de toma de muestra a nivel nacional.",
  },
  {
    year: "2022",
    content:
      "Inicia operaciones la sede San Juan de Lurigancho, ampliando a 27 nuestra red de puntos de toma de muestra, distribuidos a nivel nacional. Obtuvimos la acreditación ISO 15189, la máxima norma de calidad en laboratorio clínico, siendo el primer laboratorio clínico en Perú con el mayor número de pruebas acreditadas.",
  },
  {
    year: "2021",
    content:
      "Inicia operaciones las sedes Cañete, Chinchón, San Martín y Bellavista; sumando un total de 26 puntos de toma de muestra a nivel nacional.",
  },
  {
    year: "2020",
    content:
      "Inauguramos una renovada y rediseñada área de Microbiología, contando con el analizador MALDI-TOF MS™ para la identificación microbiana para un diagnóstico precoz de bacteriemias. Así nos convertimos en el primer laboratorio privado del país en contar con esta tecnología de vanguardia. Implementamos el servicio de procesamiento de la prueba molecular para SARS-CoV2 por PCR, con 18 puntos de toma de muestra a nivel nacional, ofreciendo el servicio mediante un agendamiento digital de citas para un flujo ordenado y diferenciado de nuestros pacientes. Implementamos la plataforma digital Syxmex 9100™ para la especialidad de hematología, permitiendo obtener la morfología digital de imágenes celulares junto con los reportes de resultados.",
  },
  {
    year: "2019",
    content:
      "Inicia operaciones las sedes Lince y San Antonio, en los distritos de Lince y Miraflores respectivamente, sumando 22 puntos de toma de muestra a nivel nacional. Concluimos exitosamente la implementación de un sistema de procesamiento de pruebas de laboratorio totalmente automatizado con la mayor tecnología de vanguardia del mercado peruano, incorporando un sistema de analizadores preanalíticos de bandas transportadoras de muestras integradas a plataformas Cobas 8000™ 100% automatizadas a nuestros procesos analíticos.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Nosotros</h2>
          <p className="text-xl font-light mb-4">Tus exámenes son nuestra prioridad.</p>
          <h3 className="text-sm text-blue-600 uppercase tracking-wider mb-4">Conócenos</h3>
          <div className="prose max-w-none space-y-4">
            <p>En Laboratorio Clínico López contamos con más de 5 años de experiencia brindando servicios de análisis clínicos con altos estándares de calidad. Somos un laboratorio automatizado que integra tecnología de última generación con un equipo humano capacitado, comprometido con el bienestar de nuestros pacientes.</p>
            <p>Atendemos diversas áreas del laboratorio clínico, incluyendo:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>✔ Bioquímica</li>
              <li>✔ Hematología</li>
              <li>✔ Inmunología</li>
              <li>✔ Microbiología</li>
              <li>✔ Parasitología</li>
              <li>✔ Uroanálisis</li>
              <li>✔ Pruebas especiales y más</li>
            </ul>
            <p>Cada resultado que entregamos es producto de un proceso riguroso, confiable y oportuno, porque entendemos que detrás de cada muestra hay una persona que merece respuestas claras y un trato digno.</p>
            <p>Nos enfocamos en brindar una experiencia de atención eficiente, ética y personalizada, tanto para pacientes particulares como para empresas que buscan mejorar la salud ocupacional de su equipo.</p>
            <p>En Laboratorio Clínico López, trabajamos todos los días con una sola misión: <strong>Cuidar tu salud con precisión, responsabilidad y compromiso.</strong></p>
          </div>
          <h4 className="text-2xl font-semibold mt-8 mb-4">MISIÓN</h4>
          <div className="prose max-w-none mb-6">
            <p>Brindar servicios de análisis clínicos confiables, precisos y oportunos mediante procesos automatizados y personal altamente calificado, comprometidos con el bienestar de nuestros pacientes y el fortalecimiento de la salud preventiva en la comunidad.</p>
          </div>
          <h4 className="text-2xl font-semibold mb-4">VISIÓN</h4>
          <div className="prose max-w-none">
            <p>Ser un laboratorio clínico de referencia en la región, reconocido por su calidad, innovación tecnológica y excelencia en el diagnóstico, contribuyendo activamente a una atención médica más efectiva y humana.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

