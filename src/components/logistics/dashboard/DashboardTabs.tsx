
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MachineStatusChart from "./MachineStatusChart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const DashboardTabs = () => {
  const [currentTab, setCurrentTab] = useState("overview");

  const machineStatusData = [
    { name: "Ativas", value: 42, color: "#22c55e" },
    { name: "Em Manutenção", value: 15, color: "#f59e0b" },
    { name: "Inativas", value: 8, color: "#ef4444" },
    { name: "Em Trânsito", value: 5, color: "#3b82f6" }
  ];

  return (
    <Tabs
      defaultValue="overview"
      className="space-y-4"
      value={currentTab}
      onValueChange={setCurrentTab}
    >
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="machines">Máquinas</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => {}}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => {}}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MachineStatusChart data={machineStatusData} />
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Total de Equipamentos</h3>
              <div className="text-3xl font-bold">70</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Total de Clientes</h3>
              <div className="text-3xl font-bold">28</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="machines" className="space-y-4">
        Conteúdo da aba máquinas
      </TabsContent>

      <TabsContent value="clients" className="space-y-4">
        Conteúdo da aba clientes
      </TabsContent>
    </Tabs>
  );
};
