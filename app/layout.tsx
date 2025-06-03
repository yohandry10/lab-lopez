import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientProvider } from "@/components/client-provider"
import { Preloader } from "@/components/preloader"
import WhatsAppFloat from "@/components/whatsapp-float"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Laboratorio LOPEZ",
  description: "Laboratorio LOPEZ - Servicios de análisis clínicos"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
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