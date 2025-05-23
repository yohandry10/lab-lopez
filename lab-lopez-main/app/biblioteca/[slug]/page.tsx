"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { analysisData } from "@/components/digital-library"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import type { Analysis } from "@/components/digital-library"

interface CartItem {
  id: number
  name: string
  price: number
  category: string
}

export default function ArticlePage() {
  const router = useRouter()
  const params = useParams()
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [article, setArticle] = useState<Analysis | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Analysis[]>([])

  useEffect(() => {
    const slug = params?.slug as string
    const foundArticle = analysisData.find((a) => a.slug === slug)

    if (!foundArticle) {
      router.push('/biblioteca')
      return
    }

    setArticle(foundArticle)

    // Find related articles (same category, excluding current)
    const related = analysisData
      .filter((a) => a.category === foundArticle.category && a.id !== foundArticle.id)
      .slice(0, 2)
    setRelatedArticles(related)

    setIsLoading(false)
  }, [params, router])

  if (isLoading) {
    return (
      <div className="container px-4 py-12 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!article) return

    const item: CartItem = {
      id: article.id,
      name: article.title,
      price: 0, // Asumiendo que el precio es 0 o ajustando según necesites
      category: article.category
    }
    addItem(item)
  }

  if (!article) return null

  return (
    <div className="container px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/biblioteca" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Volver a la biblioteca
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-6">
            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">{article.title}</h1>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-600 mb-6">{article.description}</p>

            {article.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {article.sections?.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="prose prose-lg">{section.content}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Artículos relacionados</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedArticles.map((relatedArticle) => (
                  <Card
                    key={relatedArticle.id}
                    className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                        <Image
                          src={relatedArticle.image || "/placeholder.svg"}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="mb-2">
                          <span className="text-sm text-blue-600">{relatedArticle.category}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{relatedArticle.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{relatedArticle.description}</p>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/biblioteca/${relatedArticle.slug}`}>Leer más</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-center">
          <Button onClick={handleAddToCart} className="bg-[#1E5FAD] hover:bg-[#3DA64A] text-white">
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  )
}

