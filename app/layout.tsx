import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientProvider } from "@/components/client-provider"
import { Preloader } from "@/components/preloader"
import WhatsAppFloat from "@/components/whatsapp-float"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Laboratorio Clínico López - Análisis Clínicos y Medicina Preventiva",
  description: "Laboratorio Clínico López - Servicios especializados en análisis clínicos, medicina preventiva y diagnóstico médico. Perfiles preventivos, promociones disponibles y atención domiciliaria.",
  keywords: "laboratorio clínico, análisis clínicos, medicina preventiva, López, diagnóstico médico, exámenes de sangre, perfiles preventivos",
  authors: [{ name: "Laboratorio Clínico López" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/lopez.png', sizes: '32x32', type: 'image/png' },
      { url: '/lopez.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/lopez.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/lopez.png'
  },
  openGraph: {
    title: "Laboratorio Clínico López",
    description: "Servicios especializados en análisis clínicos y medicina preventiva",
    type: "website",
    locale: "es_ES",
    siteName: "Laboratorio Clínico López"
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/lopez.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/lopez.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/lopez.png" />
        <link rel="shortcut icon" href="/lopez.png" />
      </head>
      <body className={inter.className}>
        <Preloader />
        <ClientProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFloat />
          </div>
          <Toaster position="top-right" />
        </ClientProvider>
      </body>
    </html>
  )
}