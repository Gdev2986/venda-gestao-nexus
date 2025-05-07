
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, RefreshCw, Download } from "lucide-react";

interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: string;
  client_name?: string;
}

interface MachinesAllTabProps {
  searchTerm: string;
  modelFilter: string;
  statusFilter: string;
}

const MachinesAllTab = ({ searchTerm, modelFilter, statusFilter }: MachinesAllTabProps) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMachines = async () => {
      setIsLoading(true);
      
      // Mock data - in a real app, this would be an API call
      setTimeout(() => {
        const mockMachines: Machine[] = Array.from({ length: 20 }, (_, i) => ({
          id: `m-${i + 1}`,
          serial_number: `SN-${100000 + i}`,
          model: i % 3 === 0 ? "Terminal Pro" : i % 3 === 1 ? "Terminal Mini" : "Terminal Standard",
          status: i % 4 === 0 ? "ACTIVE" : i % 4 === 1 ? "INACTIVE" : i % 4 === 2 ? "MAINTENANCE" : "STOCK",
          client_name: i % 4 === 0 ? "Cliente " + (i + 1) : undefined,
        }));
        
        setMachines(mockMachines);
        setIsLoading(false);
      }, 500);
    };
    
    fetchMachines();
  }, []);
  
  // Filter machines based on filters
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = searchTerm 
      ? machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
        machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (machine.client_name && machine.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
      
    const matchesModel = modelFilter !== "all" ? machine.model === modelFilter : true;
    
    const matchesStatus = statusFilter !== "all" ? machine.status === statusFilter : true;
    
    return matchesSearch && matchesModel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      case "STOCK":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-md shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Máquinas</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex justify-center">Carregando máquinas...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nenhuma máquina encontrada com os filtros atuais
                  </TableCell>
                </TableRow>
              ) : (
                filteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>{machine.serial_number}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(machine.status)}>
                        {machine.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {machine.client_name || "Em estoque"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => 
                          navigate(`${PATHS.LOGISTICS.MACHINES}/${machine.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MachinesAllTab;
