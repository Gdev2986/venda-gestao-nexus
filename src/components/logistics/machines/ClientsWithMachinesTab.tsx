
import React, { useState, useEffect } from 'react';
import { getAllMachines, getClientsWithMachines } from '@/services/machine.service';
import { Machine, MachineStatus } from '@/types/machine.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Client {
  id: string;
  business_name: string;
  machineCount: number;
  machines?: Array<{id: string; status: MachineStatus}>;
}

const ClientsWithMachinesTab: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsWithMachines = await getClientsWithMachines();
        setClients(clientsWithMachines);
      } catch (error) {
        console.error("Error loading clients with machines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const filteredClients = clients.filter(client => 
    client.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-500">Ativo</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-red-500">Inativo</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-500">Manutenção</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-500">Estoque</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Carregando clientes...</div>;
  }
  
  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por nome do cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs"
      />
      
      {filteredClients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum cliente com máquinas encontrado.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Qtd. Máquinas</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.business_name}</TableCell>
                  <TableCell className="text-right">{client.machineCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {client.machines && client.machines.map((machine, idx) => (
                        <div key={idx}>
                          {getStatusBadge(machine.status)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ClientsWithMachinesTab;
