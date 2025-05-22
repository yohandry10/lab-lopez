import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TestResult {
  examen: string;
  resultado: string;
  unidad: string;
  valor_referencia: string;
  isSubtitulo?: boolean;
  isMetodo?: boolean;
  isResultado?: boolean;
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

  useEffect(() => {
    const fetchResults = async () => {
      if (!open) return;

      setLoading(true);
      setError("");
      setResults({});

      try {
        const response = await fetch(`/api/test-results?orderId=${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Error ${response.status}`);
        }

        if (data.success && data.data && Object.keys(data.data).length > 0) {
          setResults(data.data);
          setError("");
        } else {
          setError(data.message || "No se encontraron resultados de exámenes para esta orden.");
          setResults({});
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar resultados");
        setResults({});
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [open, orderId, retryCount]);

  const handleRetry = () => setRetryCount(prev => prev + 1);

  const hasResults = !loading && Object.keys(results).length > 0;
  const hasError = !loading && !!error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resultados</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogDescription>
          Aquí se muestran los resultados de exámenes de laboratorio para la orden seleccionada.
        </DialogDescription>

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

          {loading && (
            <div className="py-8 text-center">
              <div className="spinner" />
              <p>Cargando resultados...</p>
            </div>
          )}

          {hasError && (
            <div className="py-8 text-center text-red-600">
              <p>{error}</p>
              <Button onClick={handleRetry}>Reintentar</Button>
            </div>
          )}

          {hasResults && (
            <div>
              {Object.entries(results).map(([section, rows]) => (
                <div key={section} className="mb-6">
                  <h3 className="font-semibold uppercase mb-2">{section}</h3>
                  <table className="w-full text-sm border">
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr key={idx} className={row.isSubtitulo ? 'font-bold bg-gray-100' : row.isMetodo ? 'italic text-gray-500' : ''}>
                          <td colSpan={row.isSubtitulo||row.isMetodo ? 4 : 1}>{row.examen}</td>
                          {row.isResultado && (
                            <>
                              <td>{row.resultado}</td>
                              <td>{row.unidad}</td>
                              <td>{row.valor_referencia}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {!loading && !hasResults && !hasError && (
            <div className="py-8 text-center text-gray-500">No hay resultados disponibles</div>
          )}
        </div>

        {hasResults && (
          <div className="flex justify-end mt-4">
            <a href={`/api/download-pdf?orderId=${orderId}`} className="btn btn-green">Descargar PDF</a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 