import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'

export function ImageGallery() {
  // Imágenes de aliados que aparecen en la captura de pantalla
  const partners = [
    {
      src: '/uno.jpeg',
      alt: 'Aliado 1'
    },
    {
      src: '/dos.jpg',
      alt: 'Aliado 2'
    },
    {
      src: '/tres.png',
      alt: 'Aliado 3'
    },
    {
      src: '/cuatro.jpeg',
      alt: 'Aliado 4'
    }
  ]

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  useEffect(() => {
    if (!emblaApi) return
    const timer = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(timer)
  }, [emblaApi])

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-6 sm:mb-8 text-center">
          Nuestros Aliados
        </h2>
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6">
            {partners.map((partner, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 rounded overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={200}
                  height={100}
                  className="object-contain h-20 sm:h-24 md:h-32 w-auto max-w-full hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Indicadores de carrusel */}
        <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
          {partners.map((_, idx) => (
            <button
              key={idx}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200"
              onClick={() => emblaApi?.scrollTo(idx)}
              aria-label={`Go to partner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 