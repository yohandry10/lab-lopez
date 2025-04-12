"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [])

  // No renderizar nada en el servidor o si no está montado
  if (!isMounted) return null
  if (!isLoading) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#ffffff'
      }}
    >
      {/* Figura abstracta mejorada */}
      <motion.div
        className="relative w-40 h-40 mb-8"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        style={{
          background: 'radial-gradient(circle, rgba(173, 216, 230, 0.3), rgba(192, 192, 192, 0.1))',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(173, 216, 230, 0.3)'
        }}
      />

      {/* Líneas y símbolos clínicos */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-300 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0.4
            }}
            animate={{
              x: [null, Math.random() * 100 + '%'],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Partículas refinadas */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-100 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0.1
            }}
            animate={{
              y: [null, Math.random() * 100 + '%'],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Texto informativo */}
      <motion.p 
        className="mt-4 font-medium"
        style={{ color: '#1e5fad', fontSize: '1.2rem', fontFamily: 'Arial, sans-serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Cargando sistema de análisis clínico...
      </motion.p>
    </div>
  )
} 