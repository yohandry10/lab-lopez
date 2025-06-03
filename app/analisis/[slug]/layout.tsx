import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  )
} 