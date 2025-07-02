"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { tariffsService } from '@/lib/tariffs-service'
import type { 
  UserTariffContext, 
  Tariff,
  Reference 
} from '@/lib/tariffs.types'

interface PriceInfo {
  price: number
  tariff_name: string
  has_special_pricing: boolean
  currency: string
}

interface UseDynamicPricingReturn {
  // Contexto del usuario
  userTariffContext: UserTariffContext | null
  applicableTariff: Tariff | null
  userReference: Reference | null
  hasSpecialPricing: boolean
  
  // Funciones de precios
  getExamPrice: (examId: string) => Promise<PriceInfo | null>
  formatPrice: (price: number) => string
  
  // Estados
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  
  // Funciones de utilidad
  refreshContext: () => Promise<void>
  canSeePrice: (examId?: string) => boolean
}

export function useDynamicPricing(): UseDynamicPricingReturn {
  const { user } = useAuth()
  const [userTariffContext, setUserTariffContext] = useState<UserTariffContext | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Memoizar datos derivados del contexto
  const applicableTariff = useMemo(() => {
    return userTariffContext?.applicable_tariff || null
  }, [userTariffContext])

  const userReference = useMemo(() => {
    return userTariffContext?.reference || null
  }, [userTariffContext])

  const hasSpecialPricing = useMemo(() => {
    return userTariffContext?.has_special_pricing || false
  }, [userTariffContext])

  // Cargar contexto de tarifa del usuario
  const loadUserTariffContext = useCallback(async () => {
    if (!user?.id) {
      setUserTariffContext(null)
      return
    }

    setIsLoading(true)
    setIsError(false)
    setErrorMessage(null)

    try {
      const context = await tariffsService.getUserTariffContext(user.id)
      setUserTariffContext(context)
      
      if (!context) {
        console.log('No se pudo obtener contexto de tarifa para el usuario:', user.id)
      } else {
        console.log('Contexto de tarifa cargado:', {
          user_id: context.user_id,
          reference_name: context.reference?.name,
          tariff_name: context.applicable_tariff?.name,
          has_special_pricing: context.has_special_pricing
        })
      }
    } catch (error) {
      console.error('Error loading user tariff context:', error)
      setIsError(true)
      setErrorMessage('Error al cargar información de precios del usuario')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Cargar contexto cuando cambia el usuario
  useEffect(() => {
    loadUserTariffContext()
  }, [loadUserTariffContext])

  // Función para obtener precio de un examen
  const getExamPrice = useCallback(async (examId: string): Promise<PriceInfo | null> => {
    try {
      const priceData = await tariffsService.getExamPrice(examId, user?.id)
      
      if (!priceData) {
        return null
      }

      return {
        price: priceData.price,
        tariff_name: priceData.tariff_name,
        has_special_pricing: hasSpecialPricing,
        currency: 'S/'
      }
    } catch (error) {
      console.error('Error getting exam price:', error)
      return null
    }
  }, [user?.id, hasSpecialPricing])

  // Función para formatear precios
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }, [])

  // Función para refrescar el contexto
  const refreshContext = useCallback(async () => {
    await loadUserTariffContext()
  }, [loadUserTariffContext])

  // Función para verificar si el usuario puede ver precios
  const canSeePrice = useCallback((examId?: string): boolean => {
    // Si no hay usuario, aplicar reglas de público general
    if (!user) {
      return true // Los precios públicos se pueden mostrar
    }

    // Si hay usuario, depende de su tipo y configuración
    switch (user.user_type) {
      case 'admin':
        return true // Admins siempre ven precios
      
      case 'patient':
        return true // Pacientes ven precios públicos
      
      case 'doctor':
      case 'company':
        // Médicos y empresas ven sus precios especiales
        return hasSpecialPricing
      
      default:
        return true
    }
  }, [user, hasSpecialPricing])

  return {
    // Contexto del usuario
    userTariffContext,
    applicableTariff,
    userReference,
    hasSpecialPricing,
    
    // Funciones de precios
    getExamPrice,
    formatPrice,
    
    // Estados
    isLoading,
    isError,
    errorMessage,
    
    // Funciones de utilidad
    refreshContext,
    canSeePrice
  }
}

// Hook simplificado solo para obtener precios de exámenes
export function useExamPrice(examId: string | null) {
  const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { getExamPrice, formatPrice } = useDynamicPricing()

  useEffect(() => {
    if (!examId) {
      setPriceInfo(null)
      return
    }

    const loadPrice = async () => {
      setIsLoading(true)
      try {
        const price = await getExamPrice(examId)
        setPriceInfo(price)
      } catch (error) {
        console.error('Error loading exam price:', error)
        setPriceInfo(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadPrice()
  }, [examId, getExamPrice])

  const formattedPrice = useMemo(() => {
    if (!priceInfo) return null
    return formatPrice(priceInfo.price)
  }, [priceInfo, formatPrice])

  return {
    priceInfo,
    formattedPrice,
    isLoading,
    price: priceInfo?.price || 0,
    tariffName: priceInfo?.tariff_name || '',
    hasSpecialPricing: priceInfo?.has_special_pricing || false
  }
}

// Hook para verificar si mostrar precios en componentes
export function usePriceVisibility() {
  const { canSeePrice, hasSpecialPricing, applicableTariff } = useDynamicPricing()
  
  return {
    canSeePrice,
    hasSpecialPricing,
    applicableTariff,
    shouldShowPrices: canSeePrice()
  }
} 