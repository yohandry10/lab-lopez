# 🏥 Sistema de Tarifas ORION - Laboratorio López

## 📋 **Descripción General**

Se ha implementado un **sistema completo de tarifas dinámicas** basado en el modelo ORION, que permite gestionar precios diferenciados por tipo de cliente, referencias específicas y tarifas múltiples configurables.

## 🚀 **Características Principales**

### **✨ Sistema Multi-Tarifa**
- **Tarifas múltiples**: Base, Exonerado, Particular San Juan, Particular Santa Anita, etc.
- **Tipos de tarifa**: Venta y Costo
- **Control de IGV**: Configurable por tarifa
- **Gestión completa**: CRUD completo desde el panel de administración

### **🎯 Referencias de Clientes**
- **Referencias configurables**: Público General, Médicos, Empresas, Clínicas específicas
- **Tarifa por defecto**: Cada referencia puede tener una tarifa asignada
- **Estado activo/inactivo**: Control de activación de referencias
- **Asignación de usuarios**: Los usuarios pueden ser asignados a referencias específicas

### **💰 Precios Dinámicos**
- **Precios por tarifa**: Cada examen puede tener diferentes precios según la tarifa
- **Cálculo automático**: El sistema determina automáticamente qué precio mostrar
- **Fallback inteligente**: Si no hay precio específico, usa tarifa pública por defecto
- **Actualización en lote**: Posibilidad de actualizar múltiples precios a la vez

## 🗄️ **Estructura de Base de Datos**

### **Tabla `tariffs`**
```sql
- id: UUID (PK)
- name: TEXT (UNIQUE) - Nombre de la tarifa
- type: TEXT - 'cost' | 'sale'
- is_taxable: BOOLEAN - Si incluye IGV
- created_at, updated_at: TIMESTAMPTZ
```

### **Tabla `tariff_prices`**
```sql
- id: UUID (PK)
- tariff_id: UUID (FK -> tariffs)
- exam_id: UUID (FK -> analyses)
- price: DECIMAL(12,2)
- updated_at: TIMESTAMPTZ
- UNIQUE(tariff_id, exam_id)
```

### **Tabla `references`**
```sql
- id: UUID (PK)
- code: TEXT - Código de referencia (opcional)
- name: TEXT - Nombre de la referencia
- business_name: TEXT - Razón social
- default_tariff_id: UUID (FK -> tariffs)
- active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

### **Tabla `user_references`**
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users)
- reference_id: UUID (FK -> references)
- created_at: TIMESTAMPTZ
- UNIQUE(user_id, reference_id)
```

## 🔧 **Implementación Técnica**

### **Servicios y Librerías**

#### **1. Tipos TypeScript** (`lib/tariffs.types.ts`)
- Definición completa de interfaces y tipos
- Tipos para formularios y respuestas API
- Enums para categorización

#### **2. Servicio Principal** (`lib/tariffs-service.ts`)
- **TariffsService**: Clase principal con todos los métodos
- Operaciones CRUD para todas las entidades
- Lógica de negocio para precios dinámicos
- Operaciones en lote y copia de tarifas

#### **3. Hook Personalizado** (`hooks/use-dynamic-pricing.tsx`)
- **useDynamicPricing**: Hook principal para manejo de precios
- **useExamPrice**: Hook específico para precios de exámenes
- **usePriceVisibility**: Hook para control de visibilidad

### **Componentes de UI**

#### **1. Panel de Administración** (`components/tariffs-admin-panel.tsx`)
- **Gestión de Tarifas**: Crear, editar, eliminar tarifas
- **Gestión de Precios**: Asignar precios por tarifa y examen
- **Gestión de Referencias**: Configurar clientes y sus tarifas
- **Herramientas**: Copiar precios entre tarifas, operaciones en lote

#### **2. API Routes** (`app/api/tariffs/route.ts`)
- **GET**: Consultas de tarifas, precios, referencias
- **POST**: Creación de entidades y operaciones especiales
- **PUT**: Actualización de registros
- **DELETE**: Eliminación de registros

