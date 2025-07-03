"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: number
  name: string
  price: number // precio por unidad
  quantity: number
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
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  total: 0,
})

// Función para cargar el carrito desde localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return []

  try {
    const savedCart = localStorage.getItem("cart")
    if (!savedCart) return []
    try {
      const parsed: any[] = JSON.parse(savedCart)
      return parsed.map((it) => ({ ...it, quantity: it.quantity ?? 1 }))
    } catch(e) {
      console.error("Error parse cart storage:", e)
      return []
    }
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
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        // Verificar si el item ya existe
        const existing = prev.find((i) => i.id === item.id)
        if (existing) {
          // Si ya existe, incrementar cantidad
          const updated = prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
          )
          toast({
            title: "Cantidad actualizada",
            description: `Ahora tienes ${updated.find(i=>i.id===item.id)?.quantity} × ${item.name}`,
          })
          return updated
        }

        toast({
          title: "Análisis agregado", 
          description: "Se agregó el análisis a tu carrito"
        })
        return [...prev, { ...item, quantity: item.quantity ?? 1 }]
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

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    toast({
      title: "Carrito vacío",
      description: "Se han eliminado todos los análisis del carrito"
    })
  }, [toast])

  // Calcular el total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
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

