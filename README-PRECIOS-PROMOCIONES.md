# 🏥 Sistema de Precios y Promociones - Laboratorio López

## 📋 Descripción
Se ha implementado un sistema para que el administrador pueda controlar si mostrar o no los precios **SOLO en la sección "Promociones Disponibles" de la página principal**. 

**IMPORTANTE**: Los precios dentro de cada artículo individual SIEMPRE se muestran, independientemente de esta configuración.

## 🚀 Funcionalidades Implementadas

### Para Usuarios Normales
- **Precios ocultos por defecto en el grid**: Los precios no se muestran en las tarjetas de promociones de la página principal
- **Precios SIEMPRE visibles dentro del artículo**: Al entrar a un perfil individual, el precio siempre se muestra si existe
- **Experiencia visual limpia**: Solo se ven las promociones sin información de precios en la página principal

### Para Administradores
- **Control de visibilidad en página principal**: Botón "Mostrar Precios" / "Ocultar Precios" SOLO afecta el grid principal
- **Edición de título**: Posibilidad de editar el título de la sección "Promociones Disponibles"
- **Gestión de contenido**: Acceso a editar cada promoción individual
- **Precios en artículos individuales**: SIEMPRE visibles, sin control de admin

## 🛠 Implementación Técnica

### Base de Datos
- Se agregó la columna `mostrar_precios` a la tabla `configuracion_secciones`
- Por defecto está en `FALSE` (precios ocultos en grid principal)
- **NO afecta** los precios dentro de artículos individuales

### Componentes Modificados
- `components/digital-library.tsx`: Control de precios SOLO para el grid principal
- `app/biblioteca/[slug]/page.tsx`: Precios SIEMPRE visibles en artículos individuales
- Script SQL: `scripts/add-show-prices-setting.sql`

### Configuración
```sql
-- Estado actual de la configuración (SOLO afecta página principal)
SELECT seccion, titulo, mostrar_precios 
FROM configuracion_secciones 
WHERE seccion = 'biblioteca_digital';
```

## 📱 Interfaz de Usuario

### Estados Visuales

#### Página Principal (Grid de Promociones)
- **Precios Ocultos**: Solo imagen, título, descripción y botón "Ver promoción"
- **Precios Visibles**: Incluye etiqueta verde con precio en la esquina inferior izquierda

#### Artículo Individual (Dentro del perfil)
- **SIEMPRE con precio**: Si el artículo tiene precio, se muestra en una tarjeta verde especial
- **Sin precio**: Si no tiene precio, no se muestra la tarjeta de precio
- **Independiente del admin**: No importa si el admin activó o desactivó precios en el grid

### Controles de Administrador
1. **Botón de Configuración de Precios** (Solo página principal):
   - Verde: Precios visibles en grid
   - Gris: Precios ocultos en grid
   - Icono de configuración (⚙️)

2. **Botón de Edición de Título**:
   - Permite cambiar "Promociones Disponibles" por otro texto
   - Se guarda automáticamente en la base de datos

## 🔧 Uso

### Para Mostrar Precios en Grid Principal
1. Iniciar sesión como administrador
2. Ir a la página principal
3. Encontrar la sección "Promociones Disponibles"
4. Hacer clic en "Mostrar Precios"
5. Los precios aparecerán en las tarjetas del grid

### Para Ocultar Precios en Grid Principal
1. Hacer clic en "Ocultar Precios"
2. Los precios desaparecerán del grid principal
3. **Los precios dentro de artículos individuales NO se ven afectados**

### Artículos Individuales
- **Siempre muestran precio**: Si tienen precio definido
- **No hay control de admin**: Funcionan independientemente de la configuración del grid
- **Consistencia**: El precio es el mismo que se muestra en el grid (cuando está activado)

## 🎯 Beneficios

1. **Flexibilidad en página principal**: El administrador puede decidir si mostrar precios en el grid
2. **Información completa en artículos**: Los usuarios siempre ven el precio al entrar al detalle
3. **Control Total**: Posibilidad de personalizar títulos y precios del grid
4. **Experiencia coherente**: Los precios están sincronizados entre grid e individual
5. **Tiempo Real**: Los cambios en el grid se aplican inmediatamente

## 🔒 Permisos

- **Solo administradores** pueden controlar la visibilidad de precios en el grid principal
- **Usuarios normales** siempre ven precios en artículos individuales (si existen)
- **Médicos y empresas** pueden ver precios en artículos individuales
- Los cambios de configuración se guardan permanentemente

## 📊 Estados Posibles

| Ubicación | Control Admin | Comportamiento |
|-----------|---------------|----------------|
| Grid Principal | ✅ Sí | Mostrar/Ocultar según configuración |
| Artículo Individual | ❌ No | SIEMPRE mostrar si existe precio |

## 🔄 Flujo de Trabajo

1. **Grid principal**: Carga con precios ocultos por defecto
2. **Admin puede activar**: Para mostrar precios en el grid
3. **Artículos individuales**: SIEMPRE muestran precio independientemente
4. **Sincronización**: El precio mostrado es el mismo en ambos lugares
5. **Persistencia**: La configuración del grid se mantiene entre sesiones

---

**Nota**: Esta funcionalidad está diseñada para dar control sobre la presentación de precios en la página principal, manteniendo SIEMPRE la información completa de precios disponible en cada artículo individual. 

## 📊 Funcionalidades Implementadas

### 1. 🎯 Control de Visibilidad de Precios en Promociones
**Ubicación**: Página principal - Sección "Promociones Disponibles"

