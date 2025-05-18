
import { Card, CardContent } from "@/components/ui/card";
import { Machine } from "@/services/machine.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface MachinesClientsTabProps {
  machines: Machine[];
  isLoading: boolean;
}

const MachinesClientsTab = ({ machines, isLoading }: MachinesClientsTabProps) => {
  const navigate = useNavigate();

  // Group machines by client
  const clientMachines = machines.reduce((acc, machine) => {
    if (!machine.client) return acc;
    
    if (!acc[machine.client.id]) {
      acc[machine.client.id] = {
        client: machine.client,
        machines: []
      };
    }
    
    acc[machine.client.id].machines.push(machine);
    return acc;
  }, {} as Record<string, { client: { id: string, business_name: string }, machines: Machine[] }>);

  const clientsList = Object.values(clientMachines);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Operando</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-yellow-100 text-yellow-800">Manutenção</Badge>;
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-800">Inativa</Badge>;
      case "TRANSIT":
        return <Badge className="bg-purple-100 text-purple-800">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Máquinas com Clientes</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array(2).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : clientsList.length > 0 ? (
        <div className="space-y-6">
          {clientsList.map((item) => (
            <Card key={item.client.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b flex justify-between items-center">
                  <h4 className="text-lg font-medium">{item.client.business_name}</h4>
                  <span className="text-sm text-gray-500">{item.machines.length} máquinas</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.machines.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell>{machine.serial_number}</TableCell>
                        <TableCell>{machine.model}</TableCell>
                        <TableCell>{getStatusBadge(machine.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(PATHS.LOGISTICS.MACHINE_DETAILS(machine.id))}
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500">Nenhum cliente possui máquinas vinculadas.</p>
        </div>
      )}
    </div>
  );
};

export default MachinesClientsTab;
