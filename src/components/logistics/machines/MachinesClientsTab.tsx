
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Machine } from "@/services/machine.service";
import { getClientsWithMachines } from "@/services/machine.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MachinesClientsTabProps {
  machines: Machine[];
  isLoading: boolean;
}

interface ClientWithMachines {
  id: string;
  business_name: string;
  machineCount: number;
}

const MachinesClientsTab: React.FC<MachinesClientsTabProps> = ({ machines, isLoading }) => {
  const [search, setSearch] = useState('');
  const [clientsData, setClientsData] = useState<Record<string, Machine[]>>({});
  const [clients, setClients] = useState<ClientWithMachines[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  
  // Fetch clients with machines
  useEffect(() => {
    async function fetchClientsData() {
      try {
        const clientsList = await getClientsWithMachines();
        setClients(clientsList);
        
        // Group machines by client
        const groupedMachines: Record<string, Machine[]> = {};
        machines.forEach(machine => {
          if (machine.client_id) {
            if (!groupedMachines[machine.client_id]) {
              groupedMachines[machine.client_id] = [];
            }
            groupedMachines[machine.client_id].push(machine);
          }
        });
        
        setClientsData(groupedMachines);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoadingClients(false);
      }
    }
    
    fetchClientsData();
  }, [machines]);
  
  // Filter clients based on search
  const filteredClients = clients.filter(client => 
    client.business_name.toLowerCase().includes(search.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ativa</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Manutenção</Badge>;
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inativa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
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
      
      {isLoading || loadingClients ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClients.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-4">
          {filteredClients.map((client) => (
            <AccordionItem value={client.id} key={client.id} className="border rounded-lg shadow-sm bg-white">
              <AccordionTrigger className="px-4">
                <div className="flex items-center justify-between w-full">
                  <div className="font-medium">{client.business_name}</div>
                  <div className="flex gap-4 items-center">
                    <Badge variant="outline">{client.machineCount} máquinas</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {clientsData[client.id] && clientsData[client.id].length > 0 ? (
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
                      {clientsData[client.id].map((machine) => (
                        <TableRow key={machine.id}>
                          <TableCell className="font-medium">{machine.serial_number}</TableCell>
                          <TableCell>{machine.model}</TableCell>
                          <TableCell>{getStatusBadge(machine.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Transferir
                              </Button>
                              <Button variant="ghost" size="sm">
                                Histórico
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Não foram encontradas máquinas para este cliente.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhum cliente com máquina encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MachinesClientsTab;
