import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TestResult {
  examen: string;
  resultado: string;
  unidad: string;
  valor_referencia: string;
}

interface TestResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | number;
  orderNumber: string;
  patientName: string;
  patientId?: string;
  testDate?: string;
}

// Datos de ejemplo para mostrar cuando la API falla
const SAMPLE_RESULTS = {
  "HEMATOLOGÍA": [
    {
      examen: "HEMOGRAMA AUTOMATIZADO",
      resultado: "",
      unidad: "",
      valor_referencia: ""
    },
    {
      examen: "Glóbulos Blancos",
      resultado: "8.36",
      unidad: "10³/µL",
      valor_referencia: "4 - 11"
    },
    {
      examen: "Neutrófilos (%)",
      resultado: "65.5",
      unidad: "%",
      valor_referencia: "50 - 70"
    },
    {
      examen: "Linfocitos (%)",
      resultado: "24.2",
      unidad: "%",
      valor_referencia: "25 - 40"
    },
    {
      examen: "Monocitos (%)",
      resultado: "8.1",
      unidad: "%",
      valor_referencia: "2 - 10"
    },
    {
      examen: "Eosinófilos (%)",
      resultado: "2.1",
      unidad: "%",
      valor_referencia: "0 - 5"
    },
    {
      examen: "Basófilos (%)",
      resultado: "0.1",
      unidad: "%",
      valor_referencia: "0 - 1"
    },
    {
      examen: "Glóbulos Rojos",
      resultado: "4.78",
      unidad: "10⁶/µL",
      valor_referencia: "3.5 - 5.5"
    },
    {
      examen: "Hemoglobina",
      resultado: "14.8",
      unidad: "g/dL",
      valor_referencia: "12.3 - 16.3"
    }
  ]
};

export function TestResultsModal({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  patientName,
  patientId,
  testDate,
}: TestResultsModalProps) {
  const [results, setResults] = useState<{ [key: string]: TestResult[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [showSample, setShowSample] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!open) return;
      
      setLoading(true);
      setError("");
      setShowSample(false);
      
      try {
        const response = await fetch(`/api/test-results?orderId=${orderId}`);
        const data = await response.json();
        
        if (!response.ok) {
          console.error(`Error ${response.status}: ${data.message || "Error al obtener resultados"}`);
          throw new Error(data.message || `Error HTTP ${response.status} al obtener resultados`);
        }
        
        if (data.success && data.data && Object.keys(data.data).length > 0) {
          setResults(data.data);
        } else {
          // Si no hay datos reales, usamos los datos de muestra
          console.log("No hay datos reales en la respuesta, usando datos de muestra");
          setResults(SAMPLE_RESULTS);
          setShowSample(true);
        }
      } catch (err) {
        console.error("Error al cargar resultados:", err);
        setError(err instanceof Error ? err.message : "Error al cargar resultados");
        
        // Después de un error, usamos los datos de muestra
        setResults(SAMPLE_RESULTS);
        setShowSample(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [open, orderId, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Si ya tenemos resultados visibles (muestra o reales), mostrar esos
  const shouldShowResults = !loading && (Object.keys(results).length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Resultados</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100" />
        </DialogHeader>
        
        <div className="mt-2">
          <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4 text-sm">
            <div>
              <strong className="text-sm">{orderNumber}</strong> 
              <span className="px-2 text-gray-400">|</span> 
              <span>{patientName}</span>
              {patientId && <span className="text-gray-500 ml-2">{patientId}</span>}
            </div>
            <div>{testDate}</div>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-gray-500">Cargando resultados...</p>
            </div>
          ) : error && !shouldShowResults ? (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <div className="flex justify-center space-x-4">
                <Button onClick={handleRetry} variant="outline" size="sm">
                  Reintentar
                </Button>
                <Button 
                  onClick={() => {
                    setResults(SAMPLE_RESULTS);
                    setShowSample(true);
                  }} 
                  variant="secondary" 
                  size="sm"
                >
                  Mostrar ejemplo
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {shouldShowResults ? (
                <>
                  {showSample && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded text-sm">
                      Nota: Se están mostrando datos de ejemplo ya que no se pudieron obtener los resultados reales.
                    </div>
                  )}
                  {Object.entries(results).map(([category, categoryResults]) => (
                    <div key={category} className="mb-6">
                      <div className="bg-gray-200 py-1 px-2 mb-2 uppercase text-sm font-semibold">
                        {category}
                      </div>
                      
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-2 px-2 text-left border w-1/3">EXAMEN</th>
                            <th className="py-2 px-2 text-left border w-1/3">RESULTADO</th>
                            <th className="py-2 px-2 text-left border w-1/6">UNIDAD</th>
                            <th className="py-2 px-2 text-left border w-1/6">V. REFERENCIA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryResults.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="py-2 px-2 border">{result.examen}</td>
                              <td className="py-2 px-2 border">{result.resultado}</td>
                              <td className="py-2 px-2 border">{result.unidad}</td>
                              <td className="py-2 px-2 border">{result.valor_referencia}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">No hay resultados disponibles</div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <a 
            href={`/api/download-pdf?orderId=${orderId}&useModalData=true`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >
            Descargar PDF
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
} 