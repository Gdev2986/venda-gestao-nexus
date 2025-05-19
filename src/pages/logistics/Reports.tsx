
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import SLAReport from "@/components/logistics/reports/SLAReport";
import RequestsPieChart from "@/components/logistics/reports/RequestsPieChart";
import RequestsDataTable from "@/components/logistics/reports/RequestsDataTable";

const LogisticsReports = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const [reportType, setReportType] = useState<string>("performance");
  const [activeTab, setActiveTab] = useState<string>("graphs");

  const handleExportReport = () => {
    // Implementation for exporting reports would go here
    console.log("Exporting report", { reportType, date });
    // In a real implementation, this would generate and download a CSV or PDF
    alert("Exportação de relatórios será implementada em breve.");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios de Logística" 
        description="Análise e exportação de dados operacionais"
      />

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal w-full sm:w-[300px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(date.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione o período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          
          <div className="grid gap-2">
            <Label htmlFor="report-type">Tipo de Relatório</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type" className="w-full sm:w-[200px]">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Desempenho</SelectItem>
                <SelectItem value="requests">Solicitações</SelectItem>
                <SelectItem value="technicians">Técnicos</SelectItem>
                <SelectItem value="machines">Máquinas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleExportReport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="graphs">Gráficos</TabsTrigger>
          <TabsTrigger value="table">Tabela de Dados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graphs" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Solicitações por Tipo</span>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <RequestsPieChart data={[
                    { name: 'Instalação', value: 35 },
                    { name: 'Manutenção', value: 55 },
                    { name: 'Retirada', value: 15 },
                    { name: 'Suprimentos', value: 25 },
                    { name: 'Outros', value: 10 },
                  ]} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tempo Médio de Resolução (SLA)</span>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <SLAReport />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="table" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <RequestsDataTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsReports;
