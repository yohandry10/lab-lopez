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
    title: "5 años",
    subtitle: "de experiencia y confianza",
    description: "Comprometidos con tu salud",
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
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] bg-white overflow-hidden">
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
              priority={true}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

            <div className="container relative h-full px-4 flex flex-col justify-center">
              <div className="max-w-2xl space-y-6">
                <div
                  className={`transition-all duration-1000 delay-300 transform ${
                    currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <div className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full mb-4">
                    {slide.description}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                    {slide.title} <span className="block text-blue-400">{slide.subtitle}</span>
                  </h1>
                </div>

                <div
                  className={`transition-all duration-1000 delay-500 transform ${
                    currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <Button asChild className="bg-[#1e5fad] hover:bg-[#1e5fad]/90 text-lg px-8 py-6 h-auto">
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? "bg-[#1e5fad] w-8" : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  )
}

