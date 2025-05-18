
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface ClientWithMachine {
  id: string;
  business_name: string;
  machineCount: number;
  predominantStatus?: string;
}

interface ClientsWithMachinesProps {
  clients: ClientWithMachine[];
  isLoading: boolean;
}

const ClientsWithMachines: React.FC<ClientsWithMachinesProps> = ({ clients, isLoading }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Desconhecido</Badge>;
    
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Operando</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-yellow-100 text-yellow-800">Manutenção</Badge>;
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card className="text-center p-6">
        <p className="text-muted-foreground">Nenhum cliente com máquina foi encontrado.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{client.business_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  <span className="font-medium">{client.machineCount}</span> máquina{client.machineCount !== 1 && 's'}
                </p>
                <div className="mt-1">
                  {getStatusBadge(client.predominantStatus)}
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate(PATHS.LOGISTICS.CLIENTS)}
              >
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientsWithMachines;
