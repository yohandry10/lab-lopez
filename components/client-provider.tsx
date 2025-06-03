'use client'

import { AuthProvider } from "@/contexts/auth-context"

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
} 