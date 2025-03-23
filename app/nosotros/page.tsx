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
      <section className="relative py-24">
        {/* Background image */}
        <Image src="/sedes.jpg" alt="Nosotros ROE" fill className="object-cover" priority />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#EAF7FF]/50" />

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="text-[#2F71B8] mb-4 text-lg font-medium">
              Más de <span className="underline">tres millones de análisis</span> anualmente
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 font-sans">Nosotros</h3>
            <p className="text-gray-800 text-lg mb-8">
              Conoce nuestra historia, valores y compromiso con la salud desde 1953
            </p>
            <Button
              size="lg"
              className="bg-[#2F71B8] hover:bg-[#2EB9A5] text-white px-8 py-6 h-auto text-lg transition-all duration-300 hover:shadow-lg"
            >
              Nuestra historia
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-sm text-blue-600 uppercase tracking-wider mb-4">LABORATORIO CLÍNICO Lopez</h2>
              <h3 className="text-3xl font-bold mb-6">Sobre nosotros</h3>
              <div className="prose max-w-none">
                <p>
                  En el año 1953 Dr. Carlos Roe Gómez funda Laboratorio Clínico Lopez. En la actualidad, somos el primer
                  centro privado de análisis clínicos del país, ofreciendo distintas especialidades y proporcionando una
                  gran variedad de servicios diferenciados en términos de confiabilidad, seguridad y calidad de
                  atención.
                </p>
                <p className="mt-4">
                  Contamos con un staff de patólogos clínicos expertos en diagnósticos y un gran equipo de tecnólogos
                  médicos y técnicas de laboratorio especializados en métodos de laboratorio de vanguardia, atendiendo
                  anualmente 800 mil pacientes, realizando tres millones de análisis, a partir de un directorio de más
                  de 2,500 análisis clínicos.
                </p>
                <p className="mt-4">
                  Laboratorio Clínico Roe es un auténtico laboratorio de referencia multidisciplinario.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-3xl font-bold mb-6">Valores y creencias</h3>
              <div className="prose max-w-none">
                <p>
                  Somos una institución de salud fundada por sólidos valores y creencias, las mismas que son guiadas por
                  nuestros colaboradores en la atención y servicios que prestamos a nuestros pacientes e instituciones.
                </p>
                <p className="mt-4">
                  Creemos en un <span className="text-blue-600 font-medium">COMPROMISO</span> con la salud, brindado
                  confianza en nuestros resultados, innovación y empatía con nuestros pacientes.
                </p>
                <p className="mt-4">
                  Creemos en la <span className="text-blue-600 font-medium">INTEGRIDAD</span> y en adherirnos a los más
                  altos estándares de calidad como los principales ejes de medición de nuestro éxito.
                </p>
                <p className="mt-4">
                  Generamos constantemente un sentido de{" "}
                  <span className="text-blue-600 font-medium">RESPONSABILIDAD</span> en nuestras funciones con la
                  finalidad es estar siempre presentes para nuestros pacientes.
                </p>
                <p className="mt-4">
                  Desde nuestra fundación hace 70 años, mantenemos latentes nuestros valores y creencias. Son la fuerza
                  que conduce quienes fuimos, quienes somos y quienes nos esforzamos por ser, y nos mantienen enfocados
                  durante cada cambio que ha tomado lugar en el tiempo tanto en la sociedad como en nuestra
                  organización, pues sabemos que podemos hacer la diferencia en la vida de una persona.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-3xl font-bold mb-6">Política de calidad</h3>
              <div className="prose max-w-none">
                <p>
                  Laboratorio Clínico ROE brinda servicios de análisis clínicos especializados, con un equipo de
                  profesionales competentes y comprometidos, haciendo uso de tecnología de vanguardia para proporcionar
                  a nuestros pacientes y usuarios una excelente atención, calidez, oportunidad y confiabilidad en
                  nuestros resultados.
                </p>
                <p className="mt-4">
                  Estamos comprometidos a proporcionar una experiencia de calidad para alcanzar la satisfacción y
                  superar expectativas. Así mismo, nos comprometemos al cumplimiento de las normas ISO 9001, NTP ISO
                  15189 y la normativa aplicable.
                </p>
                <p className="mt-4">
                  Promovemos una cultura organizacional con enfoque hacia la gestión de riesgos y asumimos la
                  responsabilidad de desarrollar, fortalecer y mantener un sistema de gestión de calidad orientado hacia
                  la mejora continua.
                </p>
                <p className="mt-4 text-sm text-gray-500">GD-D-04 - Rev.03 - 08/11/2023</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-3xl font-bold mb-6">Staff</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold mb-4">MÉDICO</h4>
                  <ul className="space-y-2">
                    <li>Dr. Eduardo Roe Battistini</li>
                    <li>Dr. Juan Carlos Gómez de la Torre Pretell</li>
                    <li>Dr. Jorge Manuel Leiva Beraún</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">ADMINISTRATIVO</h4>
                  <ul className="space-y-2">
                    <li>Sr. Aquiles Chacón Loayza</li>
                    <li>Gerente General</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-bold mb-2">¿Te interesa trabajar con nosotros?</h4>
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/trabaja-con-nosotros">Enviar CV</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-blue-600 uppercase tracking-wider mb-4">HITOS IMPORTANTES</h2>
              <div className="relative border-l-2 border-blue-200 pl-8 space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="relative">
                    <div className="absolute -left-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                    <div className="text-2xl font-bold text-blue-900 mb-2">{milestone.year}</div>
                    <p className="text-gray-600">{milestone.content}</p>
                  </div>
                ))}
                <Button asChild variant="outline" className="ml-[-2rem]">
                  <Link href="/nosotros/historia">Ver historia completa</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

