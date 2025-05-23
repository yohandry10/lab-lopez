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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-8 text-center">Nuestros Aliados</h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {partners.map((partner, idx) => (
              <div key={idx} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 rounded overflow-hidden flex items-center justify-center p-4">
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={200}
                  height={100}
                  className="object-contain h-32"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 