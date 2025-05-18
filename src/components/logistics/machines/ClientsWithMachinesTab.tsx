import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Smartphone, ArrowRight } from "lucide-react";
import { getClientsWithMachines } from "@/services/machine.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface ClientWithMachines {
  id: string;
  business_name: string;
  machineCount: number;
  predominantStatus: string;
}

interface ClientsWithMachinesTabProps {
  clients?: ClientWithMachines[];
  isLoading?: boolean;
}

export default function ClientsWithMachinesTab({ clients: initialClients, isLoading: initialLoading }: ClientsWithMachinesTabProps) {
  const [clients, setClients] = useState<ClientWithMachines[]>(initialClients || []);
  const [isLoading, setIsLoading] = useState(initialLoading !== undefined ? initialLoading : true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // If clients are provided as props, use them
    if (initialClients) {
      setClients(initialClients);
      return;
    }
    
    // Otherwise fetch them
    const fetchClients = async () => {
      try {
        const data = await getClientsWithMachines();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients with machines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [initialClients]);
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Ativas</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-red-500">Inativas</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Manutenção</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por nome do cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-4"
      />
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="w-[150px]">Qtd. Máquinas</TableHead>
              <TableHead className="w-[150px]">Status Predominante</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum cliente com máquinas encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.business_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{client.machineCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(client.predominantStatus)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                    >
                      <Link to={`/admin/clients/${client.id}`}>
                        <span className="mr-1">Detalhes</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
