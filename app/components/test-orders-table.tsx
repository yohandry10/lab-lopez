'use client'

import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestResultsModal } from '@/components/test-results-modal';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { MdOpenInNew } from 'react-icons/md';
import { FaUserDoctor } from 'react-icons/fa6';
import { Table, TableCell, TableRow } from '@/components/ui/table';

const statusColors = {
  'COMPLETADO': 'bg-green-100 text-green-800 border-green-300',
  'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'EN PROCESO': 'bg-blue-100 text-blue-800 border-blue-300',
  'ANULADO': 'bg-red-100 text-red-800 border-red-300',
};

// Función para formatear fechas
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return dateString || 'Fecha no disponible';
  }
};

interface Examination {
  id: string;
  nombre: string;
  codigo: string;
  estado: string;
}

interface TestOrder {
  id: string; 
  numero_orden: string;
  fecha: string;
  estado: string;
  paciente: {
    id: string;
    nombre: string;
    identificacion: string;
  };
  medico: {
    id: string;
    nombre: string;
    especialidad?: string;
  };
  examenes: Examination[];
}

interface TestOrdersTableProps {
  orders: TestOrder[];
  isLoading?: boolean;
}

export default function TestOrdersTable({ orders, isLoading = false }: TestOrdersTableProps) {
  const [resultModalOrder, setResultModalOrder] = useState<TestOrder | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Cargando resultados...</span>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No se encontraron órdenes con los criterios especificados.</p>
        </CardContent>
      </Card>
    );
  }

  // Agrupar las órdenes por número de orden
  const groupedOrders = orders.reduce((acc: { [key: string]: TestOrder[] }, order) => {
    if (!acc[order.numero_orden]) {
      acc[order.numero_orden] = [];
    }
    acc[order.numero_orden].push(order);
    return acc;
  }, {});

  return (
    <div className="space-y-4 mt-4">
      {Object.entries(groupedOrders).map(([orderNumber, orderGroup]) => {
        // Usamos el primer orden del grupo para datos comunes
        const firstOrder = orderGroup[0];
        
        return (
          <Card key={orderNumber} className="overflow-hidden">
            <CardHeader className="py-3 bg-muted/50">
              <CardTitle className="text-xl flex flex-wrap justify-between items-center">
                <div>
                  <span className="font-medium text-primary">Orden: </span>
                  <span>{orderNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-primary">Fecha: </span>
                  <span>{formatDate(firstOrder.fecha)}</span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="px-4 py-3 bg-muted/20">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="font-medium text-primary">Paciente:</span>
                  <span>{firstOrder.paciente.nombre}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium text-primary">Identificación:</span>
                  <span>{firstOrder.paciente.identificacion}</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-4 py-2 text-left">Examen</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-center" colSpan={2}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderGroup.flatMap((order) => 
                      order.examenes.map((exam, examIndex) => (
                        <TableRow 
                          key={`${order.id}-${exam.id || examIndex}`}
                          className="border-b hover:bg-muted/20"
                        >
                          <TableCell className="px-4 py-3">{exam.nombre || 'Sin nombre'}</TableCell>
                          <TableCell className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              statusColors[exam.estado as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}>
                              {exam.estado || 'Desconocido'}
                            </span>
                          </TableCell>
                          <TableCell className="px-2 py-3 text-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs flex items-center gap-1"
                              onClick={() => setResultModalOrder(order)}
                            >
                              <MdOpenInNew className="h-3 w-3" />
                              <span>Ver resultados</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Modal para mostrar resultados */}
      {resultModalOrder && (
        <TestResultsModal
          open={!!resultModalOrder}
          onOpenChange={() => setResultModalOrder(null)} 
          orderId={resultModalOrder.id}
          orderNumber={resultModalOrder.numero_orden}
          patientName={resultModalOrder.paciente.nombre}
          patientId={resultModalOrder.paciente.identificacion}
          testDate={formatDate(resultModalOrder.fecha)}
        />
      )}
    </div>
  );
} 