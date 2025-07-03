import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientProvider } from "@/components/client-provider"
import { Preloader } from "@/components/preloader"
import WhatsAppFloat from "@/components/whatsapp-float"
import { Toaster } from "sonner"

const baseUrl = "https://www.laboratoriolopez.com"

const orgStructuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: "Laboratorio Clínico López",
  url: baseUrl,
  logo: `${baseUrl}/favicon.svg`,
  image: `${baseUrl}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lima",
    addressCountry: "PE"
  },
  contactPoint: [{
    "@type": "ContactPoint",
    telephone: "+51-900-649-599",
    contactType: "Customer Service",
  }]
}

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Laboratorio Clínico López - Análisis Clínicos",
  description: "Laboratorio Clínico López: servicios especializados en análisis clínicos y diagnóstico médico. Perfiles preventivos, promociones y atención domiciliaria.",
  keywords: "laboratorio clínico, análisis clínicos, López, diagnóstico médico, exámenes de sangre, perfiles preventivos",
  authors: [{ name: "Laboratorio Clínico López" }],
  robots: {
    index: true,
    follow: true,
    maxSnippet: 160,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  alternates: { canonical: baseUrl },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg'
  },
  openGraph: {
    title: "Laboratorio Clínico López",
    description: "Servicios especializados en análisis clínicos y diagnóstico médico",
    type: "website",
    locale: "es_ES",
    siteName: "Laboratorio Clínico López",
    url: baseUrl,
    images: [
      {
        url: `/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Laboratorio Clínico López",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laboratorio Clínico López',
    description: 'Servicios especializados en análisis clínicos y diagnóstico médico',
    site: '@lablopez',
    creator: '@lablopez',
    images: ['/og-image.jpg'],
  },
  themeColor: '#1E5FAD',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={baseUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgStructuredData) }}
        />
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