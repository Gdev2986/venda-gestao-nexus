
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Plus, Truck, Users } from "lucide-react";
import ShipmentsList from "./ShipmentsList";
import ClientsList from "./ClientsList";
import NewShipmentDialog from "./NewShipmentDialog";
import { StyledCard } from "@/components/ui/styled-card";

interface ShipmentsStats {
  totalShipments: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
}

const ShipmentsSection = () => {
  const [showNewShipment, setShowNewShipment] = useState(false);
  
  // Mock data for stats
  const stats: ShipmentsStats = {
    totalShipments: 156,
    pendingShipments: 8,
    inTransitShipments: 12,
    deliveredShipments: 136
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StyledCard
          title="Total de Envios"
          icon={<Package className="h-4 w-4 text-blue-500" />}
          borderColor="border-blue-500"
        >
          <div className="text-2xl font-bold">{stats.totalShipments}</div>
          <p className="text-sm text-muted-foreground">Todos os envios</p>
        </StyledCard>

        <StyledCard
          title="Pendentes"
          icon={<Package className="h-4 w-4 text-orange-500" />}
          borderColor="border-orange-500"
        >
          <div className="text-2xl font-bold">{stats.pendingShipments}</div>
          <p className="text-sm text-muted-foreground">Aguardando envio</p>
        </StyledCard>

        <StyledCard
          title="Em Trânsito"
          icon={<Truck className="h-4 w-4 text-yellow-500" />}
          borderColor="border-yellow-500"
        >
          <div className="text-2xl font-bold">{stats.inTransitShipments}</div>
          <p className="text-sm text-muted-foreground">A caminho do destino</p>
        </StyledCard>

        <StyledCard
          title="Entregues"
          icon={<Package className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">{stats.deliveredShipments}</div>
          <p className="text-sm text-muted-foreground">Entregas concluídas</p>
        </StyledCard>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Controle de Envios
          </CardTitle>
          <Button onClick={() => setShowNewShipment(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Envio
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shipments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="shipments" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Envios
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipments">
              <ShipmentsList />
            </TabsContent>

            <TabsContent value="clients">
              <ClientsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <NewShipmentDialog 
        open={showNewShipment} 
        onOpenChange={setShowNewShipment} 
      />
    </div>
  );
};

export default ShipmentsSection;
