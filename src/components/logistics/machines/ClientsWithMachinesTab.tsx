
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { getClientsWithMachines } from "@/services/machine.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

interface ClientWithMachines {
  id: string;
  business_name: string;
  machineCount: number;
  status?: string;
}

const ClientsWithMachinesTab = () => {
  const [clients, setClients] = useState<ClientWithMachines[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getClientsWithMachines();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients with machines:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.business_name.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleViewDetails = (clientId: string) => {
    // Navigate to client details page
    navigate(PATHS.LOGISTICS.CLIENTS);
    // In a real application, you might want to include the client ID in the URL
    // navigate(`${PATHS.LOGISTICS.CLIENTS}/${clientId}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Clientes com Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : filteredClients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-center">Total de Máquinas</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.business_name}</TableCell>
                    <TableCell className="text-center">{client.machineCount}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-800">
                        Ativo
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(client.id)}>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Nenhum cliente com máquina encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsWithMachinesTab;
