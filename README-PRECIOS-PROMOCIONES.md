# Control de Precios en Promociones Disponibles

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