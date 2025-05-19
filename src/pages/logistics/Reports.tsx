
import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestsReportView from "@/components/logistics/reports/RequestsReportView";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/routes/paths";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LogisticsReports = () => {
  const [activeTab, setActiveTab] = useState<string>("requests");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Mock data for Machine Status Report
  const machineStatusData = [
    { status: "Em Operação", count: 45 },
    { status: "Manutenção", count: 12 },
    { status: "Estoque", count: 18 },
    { status: "Em Trânsito", count: 5 },
    { status: "Inativa", count: 3 }
  ];

  // Mock data for Support Trends Report
  const supportTrendsData = [
    { month: "Jan", installation: 10, maintenance: 15, removal: 5 },
    { month: "Fev", installation: 12, maintenance: 18, removal: 6 },
    { month: "Mar", installation: 15, maintenance: 12, removal: 8 },
    { month: "Abr", installation: 8, maintenance: 17, removal: 9 },
    { month: "Mai", installation: 14, maintenance: 20, removal: 7 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={PATHS.LOGISTICS.DASHBOARD}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Relatórios</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        
        <PageHeader 
          title="Relatórios de Logística" 
          description="Análise e visualização de dados operacionais"
        />
      </div>
      
      <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="machines">Máquinas</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="pt-4 space-y-4">
          <RequestsReportView />
        </TabsContent>
        
        <TabsContent value="machines" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status das Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={machineStatusData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-4">
                Conecte-se ao banco de dados para visualizar dados reais de distribuição de máquinas por clientes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={supportTrendsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="installation" name="Instalação" fill="#8884d8" />
                    <Bar dataKey="maintenance" name="Manutenção" fill="#82ca9d" />
                    <Bar dataKey="removal" name="Retirada" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance de Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-4">
                Conecte-se ao banco de dados para visualizar dados reais de performance de atendimento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsReports;
