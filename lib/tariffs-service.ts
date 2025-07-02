import { getSupabaseClient } from './supabase-client'
import type {
  Tariff,
  TariffPrice,
  Reference,
  UserReference,
  CreateTariffData,
  UpdateTariffData,
  CreateTariffPriceData,
  UpdateTariffPriceData,
  CreateReferenceData,
  UpdateReferenceData,
  CreateUserReferenceData,
  TariffResponse,
  TariffPriceResponse,
  ReferenceResponse,
  UserReferenceResponse,
  ExamWithPrices,
  TariffWithPrices,
  ReferenceWithTariff,
  UserTariffContext
} from './tariffs.types'

export class TariffsService {
  private supabase = getSupabaseClient()

  // ===========================================
  // GESTIÓN DE TARIFAS
  // ===========================================

  async getAllTariffs(): Promise<TariffResponse> {
    try {
      const { data, error } = await this.supabase
        .from('tariffs')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching tariffs:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as Tariff[] }
    } catch (error) {
      console.error('Unexpected error fetching tariffs:', error)
      return { success: false, error: 'Error inesperado al obtener tarifas' }
    }
  }

  async getTariffById(id: string): Promise<TariffResponse> {
    try {
      const { data, error } = await this.supabase
        .from('tariffs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching tariff:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as Tariff }
    } catch (error) {
      console.error('Unexpected error fetching tariff:', error)
      return { success: false, error: 'Error inesperado al obtener tarifa' }
    }
  }

  async createTariff(tariffData: CreateTariffData): Promise<TariffResponse> {
    try {
      const { data, error } = await this.supabase
        .from('tariffs')
        .insert(tariffData as any)
        .select()
        .single()

      if (error) {
        console.error('Error creating tariff:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as Tariff }
    } catch (error) {
      console.error('Unexpected error creating tariff:', error)
      return { success: false, error: 'Error inesperado al crear tarifa' }
    }
  }

  async updateTariff(tariffData: UpdateTariffData): Promise<TariffResponse> {
    try {
      const { id, ...updateData } = tariffData
      const { data, error } = await this.supabase
        .from('tariffs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating tariff:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as Tariff }
    } catch (error) {
      console.error('Unexpected error updating tariff:', error)
      return { success: false, error: 'Error inesperado al actualizar tarifa' }
    }
  }

  async deleteTariff(id: string): Promise<TariffResponse> {
    try {
      const { error } = await this.supabase
        .from('tariffs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting tariff:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error deleting tariff:', error)
      return { success: false, error: 'Error inesperado al eliminar tarifa' }
    }
  }

  // ===========================================
  // GESTIÓN DE PRECIOS POR TARIFA
  // ===========================================

  async getTariffPrices(tariffId: string): Promise<TariffPriceResponse> {
    try {
      const { data, error } = await this.supabase
        .from('tariff_prices')
        .select(`
          *,
          tariff:tariffs(*),
          exam:analyses(id, name, category)
        `)
        .eq('tariff_id', tariffId)
        .order('exam.name')

      if (error) {
        console.error('Error fetching tariff prices:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as TariffPrice[] }
    } catch (error) {
      console.error('Unexpected error fetching tariff prices:', error)
      return { success: false, error: 'Error inesperado al obtener precios' }
    }
  }

  async getAllTariffPrices(): Promise<TariffPriceResponse> {
    try {
      console.log("🔍 Consultando todos los precios de tarifas...")
      
      const { data, error } = await this.supabase
        .from('tariff_prices')
        .select(`
          *,
          tariff:tariffs(*),
          exam:analyses(id, name, category)
        `)
        .order('id') // Cambiar ordenamiento para evitar problemas con relaciones

      if (error) {
        console.error('❌ Error fetching all tariff prices:', error)
        return { success: false, error: error.message }
      }

      if (!data || data.length === 0) {
        console.log("⚠️ No hay precios de tarifa configurados")
        return { success: true, data: [] }
      }

      console.log(`✅ ${data.length} precios de tarifa cargados correctamente`)
      return { success: true, data: data as unknown as TariffPrice[] }
    } catch (error) {
      console.error('❌ Unexpected error fetching all tariff prices:', error)
      return { success: false, error: 'Error inesperado al obtener todos los precios' }
    }
  }

  async createTariffPrice(priceData: CreateTariffPriceData): Promise<TariffPriceResponse> {
    try {
      const { data, error } = await this.supabase
        .from('tariff_prices')
        .insert(priceData as any)
        .select(`
          *,
          tariff:tariffs(*),
          exam:analyses(id, name, category)
        `)
        .single()

      if (error) {
        console.error('Error creating tariff price:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as TariffPrice }
    } catch (error) {
      console.error('Unexpected error creating tariff price:', error)
      return { success: false, error: 'Error inesperado al crear precio' }
    }
  }

  async updateTariffPrice(priceData: UpdateTariffPriceData): Promise<TariffPriceResponse> {
    try {
      const { id, ...updateData } = priceData
      const { data, error } = await this.supabase
        .from('tariff_prices')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          tariff:tariffs(*),
          exam:analyses(id, name, category)
        `)
        .single()

      if (error) {
        console.error('Error updating tariff price:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as TariffPrice }
    } catch (error) {
      console.error('Unexpected error updating tariff price:', error)
      return { success: false, error: 'Error inesperado al actualizar precio' }
    }
  }

  async deleteTariffPrice(id: string): Promise<TariffPriceResponse> {
    try {
      const { error } = await this.supabase
        .from('tariff_prices')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting tariff price:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error deleting tariff price:', error)
      return { success: false, error: 'Error inesperado al eliminar precio' }
    }
  }

  // FUNCIÓN UPSERT: Crear o Actualizar precio según exista
  async upsertTariffPrice(tariffId: string, examId: string, price: number): Promise<TariffPriceResponse> {
    try {
      console.log("🔍 UPSERT: Verificando precio existente para tarifa:", tariffId, "examen:", examId)
      
      // 1. Buscar si ya existe un precio para esta combinación tarifa-examen
      const { data: existingPrice, error: searchError } = await this.supabase
        .from('tariff_prices')
        .select('id, price')
        .eq('tariff_id', tariffId)
        .eq('exam_id', examId)
        .maybeSingle() // maybeSingle permite que no haya resultados sin error

      if (searchError) {
        console.error('Error searching existing price:', searchError)
        return { success: false, error: searchError.message }
      }

      if (existingPrice) {
        // 2. ACTUALIZAR precio existente
        console.log("✏️ UPSERT: Actualizando precio existente ID:", (existingPrice as any).id, "precio anterior:", (existingPrice as any).price, "precio nuevo:", price)
        
        const { data, error } = await this.supabase
          .from('tariff_prices')
          .update({ price })
          .eq('id', (existingPrice as any).id)
          .select(`
            *,
            tariff:tariffs(*),
            exam:analyses(id, name, category)
          `)
          .single()

        if (error) {
          console.error('Error updating existing price:', error)
          return { success: false, error: error.message }
        }

        console.log("✅ UPSERT: Precio actualizado exitosamente")
        return { success: true, data: data as unknown as TariffPrice }
      } else {
        // 3. CREAR nuevo precio
        console.log("➕ UPSERT: Creando nuevo precio para tarifa:", tariffId, "examen:", examId, "precio:", price)
        
        const { data, error } = await this.supabase
          .from('tariff_prices')
          .insert({
            tariff_id: tariffId,
            exam_id: examId,
            price: price
          } as any)
          .select(`
            *,
            tariff:tariffs(*),
            exam:analyses(id, name, category)
          `)
          .single()

        if (error) {
          console.error('Error creating new price:', error)
          return { success: false, error: error.message }
        }

        console.log("✅ UPSERT: Nuevo precio creado exitosamente")
        return { success: true, data: data as unknown as TariffPrice }
      }
    } catch (error) {
      console.error('Unexpected error in upsert tariff price:', error)
      return { success: false, error: 'Error inesperado al guardar precio' }
    }
  }

  // ===========================================
  // GESTIÓN DE REFERENCIAS
  // ===========================================

  async getAllReferences(): Promise<ReferenceResponse> {
    try {
      const { data, error } = await this.supabase
        .from('references')
        .select(`
          *,
          default_tariff:tariffs(*)
        `)
        .order('name')

      if (error) {
        console.error('Error fetching references:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as ReferenceWithTariff[] }
    } catch (error) {
      console.error('Unexpected error fetching references:', error)
      return { success: false, error: 'Error inesperado al obtener referencias' }
    }
  }

  async getReferenceById(id: string): Promise<ReferenceResponse> {
    try {
      const { data, error } = await this.supabase
        .from('references')
        .select(`
          *,
          default_tariff:tariffs(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching reference:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as ReferenceWithTariff }
    } catch (error) {
      console.error('Unexpected error fetching reference:', error)
      return { success: false, error: 'Error inesperado al obtener referencia' }
    }
  }

  async createReference(referenceData: CreateReferenceData): Promise<ReferenceResponse> {
    try {
      const { data, error } = await this.supabase
        .from('references')
        .insert(referenceData as any)
        .select(`
          *,
          default_tariff:tariffs(*)
        `)
        .single()

      if (error) {
        console.error('Error creating reference:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as ReferenceWithTariff }
    } catch (error) {
      console.error('Unexpected error creating reference:', error)
      return { success: false, error: 'Error inesperado al crear referencia' }
    }
  }

  async updateReference(referenceData: UpdateReferenceData): Promise<ReferenceResponse> {
    try {
      const { id, ...updateData } = referenceData
      const { data, error } = await this.supabase
        .from('references')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          default_tariff:tariffs(*)
        `)
        .single()

      if (error) {
        console.error('Error updating reference:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as ReferenceWithTariff }
    } catch (error) {
      console.error('Unexpected error updating reference:', error)
      return { success: false, error: 'Error inesperado al actualizar referencia' }
    }
  }

  async deleteReference(id: string): Promise<ReferenceResponse> {
    try {
      const { error } = await this.supabase
        .from('references')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting reference:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error deleting reference:', error)
      return { success: false, error: 'Error inesperado al eliminar referencia' }
    }
  }

  // ===========================================
  // GESTIÓN DE USUARIOS Y REFERENCIAS
  // ===========================================

  async getUserReferences(userId: string): Promise<UserReferenceResponse> {
    try {
      const { data, error } = await this.supabase
        .from('user_references')
        .select(`
          *,
          reference:references(
            *,
            default_tariff:tariffs(*)
          )
        `)
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user references:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as UserReference[] }
    } catch (error) {
      console.error('Unexpected error fetching user references:', error)
      return { success: false, error: 'Error inesperado al obtener referencias del usuario' }
    }
  }

  async assignUserReference(assignmentData: CreateUserReferenceData): Promise<UserReferenceResponse> {
    try {
      const { data, error } = await this.supabase
        .from('user_references')
        .insert(assignmentData as any)
        .select(`
          *,
          reference:references(
            *,
            default_tariff:tariffs(*)
          )
        `)
        .single()

      if (error) {
        console.error('Error assigning user reference:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as UserReference }
    } catch (error) {
      console.error('Unexpected error assigning user reference:', error)
      return { success: false, error: 'Error inesperado al asignar referencia al usuario' }
    }
  }

  async removeUserReference(userId: string, referenceId: string): Promise<UserReferenceResponse> {
    try {
      const { error } = await this.supabase
        .from('user_references')
        .delete()
        .eq('user_id', userId)
        .eq('reference_id', referenceId)

      if (error) {
        console.error('Error removing user reference:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error removing user reference:', error)
      return { success: false, error: 'Error inesperado al remover referencia del usuario' }
    }
  }

  // ===========================================
  // LÓGICA DE NEGOCIO PARA PRECIOS DINÁMICOS
  // ===========================================

  async getUserTariffContext(userId: string): Promise<UserTariffContext | null> {
    try {
      // Obtener las referencias asignadas al usuario
      const userRefsResponse = await this.getUserReferences(userId)
      
      if (!userRefsResponse.success || !userRefsResponse.data || !Array.isArray(userRefsResponse.data)) {
        return null
      }

      // Usar la primera referencia activa con tarifa asignada
      const activeReference = userRefsResponse.data.find(ur => 
        ur.reference?.active && ur.reference?.default_tariff
      )

      if (activeReference?.reference) {
        return {
          user_id: userId,
          reference: activeReference.reference,
          applicable_tariff: activeReference.reference.default_tariff,
          has_special_pricing: true
        }
      }

      // Si no tiene referencias especiales, usar tarifa pública por defecto
      const publicRef = await this.getPublicReference()
      
      return {
        user_id: userId,
        reference: publicRef || undefined,
        applicable_tariff: publicRef?.default_tariff,
        has_special_pricing: false
      }
    } catch (error) {
      console.error('Error getting user tariff context:', error)
      return null
    }
  }

  async getPublicReference(): Promise<Reference | null> {
    try {
      const { data, error } = await this.supabase
        .from('references')
        .select(`
          *,
          default_tariff:tariffs(*)
        `)
        .eq('name', 'Público General')
        .eq('active', true)
        .single()

      if (error) {
        console.error('Error fetching public reference:', error)
        return null
      }

      return data as unknown as ReferenceWithTariff
    } catch (error) {
      console.error('Unexpected error fetching public reference:', error)
      return null
    }
  }

  async getExamPrice(examId: string, userId?: string): Promise<{ price: number; tariff_name: string } | null> {
    try {
      let tariffId: string | undefined

      if (userId) {
        // Obtener el contexto de tarifa del usuario
        const context = await this.getUserTariffContext(userId)
        tariffId = context?.applicable_tariff?.id
      }

      if (!tariffId) {
        // Usar tarifa pública por defecto
        const publicRef = await this.getPublicReference()
        tariffId = publicRef?.default_tariff?.id
      }

      if (!tariffId) {
        console.error('No tariff found for exam pricing')
        return null
      }

      // Obtener el precio del examen para la tarifa específica
      const { data, error } = await this.supabase
        .from('tariff_prices')
        .select(`
          price,
          tariff:tariffs(name)
        `)
        .eq('tariff_id', tariffId)
        .eq('exam_id', examId)
        .single()

      if (error) {
        console.error('Error fetching exam price:', error)
        return null
      }

      return {
        price: (data as any).price,
        tariff_name: (data as any).tariff?.name || 'Sin nombre'
      }
    } catch (error) {
      console.error('Unexpected error getting exam price:', error)
      return null
    }
  }

  async getExamsWithPrices(tariffId?: string): Promise<ExamWithPrices[]> {
    try {
      // Obtener todos los exámenes
      const { data: exams, error: examsError } = await this.supabase
        .from('analyses')
        .select('id, name, category, conditions, sample, protocol')
        .order('name')

      if (examsError) {
        console.error('Error fetching exams:', examsError)
        return []
      }

      // Obtener precios para todas las tarifas o para una específica
      let pricesQuery = this.supabase
        .from('tariff_prices')
        .select(`
          exam_id,
          price,
          tariff:tariffs(id, name, is_taxable)
        `)

      if (tariffId) {
        pricesQuery = pricesQuery.eq('tariff_id', tariffId)
      }

      const { data: prices, error: pricesError } = await pricesQuery

      if (pricesError) {
        console.error('Error fetching prices:', pricesError)
        return []
      }

      // Combinar exámenes con precios
      const examsWithPrices: ExamWithPrices[] = (exams as any[]).map((exam: any) => {
        const examPrices = prices?.filter(p => p.exam_id === exam.id) || []
        
        const pricesMap: { [tariffId: string]: { price: number; tariff_name: string; is_taxable: boolean } } = {}
        
        examPrices.forEach((p: any) => {
          if (p.tariff) {
            pricesMap[p.tariff.id] = {
              price: p.price,
              tariff_name: p.tariff.name,
              is_taxable: p.tariff.is_taxable
            }
          }
        })

        return {
          ...exam,
          prices: pricesMap
        }
      })

      return examsWithPrices
    } catch (error) {
      console.error('Unexpected error getting exams with prices:', error)
      return []
    }
  }

  // ===========================================
  // OPERACIONES EN LOTE
  // ===========================================

  async updateMultiplePrices(updates: Array<{ exam_id: string; tariff_id: string; price: number }>): Promise<TariffPriceResponse> {
    try {
      const operations = updates.map(update => ({
        ...update,
        updated_at: new Date().toISOString()
      }))

      const { data, error } = await this.supabase
        .from('tariff_prices')
        .upsert(operations, { 
          onConflict: 'tariff_id,exam_id',
          ignoreDuplicates: false 
        })
        .select(`
          *,
          tariff:tariffs(*),
          exam:analyses(id, name, category)
        `)

      if (error) {
        console.error('Error updating multiple prices:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as TariffPrice[] }
    } catch (error) {
      console.error('Unexpected error updating multiple prices:', error)
      return { success: false, error: 'Error inesperado al actualizar precios múltiples' }
    }
  }

  async copyTariffPrices(sourceTariffId: string, targetTariffId: string, multiplier: number = 1): Promise<TariffPriceResponse> {
    try {
      // Obtener precios de la tarifa origen
      const sourceResponse = await this.getTariffPrices(sourceTariffId)
      
      if (!sourceResponse.success || !sourceResponse.data || !Array.isArray(sourceResponse.data)) {
        return { success: false, error: 'No se pudieron obtener los precios de la tarifa origen' }
      }

      // Crear precios para la tarifa destino
      const newPrices = sourceResponse.data.map(price => ({
        tariff_id: targetTariffId,
        exam_id: price.exam_id,
        price: Math.round(price.price * multiplier * 100) / 100 // Redondear a 2 decimales
      }))

      const { data, error } = await this.supabase
        .from('tariff_prices')
        .upsert(newPrices, { 
          onConflict: 'tariff_id,exam_id',
          ignoreDuplicates: false 
        })
        .select(`
          *,
          tariff:tariffs(*),
          exam:analyses(id, name, category)
        `)

      if (error) {
        console.error('Error copying tariff prices:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data as unknown as TariffPrice[] }
    } catch (error) {
      console.error('Unexpected error copying tariff prices:', error)
      return { success: false, error: 'Error inesperado al copiar precios de tarifa' }
    }
  }
}

// Instancia singleton del servicio
export const tariffsService = new TariffsService() 