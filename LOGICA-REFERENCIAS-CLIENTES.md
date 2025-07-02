# 🎯 LÓGICA DE REFERENCIAS DE CLIENTES - LABORATORIO LÓPEZ

## ❓ **PROBLEMA IDENTIFICADO**
**"¿Cómo detectar qué referencia usar? ¿Según conexión, usuario, rol?"**

---

## 🧠 **LÓGICA ACTUAL IMPLEMENTADA**

### **1. JERARQUÍA DE DETECCIÓN DE TARIFAS**

```typescript
1. Si el usuario tiene REFERENCIAS ESPECÍFICAS → Usar su tarifa asignada
2. Si el usuario es de tipo "business" → Usar tarifa "Referencial con IGV"  
3. Si no → Usar tarifa "Base" (público general)
```

### **2. FLUJO DE DETECCIÓN**

```typescript
async getUserTariffContext(userId: string) {
  // 1. Buscar referencias específicas del usuario
  const userRefs = await getUserReferences(userId)
  
  if (userRefs.length > 0) {
    return userRefs[0].reference.default_tariff  // Tarifa específica
  }
  
  // 2. Buscar por tipo de usuario
  const user = await getUser(userId)
  
  if (user.user_type === 'business') {
    return getTariff('Referencial con IGV')
  }
  
  // 3. Por defecto: público general
  return getTariff('Base')
}
```

---

## 🏗️ **CONFIGURACIÓN DE REFERENCIAS**

### **A. REFERENCIAS POR DEFECTO**
| Referencia | Tarifa Asignada | Uso |
|------------|----------------|-----|
| **Público General** | Base | Usuarios normales |
| **Empresas** | Referencial con IGV | Usuarios business |
| **Médicos** | Particular San Juan | Médicos específicos |

### **B. REFERENCIAS ESPECÍFICAS** 
```sql
-- Ejemplos de referencias específicas:
- Centro de Salud Calcuta → Tarifa "Exonerado"
- Clínica Solidaria → Tarifa "Particular Santa Anita"  
- Laboratorio López → Tarifa "Costo"
```

---

## 🔄 **MÉTODOS DE ASIGNACIÓN**

### **1. ASIGNACIÓN AUTOMÁTICA** (Por rol de usuario)
```typescript
// En el registro o login
if (user.user_type === 'business') {
  await assignUserReference(userId, 'empresas-ref-id')
}
```

### **2. ASIGNACIÓN MANUAL** (Desde panel admin)
```typescript
// Panel de administración
await tariffsService.assignUserReference({
  user_id: "usuario-id",
  reference_id: "referencia-especifica-id"
})
```

### **3. ASIGNACIÓN POR CÓDIGO/INVITACIÓN**
```typescript
// Usuario ingresa código especial
if (invitationCode === 'MEDICO-2024') {
  await assignUserReference(userId, 'medicos-ref-id')
}
```

---

## 🎛️ **PANEL DE CONTROL PARA ADMIN**

### **Funcionalidades Disponibles:**
- ✅ Ver todas las referencias
- ✅ Crear nuevas referencias  
- ✅ Asignar tarifas por defecto
- ✅ Activar/desactivar referencias
- ✅ Asignar usuarios a referencias específicas

### **Funcionalidades Pendientes:**
- 🔄 Panel para ver usuarios asignados por referencia
- 🔄 Búsqueda de usuarios para asignación masiva
- 🔄 Códigos de invitación automáticos
- 🔄 Detección por dominio de email (@clinica.com)

---

## 🚀 **PRÓXIMOS PASOS RECOMENDADOS**

### **PASO 1**: Ejecutar migración
```sql
-- scripts/SIMPLE-MIGRATION-SUPABASE.sql
```

### **PASO 2**: Configurar referencias principales
```sql
UPDATE references 
SET default_tariff_id = (SELECT id FROM tariffs WHERE name = 'Base')
WHERE name = 'Público General';

UPDATE references 
SET default_tariff_id = (SELECT id FROM tariffs WHERE name = 'Referencial con IGV')
WHERE name = 'Empresas';
```

### **PASO 3**: Asignar usuarios existentes
```typescript
// En el código
await assignBusinessUsersToReferences()
```

---

## 🎯 **RESPUESTAS DIRECTAS**

| **Pregunta** | **Respuesta** |
|--------------|---------------|
| **¿Según conexión?** | No, según **usuario autenticado** |
| **¿Según usuario?** | **SÍ** - cada usuario tiene contexto de tarifa |
| **¿Según rol?** | **SÍ** - rol determina referencia por defecto |
| **¿Cómo detectar?** | **getUserTariffContext()** ya implementado |

---

## ⚠️ **PUNTOS CRÍTICOS A RESOLVER**

1. **Usuarios sin asignación** → Se les asigna "Público General"
2. **Múltiples referencias** → Se usa la primera encontrada  
3. **Referencias inactivas** → Sistema debe validar estado
4. **Usuarios empresariales** → Deben asignarse automáticamente

---

**🏁 CONCLUSIÓN:** 
El sistema ya tiene la lógica implementada, solo necesita:
1. Ejecutar la migración de precios
2. Configurar las referencias por defecto  
3. Asignar usuarios existentes a sus referencias 