"use client"

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { ParallaxProvider } from "react-scroll-parallax"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { User, Stethoscope, Building2, TestTubes } from "lucide-react"
import { Button } from "@/components/ui/button"

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-96 bg-[#f3f9fe]">
    <div className="relative w-24 h-24">
      {/* Tubo de ensayo */}
      <div className="absolute w-4 h-16 bg-white border-2 border-[#1e5fad] rounded-b-lg left-1/2 -translate-x-1/2">
        {/* Líquido animado */}
        <div className="absolute bottom-0 w-full bg-[#1e5fad] rounded-b-lg animate-wave" style={{ height: '60%' }}></div>
      </div>
      {/* Burbujas */}
      <div className="absolute w-1 h-1 bg-white rounded-full left-[45%] bottom-6 animate-bubble1"></div>
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full left-[55%] bottom-8 animate-bubble2"></div>
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes bubble1 {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes bubble2 {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-25px); opacity: 0; }
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        .animate-bubble1 {
          animation: bubble1 2s ease-in-out infinite;
        }
        .animate-bubble2 {
          animation: bubble2 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  </div>
)

// Lazy load components with no SSR
const HeroSlider = dynamic(() => import("@/components/hero-slider"), { ssr: false })
const MainServices = dynamic(() => import("@/components/main-services"), { ssr: false })
const QualityCommitment = dynamic(() => import("@/components/quality-commitment"), { ssr: false })
const DigitalLibrary = dynamic(() => import("@/components/digital-library"), { ssr: false })

// Memoized user type link component
const UserTypeLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <div className="relative">
    <Link
      href={href}
      className="flex flex-col items-center justify-center
                 w-56 h-56
                 bg-[#1e5fad] hover:bg-[#1e5fad]/90
                 rounded-full text-white
                 transition-colors group relative z-10"
    >
      <Icon className="h-16 w-16 mb-4" />
      <span className="text-xl font-bold">{label}</span>
    </Link>
    <div
      className="absolute -left-5 top-1/2
                 w-12 h-12 bg-[#1e5fad]
                 transform rotate-45 -translate-y-1/2 z-0"
    ></div>
  </div>
)

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-screen bg-[#f3f9fe] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

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
              <div className="bg-[#f3f9fe] shadow-lg rounded-lg p-8 relative -mt-16 z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="md:col-span-1 text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Consulta tus resultados</h2>
                    <p className="text-sm text-blue-600">Revisa el estado y detalle de tus análisis</p>
                  </div>

                  <div className="md:col-span-3 flex justify-between px-8 gap-8">
                    <UserTypeLink href="/pacientes" icon={User} label="Pacientes" />
                    <UserTypeLink href="/medicos" icon={Stethoscope} label="Médicos" />
                    <UserTypeLink href="/empresas" icon={Building2} label="Empresas" />
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
            <DigitalLibrary />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ParallaxProvider>
  )
}

