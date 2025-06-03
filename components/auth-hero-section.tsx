import Image from "next/image"

interface AuthHeroSectionProps {
  title: string
  subtitle: string
}

export function AuthHeroSection({ title, subtitle }: AuthHeroSectionProps) {
  return (
    <div className="relative w-full h-[400px]">
      <Image
        src="/hero-login-register.jpg"
        alt="Laboratorio moderno"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            <p className="text-xl text-white">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 