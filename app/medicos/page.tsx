"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MedicosPage() {
  const router = useRouter()

  // Redirigir automáticamente al dashboard
  useEffect(() => {
    router.push("/medicos/dashboard")
  }, [router])

  return <div className="container mx-auto py-16 text-center">Redirigiendo al panel del médico...</div>
}
