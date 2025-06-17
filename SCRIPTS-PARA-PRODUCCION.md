# 🚀 Scripts para Ejecutar en Producción - Laboratorio López

## 📋 **ORDEN DE EJECUCIÓN**

### 1️⃣ **ANÁLISIS - Segmentación de Precios**
**Archivo**: `scripts/add-analyses-segmentation-fields.sql`
**Propósito**: Agregar campos `reference_price` y `show_public` a tabla `analyses`

```sql
-- Este script agrega:
-- ✅ reference_price DECIMAL(10,2) - Precio para médicos/empresas
-- ✅ show_public BOOLEAN - Control de visibilidad pública
-- ✅ Índices para performance
-- ✅ Datos de ejemplo configurados
```

### 2️⃣ **BIBLIOTECA DIGITAL - Control de Precios**
**Archivo**: `scripts/add-show-prices-setting.sql`
**Propósito**: Agregar control de visibilidad de precios en promociones

```sql
-- Este script agrega:
-- ✅ mostrar_precios BOOLEAN - Control admin de visibilidad
-- ✅ Configuración inicial de la sección
```

### 3️⃣ **BIBLIOTECA DIGITAL - Precios Diferenciados**
**Archivo**: `scripts/add-differential-pricing-biblioteca.sql`
**Propósito**: Agregar campos de audiencia y precios diferenciados

```sql
-- Este script agrega:
-- ✅ precio_referencia DECIMAL(10,2) - Precio empresarial
-- ✅ audiencia_objetivo VARCHAR(20) - Tipo de audiencia
-- ✅ Índices para performance
```

---

## 🎯 **DESPUÉS DE EJECUTAR LOS SCRIPTS**

### ✅ **ANÁLISIS - Funcionalidades Habilitadas:**
- 🏥 **Médicos/Empresas**: Solo ven análisis con `show_public = false`
- 👥 **Público**: Solo ve análisis con `show_public = true`
- 💰 **Precios diferenciados**: Público ve `price`, Empresas ven `reference_price`
- 🔒 **Protección comercial**: Cada rol solo ve SUS precios

### ✅ **BIBLIOTECA DIGITAL - Funcionalidades Habilitadas:**
- 👑 **Admin**: Control total de visibilidad de precios con toggle
- 📝 **Artículos**: Cada uno puede tener audiencia específica
- 💰 **Precios duales**: Público + Empresarial por artículo
- 🎯 **Segmentación**: Contenido específico por tipo de usuario

---

## 🔧 **VERIFICACIÓN POST-INSTALACIÓN**

### Verificar tabla `analyses`:
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'analyses' 
AND column_name IN ('reference_price', 'show_public');
```

### Verificar tabla `biblioteca_digital`:
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'biblioteca_digital' 
AND column_name IN ('precio_referencia', 'audiencia_objetivo');
```

### Verificar configuración de sección:
```sql
SELECT * FROM configuracion_secciones WHERE seccion = 'biblioteca_digital';
```

---

## 🚨 **IMPORTANTE**

1. **Ejecutar en orden**: Los scripts deben ejecutarse en el orden listado
2. **Backup**: Hacer backup de la BD antes de ejecutar
3. **Verificar**: Usar las consultas de verificación después de cada script
4. **Datos de prueba**: Los scripts incluyen datos de ejemplo configurados

---

## 📊 **RESULTADOS ESPERADOS**

### ✅ **Sistema de Análisis:**
- Segmentación completa por roles
- Precios diferenciados funcionando
- Protección de información comercial

### ✅ **Sistema de Biblioteca:**
- Control admin de precios en promociones
- Artículos con audiencia específica
- Precios duales por artículo

### ✅ **Ambos Sistemas:**
- Sincronización total con la base de datos
- Funcionalidad completa en producción
- Experiencia de usuario optimizada por rol 