
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileDown, 
  BarChart2, 
  PieChart, 
  Calendar, 
  FileText,
  Users,
  Truck,
  Box
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart as CustomPieChart } from "@/components/charts/PieChart";
import { LineChart } from "@/components/charts/LineChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";

// Sample data for service types
const serviceTypesData = [
  { name: "Instalação", value: 35, color: "#4CAF50" },
  { name: "Manutenção", value: 45, color: "#2196F3" },
  { name: "Retirada", value: 10, color: "#FF5722" },
  { name: "Suprimentos", value: 10, color: "#9C27B0" }
];

// Sample data for service by technician
const technicianServiceData = [
  { name: "Técnico A", value: 28 },
  { name: "Técnico B", value: 22 },
  { name: "Técnico C", value: 19 },
  { name: "Técnico D", value: 15 },
  { name: "Técnico E", value: 12 }
];

// Sample data for service completion time
const completionTimeData = [
  { name: "Segunda", value: 4.2 },
  { name: "Terça", value: 3.8 },
  { name: "Quarta", value: 5.1 },
  { name: "Quinta", value: 4.5 },
  { name: "Sexta", value: 3.9 },
  { name: "Sábado", value: 2.5 }
];

// Sample data for machine installations
const installationsData = [
  { month: "Jan", value: 12 },
  { month: "Fev", value: 15 },
  { month: "Mar", value: 18 },
  { month: "Abr", value: 14 },
  { month: "Mai", value: 21 },
  { month: "Jun", value: 19 }
];

// Sample data for detailed service reports
const detailedServiceData = [
  { id: "1", date: "2025-05-15", client: "Empresa ABC", type: "Instalação", technician: "Técnico A", time: "3.5h", status: "Concluído" },
  { id: "2", date: "2025-05-14", client: "Comércio XYZ", type: "Manutenção", technician: "Técnico B", time: "2.0h", status: "Concluído" },
  { id: "3", date: "2025-05-13", client: "Restaurante DEF", type: "Retirada", technician: "Técnico A", time: "1.5h", status: "Concluído" },
  { id: "4", date: "2025-05-12", client: "Loja GHI", type: "Suprimentos", technician: "Técnico C", time: "1.0h", status: "Concluído" },
  { id: "5", date: "2025-05-11", client: "Farmácia JKL", type: "Manutenção", technician: "Técnico D", time: "4.0h", status: "Concluído" }
];

// Sample data for detailed machine reports
const machineReportsData = [
  { id: "1", serial: "SP0012345", model: "SigmaPay S920", client: "Empresa ABC", status: "Ativo", instDate: "2025-02-15", lastMaint: "2025-05-10" },
  { id: "2", serial: "SP0012346", model: "SigmaPay Mini", client: "Comércio XYZ", status: "Ativo", instDate: "2025-03-01", lastMaint: "2025-05-08" },
  { id: "3", serial: "SP0012347", model: "SigmaPay Pro", client: "Restaurante DEF", status: "Inativo", instDate: "2025-01-10", lastMaint: "2025-04-15" },
  { id: "4", serial: "SP0012348", model: "SigmaPay S920", client: "Loja GHI", status: "Ativo", instDate: "2025-04-05", lastMaint: "2025-05-12" },
  { id: "5", serial: "SP0012349", model: "SigmaPay Mini", client: "Farmácia JKL", status: "Ativo", instDate: "2025-04-20", lastMaint: "2025-05-05" }
];

const LogisticsReports = () => {
  const [reportType, setReportType] = useState("services");
  const [activeTab, setActiveTab] = useState("chart");
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const handleExport = () => {
    toast({
      title: "Exportando relatório",
      description: "Seu relatório está sendo gerado e será baixado em instantes."
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios de Logística" 
        description="Análise detalhada de serviços, máquinas e operações"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Serviços</CardDescription>
            <CardTitle className="text-2xl">158</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tempo Médio de Atendimento</CardDescription>
            <CardTitle className="text-2xl">3.7h</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Serviços em Aberto</CardDescription>
            <CardTitle className="text-2xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Atualmente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Instalações</CardDescription>
            <CardTitle className="text-2xl">34</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <DatePickerWithRange 
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            
            <div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="technicians">Técnicos</SelectItem>
                  <SelectItem value="machines">Máquinas</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full" variant="outline" onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chart">
            <BarChart2 className="mr-2 h-4 w-4" />
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="table">
            <FileText className="mr-2 h-4 w-4" />
            Dados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-6">
          {reportType === "services" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Tipos de Serviço
                  </CardTitle>
                  <CardDescription>Distribuição por categoria</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <CustomPieChart data={serviceTypesData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Tempo de Conclusão
                  </CardTitle>
                  <CardDescription>Tempo médio por dia da semana (horas)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart 
                    data={completionTimeData} 
                    height={300}
                    color="#2196F3"
                  />
                </CardContent>
              </Card>
            </div>
          )}
          
          {reportType === "technicians" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Serviços por Técnico
                </CardTitle>
                <CardDescription>Total de atendimentos</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={technicianServiceData}
                  height={300}
                  color="#4CAF50"
                />
              </CardContent>
            </Card>
          )}
          
          {reportType === "machines" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Box className="mr-2 h-5 w-5" />
                  Instalações de Máquinas
                </CardTitle>
                <CardDescription>Por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={installationsData}
                  xAxisKey="month"
                  height={300}
                />
              </CardContent>
            </Card>
          )}
          
          {reportType === "clients" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Serviços por Cliente
                </CardTitle>
                <CardDescription>Top 5 clientes com mais solicitações</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Empresa ABC", value: 15 },
                    { name: "Comércio XYZ", value: 12 },
                    { name: "Restaurante DEF", value: 10 },
                    { name: "Loja GHI", value: 8 },
                    { name: "Farmácia JKL", value: 7 }
                  ]}
                  height={300}
                  color="#9C27B0"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="table">
          {reportType === "services" || reportType === "technicians" ? (
            <Card>
              <CardHeader>
                <CardTitle>Relatório Detalhado de Serviços</CardTitle>
                <CardDescription>
                  {dateRange.from && dateRange.to ? (
                    `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                  ) : "Todos os registros"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Técnico</TableHead>
                      <TableHead>Tempo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedServiceData.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          {format(new Date(service.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{service.client}</TableCell>
                        <TableCell>{service.type}</TableCell>
                        <TableCell>{service.technician}</TableCell>
                        <TableCell>{service.time}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {service.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Relatório Detalhado de Máquinas</CardTitle>
                <CardDescription>
                  {dateRange.from && dateRange.to ? (
                    `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                  ) : "Todos os registros"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Série</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Instalação</TableHead>
                      <TableHead>Última Manutenção</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machineReportsData.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell>{machine.serial}</TableCell>
                        <TableCell>{machine.model}</TableCell>
                        <TableCell>{machine.client}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            machine.status === "Ativo" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {machine.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(machine.instDate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(machine.lastMaint), "dd/MM/yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsReports;
