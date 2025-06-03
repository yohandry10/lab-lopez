"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <motion.div 
        animate={{ scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image 
                src="/lopez.png"
          alt="Logo Laboratorio Lopez"
                width={200}
                height={75}
          priority
                className="object-contain" 
              />
            </motion.div>
          <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-lg font-medium text-gray-700"
          >
        Cargando laboratorio…
          </motion.p>
    </div>
  )
} 