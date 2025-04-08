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

    // 1. Construir endpoint para la búsqueda inicial en Orion
    let initialEndpoint = "";
    const relacionesAIncluir = "paciente,categoria,medico,examenes"; // Definir relaciones una vez

    if (searchType === "identificacion") {
      initialEndpoint = `/ordenes?paciente.numero_identificacion=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}`;
    } else if (searchType === "orden") { 
      initialEndpoint = `/ordenes?numero_orden=${encodeURIComponent(searchValue)}&incluir=${relacionesAIncluir}`;
    } else {
      console.error(`Tipo de búsqueda no soportado: ${searchType}`);
      return NextResponse.json({ success: false, message: "Tipo de búsqueda no válido." }, { status: 400 });
    }
    console.log(`Endpoint inicial (con incluir): ${initialEndpoint}`);

    // 2. Realizar la búsqueda inicial en Orion
    const initialResponse = await fetchFromOrion(initialEndpoint);

    // Verificar si Orion devolvió un error explícito
    if (initialResponse && initialResponse.success === false) {
        console.log("Orion devolvió success: false", initialResponse.message);
        return NextResponse.json({ success: false, message: initialResponse.message || "Error reportado por Orion." });
    }

    // Verificar si hay datos válidos en la respuesta
    if (!initialResponse || !initialResponse.data || !Array.isArray(initialResponse.data)) {
      console.log("Respuesta inicial de Orion no contiene 'data' como array válido.")
      // Intentar devolver el mensaje de error de Orion si existe
      const errorMessage = initialResponse?.message || "No se encontraron resultados o la respuesta de Orion no es válida.";
      return NextResponse.json({ success: false, message: errorMessage });
    }

    // Si la respuesta inicial está vacía
    if (initialResponse.data.length === 0) {
      console.log("La búsqueda inicial en Orion no devolvió resultados.")
      return NextResponse.json({ success: false, message: "No se encontraron resultados." });
    }
    
    console.log(`Búsqueda inicial devolvió ${initialResponse.data.length} resultado(s) de Orion.`);

    let finalResults: OrdenData[] = [];

    // 3. Filtrado estricto y obtención de detalles (si aplica)
    if (searchType === "orden") {
      console.log(`Filtrando resultados para número de orden EXACTO: ${searchValue}`);
      const exactMatches = initialResponse.data.filter((orden: OrdenData) => 
        orden.numero_orden === searchValue
      );

      if (exactMatches.length === 0) {
        console.log(`¡NINGUNA coincidencia EXACTA encontrada para ${searchValue} en la respuesta de Orion!`);
        return NextResponse.json({ success: false, message: `No se encontró la orden exacta ${searchValue}.` });
      }

      console.log(`Se encontró ${exactMatches.length} coincidencia(s) EXACTA(s). Usando la primera (ID: ${exactMatches[0].id}).`);
      const ordenExacta = exactMatches[0];

      // Intentar obtener detalles completos para la orden exacta
      try {
        const detailsEndpoint = `/ordenes/${ordenExacta.id}?incluir=${relacionesAIncluir}`;
        console.log(`Intentando obtener detalles (con incluir) para ID: ${ordenExacta.id}, Endpoint: ${detailsEndpoint}`);
        const detailsResponse = await fetchFromOrion(detailsEndpoint);

        if (detailsResponse && detailsResponse.data && typeof detailsResponse.data === 'object') {
          console.log(`Detalles completos obtenidos para ID: ${ordenExacta.id}`);
          finalResults = [detailsResponse.data as OrdenData]; // Usar los datos detallados
        } else {
          console.warn(`No se pudieron obtener detalles completos válidos para ID: ${ordenExacta.id}. Usando datos de la búsqueda inicial.`);
          finalResults = [ordenExacta]; // Usar datos de la búsqueda inicial como fallback
        }
      } catch (detailsError) {
        console.error(`Error al obtener detalles para ID: ${ordenExacta.id}. Usando datos de la búsqueda inicial.`, detailsError);
        finalResults = [ordenExacta]; // Usar datos de la búsqueda inicial como fallback
      }

    } else { // Búsqueda por identificación (u otro tipo futuro)
      console.log("Procesando resultados de búsqueda por identificación.");
      // FILTRADO ESTRICTO para identificación:
      console.log(`Filtrando resultados por identificación EXACTA: ${searchValue}`);
      if (initialResponse.data && Array.isArray(initialResponse.data)) {
          finalResults = initialResponse.data.filter((orden: OrdenData) => {
              // Verificar si el paciente existe y tiene numero_identificacion
              const pacienteIdentificacion = orden.paciente?.numero_identificacion;
              // Comparar la identificación del paciente de la orden con la buscada
              const match = pacienteIdentificacion === searchValue;
              if (!match) {
                  console.log(` - Descartando orden ID ${orden.id}: Paciente ID ${pacienteIdentificacion} !== ${searchValue}`);
              }
              return match;
          });

          if (finalResults.length === 0 && initialResponse.data.length > 0) {
              console.log(`¡NINGUNA coincidencia EXACTA encontrada para ID ${searchValue} después del filtro! La API devolvió ${initialResponse.data.length} resultados iniciales.`);
          } else {
              console.log(`Se encontraron ${finalResults.length} coincidencia(s) EXACTA(s) para la identificación ${searchValue} después del filtro.`);
          }
      } else {
          // Si initialResponse.data no es un array, finalResults ya está inicializado como []
          console.log("La respuesta inicial de Orion no contenía un array 'data' para filtrar por identificación.");
          finalResults = [];
      }

      // Opcional: Si quisiéramos forzar detalles para el primero (ya no es necesario si 'incluir' funciona bien):
      // if (finalResults.length > 0) {
      //   try {
      //      const detailsEndpoint = `/ordenes/${finalResults[0].id}?incluir=${relacionesAIncluir}`;
      //      const detailsResponse = await fetchFromOrion(detailsEndpoint);
      //      if(detailsResponse.data) { finalResults = [detailsResponse.data as OrdenData] }
      //   } catch {}
      // }
    }

    // 4. Devolver la respuesta final
    if (finalResults.length === 0) {
        // Esto no debería pasar si llegamos aquí después del filtro de orden, pero por seguridad.
        console.log("Después de procesar, no hay resultados finales.");
        return NextResponse.json({ success: false, message: "No se encontraron resultados procesables." });
    }

    console.log(`\n=== FIN PROCESO GET - Devolviendo ${finalResults.length} resultado(s) ===`);
    return NextResponse.json({
      success: true,
      data: finalResults, // Siempre será un array
      message: `Se encontraron ${finalResults.length} resultado(s).`,
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