
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getClientsWithMachines } from "@/services/machine.service";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { LinkIcon } from "lucide-react";

export interface ClientWithMachines {
  id: string;
  business_name: string;
  machineCount: number;
  predominantStatus?: string;
}

const ClientsWithMachinesTab: React.FC = () => {
  const [clients, setClients] = useState<ClientWithMachines[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClientsWithMachines();
        setClients(data);
      } catch (error) {
        console.error("Error loading clients with machines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClients();
  }, []);

  const filteredClients = clients.filter(client => 
    client.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Nº de Máquinas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">Carregando...</TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">Nenhum cliente com máquinas encontrado</TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.business_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="px-2 py-1">
                      {client.machineCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/logistics/clients/${client.id}/machines`} className="text-blue-600 hover:underline flex items-center gap-1 w-fit">
                      <LinkIcon className="h-3.5 w-3.5" />
                      Ver máquinas
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsWithMachinesTab;
