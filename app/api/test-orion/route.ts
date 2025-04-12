import { NextRequest, NextResponse } from "next/server"

const ORION_API_KEY = "etFJbEqH317VuCwP4AuLwOIdRT9ytRaCUUdbR3cEhcqViKBcmeUSm9rJ9WL5"
const BASE_URL = "https://laboratoriolopez.orion-labs.com/api/v1"

// Definir interfaces para tipos
interface PacienteData {
  id?: number;
  tipo_identificacion?: string;
  numero_identificacion?: string;
  nombres?: string;
  apellidos?: string;
  nombre_completo?: string;
}

interface OrdenData {
  id: number;
  numero_orden: string;
  fecha_orden: string;
  paciente?: PacienteData;
  [key: string]: any;
}

/**
 * Realiza una petición a la API de Orion
 */
async function fetchFromOrion(path: string) {
  const url = `${BASE_URL}${path}`
  console.log("\n=== REALIZANDO PETICIÓN A ORION ===")
  console.log("URL:", url)

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ORION_API_KEY}`
  }

  try {
    const response = await fetch(url, { 
      headers,
      cache: 'no-store' // Asegurar que no haya caché
    })

    console.log(`Respuesta de Orion - Status: ${response.status}`)
    
    const responseText = await response.text()
    
    // Loguear solo una parte si es muy larga
    console.log("Respuesta de Orion (texto, max 500 chars):", 
      responseText.length > 500 ? responseText.substring(0, 500) + "..." : responseText
    )

    if (!response.ok) {
      // Loguear el error pero continuar para analizar el texto si es posible
      console.error(`Error HTTP ${response.status} de Orion. Respuesta: ${responseText}`)
      // Intentar parsear igualmente por si hay un mensaje de error JSON
      try { return JSON.parse(responseText); } catch { throw new Error(`Error HTTP ${response.status} de Orion`); }
    }

    try {
      const jsonData = JSON.parse(responseText)
      console.log("Respuesta de Orion parseada a JSON correctamente.")
      return jsonData
    } catch (e) {
      console.error("Error al parsear respuesta JSON de Orion:", responseText)
      throw new Error(`Respuesta inválida (no JSON) del servidor Orion`)
    }
  } catch (error) {
    console.error("Error en la petición fetch a Orion:", error)
    // Re-lanzar el error para que sea manejado por el GET principal
    throw error
  }
}

/**
 * Maneja la solicitud GET para buscar órdenes
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchValue = searchParams.get("value")?.trim()
    const searchType = searchParams.get("type") // 'orden' o 'identificacion'

    console.log(`\n=== INICIO PROCESO GET /api/test-orion ===`)
    console.log(`Tipo de búsqueda: ${searchType}, Valor: ${searchValue}`) 

    if (!searchValue) {
      return NextResponse.json({ success: false, message: "Valor de búsqueda requerido." })
    }

    // ESTRATEGIA 1: Buscar según el tipo
    let data: OrdenData[] | null = null;
    let endpoint = "";
    const relacionesAIncluir = "paciente,categoria,medico,examenes"; // Definir relaciones una vez

    if (searchType === "orden") {
      // Usar el formato correcto según la documentación de la API con paginación
      endpoint = `/ordenes?filtrar[numero_orden]=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}&pagina=1`
      
      try {
        console.log(`Buscando con endpoint: ${endpoint}`)
        const result = await fetchFromOrion(endpoint)
        
        // La API devuelve datos en la propiedad data
        if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
          data = result.data
          console.log(`Encontradas ${data.length} órdenes con número exacto`)
        } else {
          console.log(`No se encontraron resultados en búsqueda exacta, probando alternativas...`)
        }
      } catch (error) {
        console.error("Error en búsqueda exacta:", error)
      }
      
      // Probar con número de orden externa
      if (!data) {
        try {
          endpoint = `/ordenes?filtrar[numero_orden_externa]=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}&pagina=1`
          console.log(`Buscando por número de orden externa: ${endpoint}`)
          const result = await fetchFromOrion(endpoint)
          
          if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
            data = result.data
            console.log(`Encontradas ${data.length} órdenes con número externo`)
          }
        } catch (error) {
          console.error("Error en búsqueda por número externo:", error)
        }
      }
      
      // Si no encontramos nada, probar búsqueda directa por ID
      if (!data && /^\d+$/.test(searchValue)) {
        try {
          endpoint = `/ordenes/${encodeURIComponent(searchValue)}?incluir=${relacionesAIncluir}`
          console.log(`Buscando por ID directo: ${endpoint}`)
          const resultById = await fetchFromOrion(endpoint)
          
          if (resultById && resultById.data) {
            // La API devuelve un objeto simple para búsquedas por ID
            data = [resultById.data]
            console.log(`Orden encontrada por ID directo`)
          }
        } catch (idError) {
          console.log(`Búsqueda por ID falló, intentando con otros métodos...`)
        }
      }

      // Probar con búsqueda por código de barras si está disponible en la API
      if (!data) {
        try {
          endpoint = `/ordenes?filtrar[codigo_barras]=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}&pagina=1`
          console.log(`Buscando por código de barras: ${endpoint}`)
          const result = await fetchFromOrion(endpoint)
          
          if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
            data = result.data
            console.log(`Encontradas ${data.length} órdenes por código de barras`)
          }
        } catch (error) {
          console.error("Error en búsqueda por código de barras:", error)
        }
      }

      // Si aún no hay resultados, intentar con órdenes recientes
      if (!data) {
        try {
          endpoint = `/ordenes?incluir=${relacionesAIncluir}&pagina=1`
          console.log(`Buscando órdenes recientes: ${endpoint}`)
          const result = await fetchFromOrion(endpoint)
          
          if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
            // Filtrar localmente por coincidencia parcial
            const filteredOrders = result.data.filter((orden: any) => {
              if (!orden.numero_orden) return false
              // Intentar coincidencia parcial o exacta
              return orden.numero_orden.includes(searchValue) || 
                     orden.numero_orden === searchValue || 
                     String(orden.id) === searchValue
            })
            
            if (filteredOrders.length > 0) {
              data = filteredOrders
              console.log(`Encontradas ${data.length} órdenes por filtrado local`)
            } else {
              // Mostrar órdenes recientes como alternativa
              data = result.data.slice(0, 10)
              console.log(`Mostrando ${data.length} órdenes recientes como alternativa`)
              return NextResponse.json({
                success: true,
                data: data,
                message: `No se encontró la orden ${searchValue}. Mostrando órdenes recientes.`
              })
            }
          }
        } catch (error) {
          console.error("Error en búsqueda alternativa:", error)
        }
      }
    } else if (searchType === "identificacion") {
      try {
        // Usar el formato correcto para filtrar por identificación del paciente
        endpoint = `/ordenes?filtrar[paciente.numero_identificacion]=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}&pagina=1`
        console.log(`Buscando por identificación: ${endpoint}`)
        const result = await fetchFromOrion(endpoint)
        if (result && result.data && Array.isArray(result.data)) {
          data = result.data
          console.log(`Encontradas ${data.length} órdenes por identificación`)
        }
      } catch (error) {
        console.error("Error en búsqueda por identificación:", error)
      }
    } else if (searchType === "medico") {
      try {
        // Para filtrar por médico, probar con diferentes campos según la API
        endpoint = `/ordenes?filtrar[medico.numero_identificacion]=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}&pagina=1`
        console.log(`Buscando por médico (identificación): ${endpoint}`)
        const result = await fetchFromOrion(endpoint)
        if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
          data = result.data
          console.log(`Encontradas ${data.length} órdenes por identificación de médico`)
        } else {
          // Intentar por ID del médico
          endpoint = `/ordenes?filtrar[medico.id_externo]=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}&pagina=1`
          console.log(`Buscando por médico (ID externo): ${endpoint}`)
          const resultById = await fetchFromOrion(endpoint)
          if (resultById && resultById.data && Array.isArray(resultById.data)) {
            data = resultById.data
            console.log(`Encontradas ${data.length} órdenes por ID externo de médico`)
          }
        }
      } catch (error) {
        console.error("Error en búsqueda por médico:", error)
      }
    } else {
      console.error(`Tipo de búsqueda no soportado: ${searchType}`);
      return NextResponse.json({ success: false, message: "Tipo de búsqueda no válido." }, { status: 400 });
    }

    // 4. Devolver la respuesta final
    if (!data || data.length === 0) {
      // Esto no debería pasar si llegamos aquí después del filtro de orden, pero por seguridad.
      console.log("Después de procesar, no hay resultados finales.");
      return NextResponse.json({ success: false, message: "No se encontraron resultados procesables." });
    }

    console.log(`\n=== FIN PROCESO GET - Devolviendo ${data.length} resultado(s) ===`);
    return NextResponse.json({
      success: true,
      data: data,
      message: `Se encontraron ${data.length} resultado(s).`,
    });
    
  } catch (error) {
    // Capturar errores generales (fetch, parseo, etc.)
    console.error("\n=== ERROR GENERAL en GET /api/test-orion ===", error);
    const message = error instanceof Error ? error.message : "Error desconocido en el servidor.";
    return NextResponse.json({
      success: false,
      message: `Error interno del servidor: ${message}`,
    }, { status: 500 });
  }
} 