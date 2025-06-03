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
  <div className="relative w-full sm:w-auto">
    <Link
      href={href}
      className="flex flex-col items-center justify-center
                 w-48 h-48 sm:w-56 sm:h-56
                 bg-[#1e5fad] hover:bg-[#1e5fad]/90
                 rounded-full text-white
                 transition-colors group relative z-10 shadow-lg hover:shadow-xl"
    >
      <Icon className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
      <span className="text-lg sm:text-xl font-bold text-center px-2">{label}</span>
    </Link>
    <div
      className="absolute -left-3 sm:-left-5 top-1/2
                 w-10 h-10 sm:w-12 sm:h-12 bg-[#1e5fad]/50
                 transform rotate-45 -translate-y-1/2 z-0 hidden sm:block"
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
            className="bg-[#f3f9fe] py-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="container mx-auto px-4">
              <div className="bg-[#f3f9fe] shadow-lg rounded-lg p-6 sm:p-8 relative -mt-12 sm:-mt-16 z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="md:col-span-1 text-center md:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Consulta tus resultados</h2>
                    <p className="text-xs sm:text-sm text-blue-600">Revisa el estado y detalle de tus análisis</p>
                  </div>

                  <div className="md:col-span-3 flex flex-col items-center gap-8 mt-6 md:mt-0 md:flex-row md:justify-around lg:justify-between md:px-0 lg:px-8">
                    <UserTypeLink href="/resultados?type=patient" icon={User} label="Pacientes" />
                    <UserTypeLink href="/login" icon={Stethoscope} label="Médicos" />
                    <UserTypeLink href="/login" icon={Building2} label="Empresas" />
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

