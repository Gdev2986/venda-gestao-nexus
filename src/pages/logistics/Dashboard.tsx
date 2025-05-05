
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Cell 
} from "recharts";
import { 
  Package,
  Truck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Wrench
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for the KPIs
const kpiData = {
  totalMachines: 158,
  inStock: 42,
  operating: 97,
  maintenance: 15,
  broken: 4,
  pendingRequests: 23,
  avgSLA: 2.5, // in days
};

// Mock data for the status distribution chart
const statusData = [
  { name: 'Operando', value: 97, color: '#10b981' },
  { name: 'Em Estoque', value: 42, color: '#6366f1' },
  { name: 'Manutenção', value: 15, color: '#f59e0b' },
  { name: 'Quebradas', value: 4, color: '#ef4444' },
];

// Mock data for the requests chart
const requestsData = [
  { name: 'Jan', requests: 35 },
  { name: 'Fev', requests: 42 },
  { name: 'Mar', requests: 38 },
  { name: 'Abr', requests: 45 },
  { name: 'Mai', requests: 37 },
  { name: 'Jun', requests: 32 },
  { name: 'Jul', requests: 39 },
];

const LogisticsDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Logístico" 
        description="Visão geral das operações logísticas"
      />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Máquinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{kpiData.totalMachines}</div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {kpiData.inStock} em estoque, {kpiData.operating} operando
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Máquinas Operando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{kpiData.operating}</div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((kpiData.operating / kpiData.totalMachines) * 100)}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solicitações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{kpiData.pendingRequests}</div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              8 manutenções, 15 instalações novas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SLA Médio (dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{kpiData.avgSLA}</div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              -0.5 dias em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Máquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-8 mt-4">
                {statusData.map((status, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm text-muted-foreground">{status.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'maintenance', terminal: 'TERM-19284', client: 'Restaurante Sabores', time: '28 minutos atrás' },
              { type: 'transfer', terminal: 'TERM-28471', from: 'Depósito', to: 'Café Central', time: '2 horas atrás' },
              { type: 'installation', terminal: 'TERM-98734', client: 'Sorveteria Gelatto', time: '5 horas atrás' },
              { type: 'repair', terminal: 'TERM-87123', client: 'Farmácia Saúde', time: '1 dia atrás' },
              { type: 'replace', terminal: 'TERM-12984', client: 'Mercado Geral', time: '2 dias atrás' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`mt-0.5 rounded-full p-2 ${
                  activity.type === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                  activity.type === 'transfer' ? 'bg-blue-100 text-blue-700' :
                  activity.type === 'installation' ? 'bg-green-100 text-green-700' :
                  activity.type === 'repair' ? 'bg-red-100 text-red-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {activity.type === 'maintenance' && <Wrench className="h-4 w-4" />}
                  {activity.type === 'transfer' && <Truck className="h-4 w-4" />}
                  {activity.type === 'installation' && <Package className="h-4 w-4" />}
                  {activity.type === 'repair' && <Wrench className="h-4 w-4" />}
                  {activity.type === 'replace' && <Package className="h-4 w-4" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {activity.type === 'maintenance' && `Manutenção agendada para ${activity.terminal}`}
                      {activity.type === 'transfer' && `${activity.terminal} transferido de ${activity.from} para ${activity.to}`}
                      {activity.type === 'installation' && `Nova instalação de ${activity.terminal}`}
                      {activity.type === 'repair' && `Reparo completado em ${activity.terminal}`}
                      {activity.type === 'replace' && `Substituição de terminal ${activity.terminal}`}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.client}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
