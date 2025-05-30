"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: number
  name: string
  price: number
  patientDetails?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
    lat?: number
    lng?: number
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  itemCount: 0,
  total: 0,
})

// Función para cargar el carrito desde localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return []

  try {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error("Error loading cart from localStorage:", error)
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Cargar carrito al iniciar
  useEffect(() => {
    setItems(loadCartFromStorage())
  }, [])

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items])

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        // Verificar si el item ya existe
        const exists = prev.some((i) => i.id === item.id)
        if (exists) {
          toast({
            title: "Análisis ya agregado",
            description: "Este análisis ya se encuentra en tu carrito",
            variant: "destructive",
          })
          return prev
        }

        toast({
          title: "Análisis agregado", 
          description: "Se agregó el análisis a tu carrito"
        })
        return [...prev, item]
      })
    },
    [toast]
  )

  const removeItem = useCallback(
    (id: number) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: "Análisis eliminado",
        description: "Se eliminó el análisis de tu carrito"
      })
    },
    [toast]
  )

  const clearCart = useCallback(() => {
    setItems([])
    toast({
      title: "Carrito vacío",
      description: "Se han eliminado todos los análisis del carrito"
    })
  }, [toast])

  // Calcular el total
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        itemCount: items.length,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

