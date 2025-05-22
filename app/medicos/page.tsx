"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MedicosPage() {
  const router = useRouter()

  // Redirigir automáticamente a la página de inicio
  useEffect(() => {
    router.push("/")
  }, [router])

  return <div className="container mx-auto py-16 text-center">Redirigiendo al inicio...</div>
}
