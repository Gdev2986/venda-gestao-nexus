
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, MapPin, Calendar } from "lucide-react";

const ClientMachines = () => {
  // Mock machine data
  const machines = [
    {
      id: "1",
      serial_number: "SMP001",
      model: "SigmaPay Pro",
      status: "ACTIVE",
      location: "Loja Centro",
      installed_at: "2024-01-15"
    },
    {
      id: "2", 
      serial_number: "SMP002",
      model: "SigmaPay Lite",
      status: "MAINTENANCE",
      location: "Filial Norte",
      installed_at: "2024-02-10"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Ativa</Badge>;
      case "MAINTENANCE":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">Manutenção</Badge>;
      case "INACTIVE":
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">Inativa</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Minhas Máquinas"
        description="Visualize e gerencie suas máquinas de pagamento"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <Card key={machine.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  {machine.model}
                </CardTitle>
                {getStatusBadge(machine.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>Serial:</strong> {machine.serial_number}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {machine.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Instalada em {new Date(machine.installed_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientMachines;
