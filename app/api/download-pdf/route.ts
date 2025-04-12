import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

const ORION_API_KEY = "etFJbEqH317VuCwP4AuLwOIdRT9ytRaCUUdbR3cEhcqViKBcmeUSm9rJ9WL5";
const BASE_URL = "https://laboratoriolopez.orion-labs.com/api/v1";
const USE_MOCK_DATA = false; // Desactivar modo mock - SIEMPRE debe ir a la base de datos

// Estructura anónima para fallback sólo para los campos requeridos, SIN datos reales
const ESTRUCTURA_FALLBACK = {
  success: true,
  data: {
    numero_orden: "[NÚMERO DE ORDEN]",
    fecha_orden: new Date().toISOString(),
    estado: "Pendiente",
    paciente: {
      apellidos: "[APELLIDOS]",
      nombres: "[NOMBRES]",
      tipo_identificacion: "DOC", 
      numero_identificacion: "[NÚMERO]",
      sexo: "X"
    },
    medico: {
      apellidos: "[MÉDICO]",
      nombres: "[REMITENTE]"
    },
    examenes: []
  }
};

/**
 * Realiza una petición a la API de Orion
 */
async function fetchFromOrion(path: string) {
  const url = `${BASE_URL}${path}`;
  console.log("Fetching from Orion:", url);

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ORION_API_KEY}`
  };

  try {
    const response = await fetch(url, { 
      headers,
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Error HTTP ${response.status} de Orion al obtener ${path}`);
      throw new Error(`Error HTTP ${response.status} de Orion`);
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error en la petición fetch a Orion:", error);
    throw error;
  }
}

/**
 * Genera un PDF con los resultados de la orden
 */
