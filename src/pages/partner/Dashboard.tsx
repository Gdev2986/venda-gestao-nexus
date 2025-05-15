
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp, TrendingUp, Users, Wallet, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the chart
const salesData = [
  { month: "Jan", sales: 45, commission: 9 },
  { month: "Fev", sales: 52, commission: 10.4 },
  { month: "Mar", sales: 48, commission: 9.6 },
  { month: "Abr", sales: 61, commission: 12.2 },
  { month: "Mai", sales: 40, commission: 8 },
  { month: "Jun", sales: 50, commission: 10 },
];

const PartnerDashboard = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Acompanhe suas vendas, comissões e clientes"
      />
      
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vendas Realizadas (Mês)</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">24</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs md:text-sm">
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>8% desde o mês anterior</span>
              </div>
              <span className="text-gray-500 truncate ml-2">Total: R$ 48.960</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Comissão Atual</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">R$ 9.792</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs md:text-sm">
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>Taxa: 20%</span>
              </div>
              <span className="text-gray-500">Disponível para saque</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Clientes Ativos</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">18</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs md:text-sm">
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>2 novos este mês</span>
              </div>
              <span className="text-gray-500">5 com vendas recentes</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales & Commission Chart */}
      <PageWrapper>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Vendas e Comissões</CardTitle>
          <CardDescription>
            Visão geral dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`R$ ${value}k`, undefined]} 
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="sales" name="Vendas (R$ mil)" fill="#4f46e5" />
                <Bar dataKey="commission" name="Comissão (R$ mil)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </PageWrapper>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5 mr-2" /> 
              Meus Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Gerencie seus clientes e acompanhe o status das vendas realizadas.
            </p>
            <Button className="w-full text-sm md:text-base py-1 md:py-2 h-auto" asChild>
              <Link to={PATHS.PARTNER.CLIENTS}>
                Ver Clientes <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Wallet className="h-4 w-4 md:h-5 md:w-5 mr-2" /> 
              Minhas Comissões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Acompanhe suas comissões e solicite saques quando disponível.
            </p>
            <Button className="w-full text-sm md:text-base py-1 md:py-2 h-auto" asChild>
              <Link to={PATHS.PARTNER.COMMISSIONS}>
                Gerenciar Comissões <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 mr-2" /> 
              Novas Vendas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Cadastre novas vendas e acompanhe o processo de aprovação.
            </p>
            <Button className="w-full text-sm md:text-base py-1 md:py-2 h-auto" asChild>
              <Link to={PATHS.PARTNER.SALES}>
                Registrar Venda <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerDashboard;
