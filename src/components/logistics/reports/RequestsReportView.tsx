
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, LineChart, BarChart } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TicketPriority, TicketType } from "@/types/support.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestsPieChart from "./RequestsPieChart";
import RequestsDataTable from "./RequestsDataTable";
import SLAReport from "./SLAReport";

const RequestsReportView = () => {
  const [reportType, setReportType] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Mock data - to be replaced with actual data
  const chartData = [
    { name: "Instalação", count: 25 },
    { name: "Manutenção", count: 45 },
    { name: "Substituição", count: 15 },
    { name: "Bobinas", count: 30 },
    { name: "Retirada", count: 10 }
  ];
  
  const statusDistribution = [
    { name: "Pendente", value: 12, color: "#FCD34D" },
    { name: "Em Andamento", value: 18, color: "#60A5FA" },
    { name: "Concluído", value: 38, color: "#34D399" },
    { name: "Cancelado", value: 5, color: "#F87171" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Relatório de Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="report-type">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type" className="w-full mt-1">
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="sla">Análise de SLA</SelectItem>
                  <SelectItem value="technician">Produtividade Técnicos</SelectItem>
                  <SelectItem value="client">Por Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-range">Período</Label>
              <DatePickerWithRange 
                className="w-full mt-1" 
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button className="flex-1 md:mt-7">
                Gerar Relatório
              </Button>
              <Button variant="outline" size="icon" className="md:mt-7">
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Solicitações por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </RechartBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* By Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <RequestsPieChart data={statusDistribution} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardContent className="pt-6">
              <RequestsDataTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sla">
          <SLAReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsReportView;