## 🎮 **Uso del Sistema**

### **Para Administradores**

#### **Acceso al Panel**
1. Iniciar sesión como administrador
2. Ir a la página de Análisis
3. Hacer clic en "💰 Sistema de Tarifas"

#### **Gestión de Tarifas**
```typescript
// Crear nueva tarifa
const newTariff = {
  name: "Particular Lima Norte",
  type: "sale",
  is_taxable: true
}

// El panel permite:
- ✅ Crear tarifas personalizadas
- ✅ Configurar tipo (Venta/Costo)
- ✅ Activar/desactivar IGV
- ✅ Editar información
- ✅ Eliminar tarifas
```

#### **Gestión de Precios**
```typescript
// Asignar precios por tarifa
const priceConfig = {
  tariff_id: "uuid-tarifa",
  exam_id: "uuid-examen", 
  price: 150.00
}

// El panel permite:
- ✅ Ver todos los exámenes con sus precios por tarifa
- ✅ Editar precios individualmente
- ✅ Actualizar precios en lote
- ✅ Copiar precios entre tarifas
```

#### **Gestión de Referencias**
```typescript
// Crear referencia de cliente
const newReference = {
  name: "Clínica Santa María",
  business_name: "Clínica Santa María S.A.C.",
  default_tariff_id: "uuid-tarifa-especial",
  active: true
}

// El panel permite:
- ✅ Crear referencias personalizadas
- ✅ Asignar tarifa por defecto
- ✅ Activar/desactivar referencias
- ✅ Gestionar clientes corporativos
```

### **Para Desarrolladores**

#### **Integración en Componentes**
```typescript
import { useDynamicPricing, useExamPrice } from '@/hooks/use-dynamic-pricing'

function ExamComponent({ examId }: { examId: string }) {
  const { formattedPrice, tariffName, hasSpecialPricing } = useExamPrice(examId)
  const { canSeePrice } = useDynamicPricing()

  return (
    <div>
      {canSeePrice() && formattedPrice && (
        <span className="price">
          {formattedPrice}
          {hasSpecialPricing && <span className="special"> (Precio especial)</span>}
          <small> - {tariffName}</small>
        </span>
      )}
    </div>
  )
}
```

#### **Lógica de Precios Dinámicos**
```typescript
// El sistema determina automáticamente:
1. ¿El usuario tiene una referencia asignada?
2. ¿La referencia tiene una tarifa por defecto?
3. ¿Existe precio para el examen en esa tarifa?
4. Si no, usar tarifa pública por defecto

// Flujo de determinación de precios:
Usuario → Referencia → Tarifa → Precio del Examen
```

## 🔄 **Flujo de Trabajo**

### **1. Configuración Inicial**
```bash
# Ejecutar script de creación de tablas
1. Ejecutar: scripts/create-tariffs-system.sql

# Verificar datos iniciales
2. Verificar que se crearon las tarifas base
3. Verificar que se crearon las referencias iniciales
4. Confirmar que los permisos RLS están activos
```

### **2. Configuración de Tarifas**
```typescript
// Crear tarifas según necesidades del negocio
const tariffs = [
  { name: "Base", type: "sale", is_taxable: true },
  { name: "Corporativo", type: "sale", is_taxable: true },
  { name: "Médicos", type: "sale", is_taxable: false },
  { name: "Particular", type: "sale", is_taxable: true }
]
```

### **3. Asignación de Precios**
```typescript
// Para cada tarifa, asignar precios a los exámenes
const priceAssignments = [
  { tariff: "Base", exam: "Hemograma", price: 50.00 },
  { tariff: "Corporativo", exam: "Hemograma", price: 45.00 },
  { tariff: "Médicos", exam: "Hemograma", price: 40.00 }
]
```

