
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Plus, Truck, Users, PackageCheck, ShoppingBag, HelpCircle } from "lucide-react";
import ShipmentsList from "./ShipmentsList";
import ClientsList from "./ClientsList";
import NewShipmentDialog from "./NewShipmentDialog";
import { StyledCard } from "@/components/ui/styled-card";

interface ShipmentsStats {
  totalMachines: number;
  onlineMachines: number;
  pendingRequests: number;
  deliveredShipments: number;
}

const ShipmentsSection = () => {
  const [showNewShipment, setShowNewShipment] = useState(false);
  
  // Mock data for stats
  const stats: ShipmentsStats = {
    totalMachines: 245,
    onlineMachines: 180,
    pendingRequests: 32,
    deliveredShipments: 136
  };

  return (
    <div className="space-y-6">
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
