import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

const ORION_API_KEY = "etFJbEqH317VuCwP4AuLwOIdRT9ytRaCUUdbR3cEhcqViKBcmeUSm9rJ9WL5";
const BASE_URL = "https://laboratoriolopez.orion-labs.com/api/v1";

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
  
  // Encabezados de tabla
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text("EXAMEN", margin, y);
  doc.text("RESULTADO", margin + 80, y);
  doc.text("FECHA", margin + 130, y);
  y += 5;
  
  // Línea divisoria
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, margin + width, y);
  y += 5;
  
  // Detalles de cada examen
  doc.setFont(undefined, 'normal');
  
  if (orden.examenes && orden.examenes.length > 0) {
    orden.examenes.forEach((examen: any) => {
      // Nombre del examen
      doc.text(examen.nombre, margin, y);
      
      // Si hay resultado (en un caso real, buscarías el valor en los detalles del examen)
      const resultado = examen.resultado || "Consultar informe completo";
      doc.text(resultado, margin + 80, y);
      
      // Fecha del resultado
      if (examen.fecha_reporte) {
        const fechaReporte = new Date(examen.fecha_reporte);
        doc.text(fechaReporte.toLocaleDateString('es-ES'), margin + 130, y);
      }
      
      y += 7;
      
      // Si estamos cerca del final de la página, crear una nueva
      if (y > doc.internal.pageSize.height - 30) {
        doc.addPage();
        y = 20;
      }
    });
  } else {
    doc.text("No hay resultados disponibles", margin, y);
    y += 7;
  }
  
  // Pie de página
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(150, 150, 150);
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

    // Relaciones a incluir
    const relacionesAIncluir = "paciente,categoria,medico,examenes";
    
    // Hacer solicitud a la API de Orion para obtener los datos de la orden
    const detailsEndpoint = `/ordenes/${orderId}?incluir=${relacionesAIncluir}`;
    const detailsResponse = await fetchFromOrion(detailsEndpoint);
    
    if (!detailsResponse || !detailsResponse.data) {
      return NextResponse.json({ error: "No se pudo obtener información de la orden" }, { status: 404 });
    }

    // Generar el PDF
    const pdfBuffer = generatePDF(detailsResponse.data);
    
    // Configurar el nombre del archivo
    const orden = detailsResponse.data;
    const nombrePaciente = `${orden.paciente.apellidos}_${orden.paciente.nombres}`.replace(/\s+/g, '_');
    const numeroOrden = orden.numero_orden;
    const filename = `Resultados_${numeroOrden}_${nombrePaciente}.pdf`;
    
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
    return NextResponse.json({ error: `Error al generar PDF: ${message}` }, { status: 500 });
  }
} 