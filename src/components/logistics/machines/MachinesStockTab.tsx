
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Machine } from "@/types/machine.types"; // Fixed import path
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface MachinesStockTabProps {
  machines: Machine[];
  isLoading: boolean;
  onAddNewClick: () => void;
}

const MachinesStockTab = ({ machines, isLoading, onAddNewClick }: MachinesStockTabProps) => {
  const navigate = useNavigate();
  
  // Filter for only stock machines
  const stockMachines = machines.filter(m => m.status === "STOCK");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Máquinas em Estoque</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Gerar Relatório
          </Button>
          <Button size="sm" onClick={onAddNewClick}>
            Entrada no Estoque
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Entrada</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : stockMachines.length > 0 ? (
                stockMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>{machine.serial_number}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700">Em Estoque</Badge>
                    </TableCell>
                    <TableCell>{new Date(machine.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Associar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(PATHS.LOGISTICS.MACHINE_DETAILS(machine.id))}
                        >
                          Detalhes
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Não há máquinas em estoque. Use o botão acima para adicionar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachinesStockTab;
