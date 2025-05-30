
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Plus, Truck, Users, PackageCheck } from "lucide-react";
import ShipmentsList from "./ShipmentsList";
import ClientsList from "./ClientsList";
import NewShipmentDialog from "./NewShipmentDialog";
import { useShipments } from "@/hooks/use-shipments";

const ShipmentsSection = () => {
  const [showNewShipment, setShowNewShipment] = useState(false);
  const { getShipmentStats, isLoading } = useShipments();
  
  const stats = getShipmentStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Envios</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
              ) : (
                stats.totalShipments
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Todos os envios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Trânsito</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
              ) : (
                stats.inTransitShipments
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Envios em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
              ) : (
                stats.pendingShipments
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando processamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregues</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
              ) : (
                stats.deliveredShipments
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Envios concluídos
            </p>
          </CardContent>
        </Card>
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
