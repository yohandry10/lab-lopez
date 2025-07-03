// Tipos para el sistema de tarifas basado en ORION
export interface Tariff {
  id: string
  name: string
  type: 'cost' | 'sale'
  is_taxable: boolean
  created_at: string
  updated_at: string
}

export interface TariffPrice {
  id: string
  tariff_id: string
  exam_id: number  // ← CORREGIDO: integer en vez de string
  price: number
  updated_at: string
  // Relaciones populadas
  tariff?: Tariff
  exam?: {
    id: number     // ← CORREGIDO: integer en vez de string
    name: string
    category: string
  }
}

export interface Reference {
  id: string
  code?: string
  name: string
  business_name?: string
  default_tariff_id?: string
  active: boolean
  created_at: string
  updated_at: string
  // Relaciones populadas
  default_tariff?: Tariff
}

export interface UserReference {
  id: string
  user_id: string
  reference_id: string
  created_at: string
  // Relaciones populadas
  reference?: Reference
  user?: {
    id: string
    email: string
    first_name: string
    last_name: string
    user_type: string
  }
}

// Tipos para formularios
export interface CreateTariffData {
  name: string
  type: 'cost' | 'sale'
  is_taxable: boolean
}

export interface UpdateTariffData extends Partial<CreateTariffData> {
  id: string
}

export interface CreateTariffPriceData {
  tariff_id: string
  exam_id: number  // ← CORREGIDO: integer en vez de string
  price: number
}

export interface UpdateTariffPriceData extends Partial<Omit<CreateTariffPriceData, 'tariff_id' | 'exam_id'>> {
  id: string
}

export interface CreateReferenceData {
  code?: string
  name: string
  business_name?: string
  default_tariff_id?: string
  active?: boolean
}

export interface UpdateReferenceData extends Partial<CreateReferenceData> {
  id: string
}

export interface CreateUserReferenceData {
  user_id: string
  reference_id: string
}

// Tipos para respuestas de API
export interface TariffResponse {
  success: boolean
  data?: Tariff | Tariff[]
  error?: string
}

export interface TariffPriceResponse {
  success: boolean
  data?: TariffPrice | TariffPrice[]
  error?: string
}

export interface ReferenceResponse {
  success: boolean
  data?: Reference | Reference[]
  error?: string
}

export interface UserReferenceResponse {
  success: boolean
  data?: UserReference | UserReference[]
  error?: string
}

// Tipos para vistas compuestas
export interface ExamWithPrices {
  id: string
  name: string
  category: string
  conditions: string
  sample: string
  protocol: string
  prices: {
    [tariffId: string]: {
      price: number
      tariff_name: string
      is_taxable: boolean
    }
  }
}

export interface TariffWithPrices extends Tariff {
  prices: TariffPrice[]
  exam_count: number
}

export interface ReferenceWithTariff extends Reference {
  default_tariff?: Tariff
  user_count?: number
}

// Tipos para el contexto de usuario y tarifas
export interface UserTariffContext {
  user_id: string
  reference?: Reference
  applicable_tariff?: Tariff
  has_special_pricing: boolean
}

// Tipos para la configuración de precios dinámicos
export interface PricingConfig {
  default_tariff_id: string
  public_tariff_id: string
  show_prices_to_public: boolean
  use_dynamic_pricing: boolean
}

// Enum para tipos de tarifa
export enum TariffType {
  COST = 'cost',
  SALE = 'sale'
}

// Enum para tipos de referencia predefinidos
export enum ReferenceType {
  PUBLIC = 'Público General',
  DOCTORS = 'Médicos',
  COMPANIES = 'Empresas'
} 