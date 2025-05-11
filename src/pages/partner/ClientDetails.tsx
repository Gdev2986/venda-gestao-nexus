
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sale, Client, PaymentMethod } from "@/types";
import { usePartnerClients } from "@/hooks/use-partner-clients";
import { PATHS } from "@/routes/paths";
import { ArrowLeft, Wallet, Building2, Phone, Mail, MapPin, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [clientSales, setClientSales] = useState<Sale[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { allClients, getClientSales } = usePartnerClients();

  useEffect(() => {
    if (!clientId || !allClients.length) return;

    const foundClient = allClients.find((c) => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
      loadClientSales(clientId);
    } else {
      navigate(PATHS.PARTNER.CLIENTS);
    }
  }, [clientId, allClients, navigate]);

  const loadClientSales = async (id: string) => {
    const sales = await getClientSales(id);
    setClientSales(sales);
  };

  // Sales data for charts
  const monthlySalesData = [
    { month: "Jan", amount: 4000 },
    { month: "Fev", amount: 3000 },
    { month: "Mar", amount: 2000 },
    { month: "Abr", amount: 2780 },
    { month: "Mai", amount: 1890 },
    { month: "Jun", amount: 2390 },
  ];

  // Payment methods distribution
  const paymentMethodsData = [
    {
      name: "PIX",
      value: clientSales.filter((sale) => sale.payment_method === PaymentMethod.PIX).length,
    },
    {
      name: "Crédito",
      value: clientSales.filter((sale) => sale.payment_method === PaymentMethod.CREDIT).length,
    },
    {
      name: "Débito",
      value: clientSales.filter((sale) => sale.payment_method === PaymentMethod.DEBIT).length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  if (!client) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-muted-foreground">Carregando dados do cliente...</p>
        </div>
      </MainLayout>
    );
  }

  // Calculate sales metrics
  const totalSales = clientSales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  const averageSale = clientSales.length ? totalSales / clientSales.length : 0;

  // Get count by payment method
  const pixCount = clientSales.filter(
    (sale) => sale.payment_method === PaymentMethod.PIX
  ).length;
  const creditCount = clientSales.filter(
    (sale) => sale.payment_method === PaymentMethod.CREDIT
  ).length;
  const debitCount = clientSales.filter(
    (sale) => sale.payment_method === PaymentMethod.DEBIT
  ).length;

  // Daily activity - count sales per day of the week
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const dailyActivity = daysOfWeek.map((day, index) => {
    const count = clientSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate.getDay() === index;
    }).length;

    return {
      day,
      count,
    };
  });

  return (
    <MainLayout>
      {/* Header with client info and back button */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="p-0 mr-2"
            onClick={() => navigate(PATHS.PARTNER.CLIENTS)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client.business_name}</h1>
            <p className="text-muted-foreground">
              {client.status === "active" ? "Cliente Ativo" : "Cliente Inativo"}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <p className="flex items-center gap-1 text-muted-foreground">
            <Wallet className="h-4 w-4" /> Saldo: R$ {client.balance?.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Client details and tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Client details information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.business_name}</span>
              </div>

              {client.contact_name && (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-muted-foreground">👤</span>
                  <span className="text-sm">{client.contact_name}</span>
                </div>
              )}

              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.phone}</span>
                </div>
              )}

              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.email}</span>
                </div>
              )}

              {client.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {client.address}
                    {client.city && client.state
                      ? `, ${client.city} - ${client.state}`
                      : ""}
                  </span>
                </div>
              )}

              {client.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Cliente desde{" "}
                    {new Date(client.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 overflow-x-auto flex sm:inline-flex whitespace-nowrap">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="sales">Vendas</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Total de Vendas
                    </div>
                    <div className="text-2xl font-bold">
                      R$ {totalSales.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Ticket Médio
                    </div>
                    <div className="text-2xl font-bold">
                      R$ {averageSale.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Total de Transações
                    </div>
                    <div className="text-2xl font-bold">{clientSales.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Método mais usado
                    </div>
                    <div className="text-2xl font-bold">
                      {pixCount > creditCount && pixCount > debitCount
                        ? "PIX"
                        : creditCount > debitCount
                        ? "Crédito"
                        : "Débito"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vendas Mensais</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlySalesData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                        <Bar dataKey="amount" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {paymentMethodsData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, "Transações"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Activity by day of week */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atividade por Dia da Semana</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyActivity}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, "Transações"]} />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Sales history table or placeholder */}
                  {clientSales.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Data</th>
                            <th className="text-left p-2">Código</th>
                            <th className="text-left p-2">Terminal</th>
                            <th className="text-right p-2">Valor</th>
                            <th className="text-left p-2">Método</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientSales.map((sale) => (
                            <tr key={sale.id} className="border-b">
                              <td className="p-2">
                                {new Date(sale.date).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="p-2">{sale.code}</td>
                              <td className="p-2">{sale.terminal}</td>
                              <td className="text-right p-2">
                                R$ {sale.gross_amount.toFixed(2)}
                              </td>
                              <td className="p-2">
                                {sale.payment_method === PaymentMethod.PIX
                                  ? "PIX"
                                  : sale.payment_method === PaymentMethod.CREDIT
                                  ? "Crédito"
                                  : "Débito"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Este cliente ainda não possui vendas registradas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Este cliente ainda não possui pagamentos registrados.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientDetails;
