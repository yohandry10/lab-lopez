"use client"

import dynamic from 'next/dynamic'
import { ParallaxProvider } from 'react-scroll-parallax'
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { User, Stethoscope, Building2, TestTubes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/image-gallery"

// Lazy load components with no SSR
const HeroSlider = dynamic(() => import("@/components/hero-slider"), { ssr: false })
const MainServices = dynamic(() => import("@/components/main-services"), { ssr: false })
const QualityCommitment = dynamic(() => import("@/components/quality-commitment"), { ssr: false })
const DigitalLibrary = dynamic(() => import("@/components/digital-library"), { ssr: false })

// Memoized user type link component
const UserTypeLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <div className="relative group flex-1 max-w-[280px]">
    <Link
      href={href}
      className="flex flex-col items-center justify-center
                 w-full h-32 sm:h-40 md:h-48 lg:h-56
                 bg-[#1e5fad] hover:bg-[#1e5fad]/90
                 rounded-full text-white
                 transition-all duration-300 group relative z-10
                 hover:scale-105 hover:shadow-2xl
                 border-4 border-white shadow-lg"
    >
      <Icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 mb-2 sm:mb-3 md:mb-4" />
      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center px-2">
        {label}
      </span>
    </Link>
    {/* Decorative elements */}
    <div
      className="absolute -left-2 sm:-left-3 md:-left-5 top-1/2
                 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-[#1e5fad]
                 transform rotate-45 -translate-y-1/2 z-0
                 opacity-80 group-hover:opacity-100 transition-all duration-300"
    ></div>
  </div>
)

export default function Home() {
  return (
    <ParallaxProvider>
      <AnimatePresence mode="sync">
        <motion.div
          className="flex min-h-screen flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSlider />

          <motion.section
            className="bg-[#f3f9fe] py-4 sm:py-6 md:py-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="container mx-auto px-3 sm:px-4 md:px-6">
              <div className="bg-[#f3f9fe] shadow-lg rounded-lg p-4 sm:p-6 md:p-8 relative -mt-8 sm:-mt-12 md:-mt-16 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-center">
                  {/* Texto descriptivo */}
                  <div className="lg:col-span-1 text-center lg:text-left order-1 lg:order-none">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                      Consulta tus resultados
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-600">
                      Revisa el estado y detalle de tus análisis
                    </p>
                  </div>

                  {/* Botones circulares */}
                  <div className="lg:col-span-3 order-2 lg:order-none">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:px-4 xl:px-8">
                      <UserTypeLink href="/resultados?type=patient" icon={User} label="Pacientes" />
                      <UserTypeLink href="/login" icon={Stethoscope} label="Médicos" />
                      <UserTypeLink href="/login" icon={Building2} label="Empresas" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MainServices />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <QualityCommitment />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <ImageGallery />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <DigitalLibrary />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ParallaxProvider>
  )
}

