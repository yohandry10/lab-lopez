"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    image: "/dr1.jpg",
    title: "Desde 1953",
    subtitle: "cuidamos de ti y tu familia",
    description: "70 años juntos",
    buttonText: "Consulta tus resultados",
    buttonLink: "/resultados",
  },
  {
    id: 2,
    image: "/lab.webp",
    title: "Tecnología de",
    subtitle: "vanguardia",
    description: "Resultados precisos y confiables",
    buttonText: "Agenda tus análisis",
    buttonLink: "/analisis",
  },
  {
    id: 3,
    image: "/dr2.jpg",
    title: "Atención",
    subtitle: "personalizada",
    description: "Tu salud es nuestra prioridad",
    buttonText: "Conoce nuestras sedes",
    buttonLink: "/sedes",
  },
]

export default function HeroSlider() {
  console.log("Renderizando HeroSlider")

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    console.log("HeroSlider useEffect")
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] bg-white overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              currentSlide === index 
                ? "opacity-100 z-10" 
                : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

            <div className="container relative h-full px-3 sm:px-4 md:px-6 flex flex-col justify-center">
              <div className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-3xl space-y-3 sm:space-y-4 md:space-y-6">
                <div
                  className={`transition-all duration-1000 delay-300 transform ${
                    currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <div className="inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded-full mb-2 sm:mb-3 md:mb-4">
                    {slide.description}
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                    {slide.title}{" "}
                    <span className="block text-blue-300 sm:text-blue-400">{slide.subtitle}</span>
                  </h1>
                </div>

                <div
                  className={`transition-all duration-1000 delay-500 transform ${
                    currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <Button asChild className="bg-[#1e5fad] hover:bg-[#1e5fad]/90 text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? "bg-[#1e5fad] w-6 sm:w-8 h-2 sm:h-3" 
                : "bg-white/50 hover:bg-white/75 w-2 sm:w-3 h-2 sm:h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </button>

      {/* Progress bar (opcional para mejorar UX) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-[#1e5fad] transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </section>
  )
}

