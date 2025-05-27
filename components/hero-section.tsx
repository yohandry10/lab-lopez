import Image from "next/image"

interface HeroSectionProps {
  title: string
  subtitle: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <div className="relative w-full bg-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-login-register.jpg"
          alt="Laboratorio moderno"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Contenido del hero */}
      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
        <div className="max-w-xl text-center sm:text-left">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white">
            {title}
            <strong className="block font-extrabold text-blue-400 mt-2">
              Laboratorio López
            </strong>
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed text-white">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-center justify-start">
            <div className="block w-full rounded px-12 py-3 text-sm font-medium text-white shadow bg-blue-400/20 backdrop-blur-sm border border-white/10">
              Más de 5 años de experiencia en análisis clínicos
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-20 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  )
} 