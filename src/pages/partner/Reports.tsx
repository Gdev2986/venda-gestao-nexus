
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Download, FileText } from "lucide-react";

// Mock data for sales by payment method
const PAYMENT_METHOD_DATA = [
  { name: "Crédito", value: 58 },
  { name: "Débito", value: 27 },
  { name: "PIX", value: 15 },
];

// Mock data for sales by month
const MONTHLY_SALES_DATA = [
  { month: "Jan", sales: 45000, commission: 9000 },
  { month: "Fev", sales: 52000, commission: 10400 },
  { month: "Mar", sales: 48000, commission: 9600 },
  { month: "Abr", sales: 61000, commission: 12200 },
  { month: "Mai", sales: 40000, commission: 8000 },
  { month: "Jun", sales: 50000, commission: 10000 },
];

// Mock data for sales by day (last 7 days)
const DAILY_SALES_DATA = (() => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: formatDate(date),
      sales: Math.floor(Math.random() * 10000) + 2000,
      commission: Math.floor(Math.random() * 2000) + 400,
    });
  }
  
  return data;
})();

// Colors for pie chart
const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

const PartnerReports = () => {
  const [period, setPeriod] = useState("month");
  const [reportType, setReportType] = useState("sales");
  
  return (
    <div>
      <PageHeader 
        title="Relatórios" 
        description="Visualize métricas e relatórios das suas vendas e comissões"
      />
      
      <PageWrapper>
        {/* Report Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="period">Período</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Últimos 7 dias</SelectItem>
                    <SelectItem value="month">Últimos 6 meses</SelectItem>
                    <SelectItem value="year">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="report-type">Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Vendas</SelectItem>
                    <SelectItem value="commission">Comissões</SelectItem>
                    <SelectItem value="payment">Formas de Pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button variant="outline" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Charts */}
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="chart">Gráficos</TabsTrigger>
            <TabsTrigger value="data">Dados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {reportType === "sales" && "Vendas"}
                  {reportType === "commission" && "Comissões"}
                  {reportType === "payment" && "Formas de Pagamento"}
                </CardTitle>
                <CardDescription>
                  {period === "day" && "Últimos 7 dias"}
                  {period === "month" && "Últimos 6 meses"}
                  {period === "year" && "Relatório anual"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportType === "payment" ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={PAYMENT_METHOD_DATA}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {PAYMENT_METHOD_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : period === "day" ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={DAILY_SALES_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                        />
                        <Legend />
                        {reportType === "sales" && (
                          <Line
                            type="monotone"
                            dataKey="sales"
                            name="Vendas"
                            stroke="#4f46e5"
                            activeDot={{ r: 8 }}
                          />
                        )}
                        {reportType === "commission" && (
                          <Line
                            type="monotone"
                            dataKey="commission"
                            name="Comissões"
                            stroke="#10b981"
                            activeDot={{ r: 8 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MONTHLY_SALES_DATA}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                        />
                        <Legend />
                        {reportType === "sales" && (
                          <Bar
                            dataKey="sales"
                            name="Vendas"
                            fill="#4f46e5"
                          />
                        )}
                        {reportType === "commission" && (
                          <Bar
                            dataKey="commission"
                            name="Comissões"
                            fill="#10b981"
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>
                  {reportType === "sales" && "Dados de Vendas"}
                  {reportType === "commission" && "Dados de Comissões"}
                  {reportType === "payment" && "Dados de Formas de Pagamento"}
                </CardTitle>
                <CardDescription>
                  Visualização detalhada dos dados em tabela
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">
                          {period === "day" ? "Data" : "Período"}
                        </th>
                        {reportType === "payment" ? (
                          <>
                            <th className="text-left p-3">Forma de Pagamento</th>
                            <th className="text-right p-3">Percentual</th>
                          </>
                        ) : (
                          <>
                            <th className="text-right p-3">
                              {reportType === "sales" ? "Vendas (R$)" : "Comissões (R$)"}
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {reportType === "payment" ? (
                        PAYMENT_METHOD_DATA.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{item.name}</td>
                            <td className="text-right p-3">{item.value}%</td>
                          </tr>
                        ))
                      ) : period === "day" ? (
                        DAILY_SALES_DATA.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">{item.date}</td>
                            <td className="text-right p-3">
                              {formatCurrency(
                                reportType === "sales" ? item.sales : item.commission
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        MONTHLY_SALES_DATA.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">{item.month}</td>
                            <td className="text-right p-3">
                              {formatCurrency(
                                reportType === "sales" ? item.sales : item.commission
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </div>
  );
};

export default PartnerReports;
