"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import DoctorDashboard from "./dashboard/page"

export default function MedicosPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.userType !== "doctor") {
      router.push("/")
    }
  }, [user, router])

  return <DoctorDashboard />
}