### **4. Configuración de Referencias**
```typescript
// Crear referencias para diferentes tipos de clientes
const references = [
  { 
    name: "Público General", 
    default_tariff: "Base" 
  },
  { 
    name: "Médicos", 
    default_tariff: "Médicos" 
  },
  { 
    name: "Clínica San Juan", 
    business_name: "Clínica San Juan S.A.C.",
    default_tariff: "Corporativo" 
  }
]
```

### **5. Asignación de Usuarios**
```typescript
// Asignar usuarios a referencias específicas
const userAssignments = [
  { user_id: "doctor-123", reference_id: "medicos-ref" },
  { user_id: "empresa-456", reference_id: "corporativo-ref" }
]
```

## 📊 **Ventajas del Sistema**

### **🎯 Flexibilidad Total**
- **Tarifas ilimitadas**: Crear tantas tarifas como sea necesario
- **Precios específicos**: Cada examen puede tener precio diferente por tarifa
- **Referencias personalizadas**: Clientes específicos con tarifas especiales
- **Configuración dinámica**: Cambios en tiempo real sin reinicio

### **🔒 Seguridad y Control**
- **Row Level Security**: Implementado a nivel de base de datos
- **Permisos por rol**: Solo admins pueden gestionar tarifas
- **Auditoría completa**: Registro de cambios con timestamps
- **Validaciones**: Integridad de datos garantizada

### **⚡ Performance Optimizada**
- **Índices apropiados**: Consultas rápidas por tarifa y examen
- **Caché inteligente**: Precios cacheados en el contexto del usuario
- **Consultas optimizadas**: JOINs eficientes para datos relacionados
- **Operaciones en lote**: Actualización masiva de precios

### **🎨 UX Excepcional**
- **Panel intuitivo**: Interfaz fácil de usar para administradores
- **Precios contextuales**: El usuario ve solo los precios que le corresponden
- **Indicadores visuales**: Diferenciación clara entre tipos de precios
- **Retroalimentación**: Toast notifications para todas las acciones

## 🚨 **Consideraciones Importantes**

### **⚠️ Migración desde Sistema Anterior**
- El sistema anterior con `price` y `reference_price` sigue funcionando
- Se puede migrar gradualmente al nuevo sistema
- Las tarifas existentes se mantienen como fallback

### **🔧 Mantenimiento**
- **Backup regular**: Las tablas de tarifas son críticas
- **Monitoreo**: Vigilar performance de consultas de precios
- **Limpieza**: Eliminar referencias inactivas periódicamente

### **🎯 Escalabilidad**
- **Preparado para crecimiento**: Estructura escalable para miles de tarifas
- **Extensible**: Fácil agregar nuevos tipos de tarifa
- **Modular**: Componentes reutilizables en otras partes del sistema

## 📋 **Scripts de Producción**

### **Ejecución en Orden**
```sql
-- 1. Crear estructuras base
\i scripts/create-tariffs-system.sql

-- 2. Verificar creación
SELECT * FROM tariffs;
SELECT * FROM references;

-- 3. Asignar permisos adicionales si es necesario
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
```

### **Verificación Post-Implementación**
```sql
-- Verificar que todo funciona correctamente
SELECT 
  t.name as tariff_name,
  COUNT(tp.id) as price_count
FROM tariffs t
LEFT JOIN tariff_prices tp ON t.id = tp.tariff_id
GROUP BY t.id, t.name;
```

---

## 🎉 **¡Sistema Listo para Producción!**

El **Sistema de Tarifas ORION** está completamente implementado y listo para usar. Proporciona una base sólida y escalable para la gestión de precios dinámicos en el Laboratorio López, con todas las características necesarias para un laboratorio médico moderno.

### **✅ Funcionalidades Completadas:**
- ✅ Sistema multi-tarifa completo
- ✅ Referencias de clientes configurables  
- ✅ Precios dinámicos por usuario
- ✅ Panel de administración completo
- ✅ API endpoints funcionales
- ✅ Hooks para integración frontend
- ✅ Seguridad RLS implementada
- ✅ Documentación completa

**¡El laboratorio ahora cuenta con un sistema de tarifas de nivel empresarial!** 🚀 