**Funcionalidad**:
- ✅ Admin puede mostrar/ocultar precios con botón toggle
- ✅ Estado guardado en base de datos (`configuracion_secciones.mostrar_precios`)
- ✅ Solo admin ve los controles de configuración
- ✅ Usuarios ven precios según configuración del admin

**Controles de Admin**:
- 🟢 **"Mostrar Precios"** - Muestra precios en las tarjetas promocionales
- 🔘 **"Ocultar Precios"** - Oculta precios de las tarjetas promocionales
- ✏️ **Editar título** - Permite cambiar "Promociones Disponibles"

### 2. 💰 Sistema de Precios Diferenciados por Audiencia

**Nueva Funcionalidad**: El admin puede configurar cada artículo con:

#### 📋 Al Agregar Artículo:
- **Audiencia Objetivo**: 
  - 👥 **Público general** - Para pacientes y público no registrado
  - 🏥 **Médicos y Empresas** - Para usuarios corporativos

- **Precio Dinámico**: 
  - Si audiencia = "público" → Campo muestra "💰 Precio Público (Ej: 200.00)"
  - Si audiencia = "médicos/empresas" → Campo muestra "🏢 Precio Empresarial (Ej: 150.00)"

#### ✏️ Al Editar Artículo:
- **Audiencia Objetivo**: Selector para cambiar audiencia
- **💰 Precio Público**: Para pacientes (campo verde)
- **🏢 Precio Empresarial**: Para médicos/empresas - OPCIONAL (campo azul)

**Ventajas**:
- 🎯 **Segmentación clara** de precios por tipo de usuario
- 💡 **Interfaz intuitiva** con colores y emojis diferenciadores
- 🔄 **Flexibilidad total** - cada artículo puede tener su propia audiencia
- 💾 **Persistencia** - configuración guardada en base de datos

### 3. 🔍 Comportamiento de Precios por Página

#### 🏠 Página Principal (Promociones):
- **Controlado por admin**: Toggle "Mostrar/Ocultar Precios"
- **Si están ocultos**: No se muestran precios en ninguna tarjeta
- **Si están visibles**: Se muestran precios según configuración

#### 📖 Páginas Individuales de Artículos:
- **SIEMPRE muestran precios** si existen (no afectado por toggle del admin)
- **Comportamiento según audiencia**:
  - Artículo para "público" → Muestra precio público
  - Artículo para "médicos/empresas" → Muestra precio empresarial

## 🗃️ Estructura de Base de Datos

### Tabla: `biblioteca_digital`
```sql
-- Campos nuevos agregados:
ALTER TABLE biblioteca_digital
ADD COLUMN precio_referencia DECIMAL(10,2);      -- Precio para médicos/empresas
ADD COLUMN audiencia_objetivo VARCHAR(20) DEFAULT 'publico';  -- 'publico' | 'medicos_empresas'
```

### Tabla: `configuracion_secciones`
```sql
-- Campo para controlar visibilidad de precios:
mostrar_precios BOOLEAN DEFAULT FALSE;  -- Control del admin para mostrar/ocultar precios
```

## 🔧 Roles y Permisos

### 👑 Admin
- ✅ Ve todos los controles de configuración
- ✅ Puede mostrar/ocultar precios en promociones
- ✅ Puede agregar/editar artículos con precios diferenciados
- ✅ Puede cambiar audiencia objetivo de artículos
- ✅ Puede editar título de la sección

### 👥 Pacientes/Público
- ❌ No ven controles de admin
- ✅ Ven precios públicos según configuración
- ✅ Solo acceden a artículos para "público general"

### 🏥 Médicos/Empresas  
- ❌ No ven controles de admin
- ✅ Ven precios empresariales cuando existen
- ✅ Solo acceden a artículos para "médicos y empresas"
- 🔒 **NO ven artículos marcados como "público"** (protección de preferenciales)

## 🎨 Características de UI/UX

### 🎯 Indicadores Visuales:
- **🟢 Botón Verde**: Precios visibles
- **⚪ Botón Gris**: Precios ocultos
- **💰 Verde**: Campos de precio público
- **🏢 Azul**: Campos de precio empresarial
- **👥/🏥 Emojis**: Diferenciación clara de audiencias

### 📱 Responsive Design:
- ✅ Funciona en móviles, tablets y desktop
- ✅ Controles de admin adaptativos
- ✅ Formularios optimizados para touch

## 🚀 Beneficios del Sistema

1. **🎯 Segmentación Efectiva**: Precios diferenciados por tipo de cliente
2. **🔒 Protección Comercial**: Médicos/empresas no ven precios públicos
3. **👑 Control Total**: Admin decide qué se muestra y cuándo
4. **📊 Flexibilidad**: Cada artículo puede tener su propia configuración
5. **💡 UX Intuitiva**: Interfaz clara y fácil de usar
6. **🔄 Sincronización**: Cambios se reflejan inmediatamente en la web

## 📋 Scripts de Base de Datos

### Para aplicar las nuevas funcionalidades:
1. `scripts/add-show-prices-setting.sql` - Control de visibilidad de precios
2. `scripts/add-differential-pricing-biblioteca.sql` - Precios diferenciados por audiencia
3. `scripts/update-section-titles.sql` - Configuración de títulos editables

### Verificación:
```sql
-- Verificar nuevas columnas
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'biblioteca_digital' 
AND column_name IN ('precio_referencia', 'audiencia_objetivo');
```

---

## 📞 Notas Técnicas

- **Compatibilidad**: Sistema compatible con todos los navegadores modernos
- **Performance**: Consultas optimizadas con índices en campos clave
- **Seguridad**: Validaciones tanto en frontend como backend
- **Mantenimiento**: Código modular y bien documentado para futuras actualizaciones