function generatePDF(orden: any): ArrayBuffer {
  // Crear un nuevo documento PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Definir variables para posicionamiento
  let y = 20;
  const margin = 20;
  const width = doc.internal.pageSize.width - 2 * margin;
  
  // Añadir logo o encabezado
  doc.setFontSize(18);
  doc.setTextColor(30, 95, 173); // Color azul de Lopez Lab
  doc.text("LABORATORIO LÓPEZ", margin, y);
  
  y += 8;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Resultados de Análisis", margin, y);
  
  // Información de la orden
  y += 15;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`N° Orden: ${orden.numero_orden}`, margin, y);
  y += 6;
  
  // Formatear fecha
  const fechaOrden = new Date(orden.fecha_orden);
  const fechaFormateada = fechaOrden.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Fecha: ${fechaFormateada}`, margin, y);
  y += 10;
  
  // Información del paciente
  doc.setFontSize(11);
  doc.setTextColor(30, 95, 173);
  doc.text("DATOS DEL PACIENTE", margin, y);
  y += 6;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Paciente: ${orden.paciente.apellidos} ${orden.paciente.nombres}`, margin, y);
  y += 6;
  doc.text(`Identificación: ${orden.paciente.tipo_identificacion} ${orden.paciente.numero_identificacion}`, margin, y);
  y += 6;
  
  if (orden.paciente.fecha_nacimiento) {
    const fechaNacimiento = new Date(orden.paciente.fecha_nacimiento);
    const edad = Math.floor((new Date().getTime() - fechaNacimiento.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    doc.text(`Fecha Nac.: ${fechaNacimiento.toLocaleDateString('es-ES')} (${edad} años)`, margin, y);
    y += 6;
  }
  
  doc.text(`Sexo: ${orden.paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}`, margin, y);
  y += 10;
  
  // Información del médico
  if (orden.medico) {
    doc.setFontSize(11);
    doc.setTextColor(30, 95, 173);
    doc.text("MÉDICO", margin, y);
    y += 6;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${orden.medico.apellidos} ${orden.medico.nombres}`, margin, y);
    y += 10;
  }
  
  // Resultados de exámenes
  doc.setFontSize(11);
  doc.setTextColor(30, 95, 173);
  doc.text("RESULTADOS", margin, y);
  y += 8;
  
  // Detalles de cada examen
  if (orden.examenes && orden.examenes.length > 0) {
    for (const examen of orden.examenes) {
      // Encabezados del examen
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text("EXAMEN", margin, y);
      doc.text("RESULTADO", margin + 100, y);
      doc.text("FECHA", margin + 150, y);
      y += 5;
      
      // Línea divisoria
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, margin + width, y);
      y += 5;
      
      // Nombre del examen y resultado
      doc.setFont(undefined, 'normal');
      doc.text(examen.nombre.toUpperCase(), margin, y);
      doc.text(examen.estado || "Pendiente", margin + 100, y);
      
      // Fecha del resultado
      if (examen.fecha_reporte) {
        const fechaReporte = new Date(examen.fecha_reporte);
        doc.text(fechaReporte.toLocaleDateString('es-ES'), margin + 150, y);
      }
      
      y += 12; // Espacio después del nombre del examen
      
      // Si hay resultados detallados
      if (examen.resultados && examen.resultados.length > 0) {
        // Encabezados de la tabla de parámetros
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("PARÁMETRO", margin, y);
        doc.text("RESULTADO", margin + 70, y);
        doc.text("UNIDAD", margin + 110, y);
        doc.text("RANGO DE REFERENCIA", margin + 150, y);
        y += 5;
        
        // Línea divisoria para la tabla de parámetros
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, margin + width, y);
        y += 5;
        
        // Valores de cada parámetro
        doc.setFont(undefined, 'normal');
        
        for (const parametro of examen.resultados) {
          // Saltar encabezados o parámetros sin valor real
          if (parametro.estado === "Título" || (!parametro.valor && !parametro.unidad)) {
            if (parametro.nombre) {
              // Es un encabezado de sección
              doc.setFont(undefined, 'bold');
              doc.text(parametro.nombre, margin, y);
              doc.setFont(undefined, 'normal');
              y += 5;
            }
            continue;
          }
          
          // Establecer color según el estado del resultado
          if (parametro.estado === "Alterado" || parametro.estado === "Alto" || parametro.estado === "Bajo") {
            doc.setTextColor(200, 0, 0); // Rojo para valores fuera de rango
          } else {
            doc.setTextColor(0, 0, 0); // Negro para valores normales
          }
          
          // Imprimir cada valor
          doc.text(parametro.nombre, margin, y);
          doc.text(parametro.valor, margin + 70, y);
          doc.text(parametro.unidad, margin + 110, y);
          doc.text(parametro.rango_referencia, margin + 150, y);
          
          y += 5;
          
          // Si estamos cerca del final de la página, crear una nueva
          if (y > doc.internal.pageSize.height - 30) {
            doc.addPage();
            y = 20;
            
            // Repetir encabezados en la nueva página
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text("PARÁMETRO", margin, y);
            doc.text("RESULTADO", margin + 70, y);
            doc.text("UNIDAD", margin + 110, y);
            doc.text("RANGO DE REFERENCIA", margin + 150, y);
            y += 5;
            
            doc.setDrawColor(220, 220, 220);
            doc.line(margin, y, margin + width, y);
            y += 5;
            doc.setFont(undefined, 'normal');
          }
        }
      }
      
      // Agregar interpretación si existe
      if (examen.interpretacion) {
        y += 8;
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text("INTERPRETACIÓN:", margin, y);
        y += 5;
        
        doc.setFont(undefined, 'normal');
        const textLines = doc.splitTextToSize(examen.interpretacion, width);
        doc.text(textLines, margin, y);
        y += textLines.length * 5;
      }
      
      // Espacio entre exámenes
      y += 15;
      
      // Nueva página si es necesario
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 20;
      }
    }
  } else {
    doc.setFontSize(10);
    doc.text("No hay resultados disponibles", margin, y);
    y += 7;
  }
  
  // Pie de página
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, margin, doc.internal.pageSize.height - 10);
    doc.text("Este documento es solo para fines informativos.", doc.internal.pageSize.width - margin - 80, doc.internal.pageSize.height - 10);
  }
  
  // Convertir a ArrayBuffer
  return doc.output('arraybuffer');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Se requiere el ID de la orden" }, { status: 400 });
    }

    // Relaciones a incluir - asegurarnos de que incluya resultados y detalles
    const relacionesAIncluir = "paciente,categoria,medico,examenes,examenes.resultados";
    
    // Hacer solicitud a la API de Orion para obtener los datos de la orden con todos los detalles
    const detailsEndpoint = `/ordenes/${orderId}?incluir=${relacionesAIncluir}`;
    const detailsResponse = await fetchFromOrion(detailsEndpoint);
    
    if (!detailsResponse || !detailsResponse.data) {
      return NextResponse.json({ error: "No se pudo obtener información de la orden. Por favor verifique el número de orden e intente nuevamente." }, { status: 404 });
    }

    // También obtener los resultados específicos del examen si disponibles
    if (detailsResponse.data.examenes && detailsResponse.data.examenes.length > 0) {
      // Para cada examen en la orden, intentar obtener sus resultados detallados si no están ya incluidos
      const examenesProcesados = await Promise.all(
        detailsResponse.data.examenes.map(async (examen: any) => {
          // Si ya tiene resultados detallados, no hacemos otra llamada
          if (examen.resultados && examen.resultados.length > 0) {
            return examen;
          }
          
          try {
            // Intentar obtener resultados detallados para este examen específico
            const examenEndpoint = `/examenes/${examen.id}/resultados`;
            const examenResponse = await fetchFromOrion(examenEndpoint);
            
            if (examenResponse && examenResponse.data) {
              // Agregar los resultados detallados al objeto de examen
              return {
                ...examen,
                resultados: examenResponse.data
              };
            }
          } catch (error) {
            console.error(`Error al obtener resultados para examen ${examen.id}:`, error);
          }
          
          return examen;
        })
      );
      
      // Reemplazar los exámenes en la respuesta original con los procesados
      detailsResponse.data.examenes = examenesProcesados;
    }

    // Generar el PDF con todos los datos obtenidos de la base de datos
    const pdfBuffer = generatePDF(detailsResponse.data);
    
    // Configurar el nombre del archivo
    const orden = detailsResponse.data;
    let filename = `Resultados_${orden.numero_orden}`;
    
    // Agregar nombre del paciente solo si está disponible
    if (orden.paciente && orden.paciente.apellidos && orden.paciente.nombres) {
      const nombrePaciente = `${orden.paciente.apellidos}_${orden.paciente.nombres}`.replace(/\s+/g, '_');
      filename += `_${nombrePaciente}`;
    }
    
    filename += '.pdf';
    
    // Devolver el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error("Error al generar PDF:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ 
      error: `Error al generar el PDF. Por favor, intente más tarde o contacte a soporte técnico.`,
      details: message 
    }, { status: 500 });
  }
} 