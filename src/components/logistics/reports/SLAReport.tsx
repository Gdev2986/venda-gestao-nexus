
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const SLAReport = () => {
  // Mock data - to be replaced with actual data
  const slaData = [
    { month: "Jan", average: 1.8, goal: 2.0 },
    { month: "Fev", average: 1.9, goal: 2.0 },
    { month: "Mar", average: 2.2, goal: 2.0 },
    { month: "Abr", average: 2.1, goal: 2.0 },
    { month: "Mai", average: 1.7, goal: 2.0 },
    { month: "Jun", average: 1.6, goal: 2.0 }
  ];
  
  const slaByType = [
    { type: "Instalação", average: 1.8 },
    { type: "Manutenção", average: 2.2 },
    { type: "Substituição", average: 1.5 },
    { type: "Retirada", average: 1.3 },
    { type: "Bobinas", average: 0.9 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8 dias</div>
            <p className="text-xs text-muted-foreground">
              Meta: 2.0 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atendimentos Dentro do SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio de Primeira Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 horas</div>
            <p className="text-xs text-muted-foreground">
              -10% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Atendimento x Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={slaData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    name="Média (dias)" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="goal" 
                    name="Meta (dias)" 
                    stroke="#82ca9d" 
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio por Tipo de Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={slaByType}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    name="Tempo Médio (dias)" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Análise de SLA por Técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Técnico</th>
                  <th className="p-2 text-left">Atendimentos</th>
                  <th className="p-2 text-left">Tempo Médio (dias)</th>
                  <th className="p-2 text-left">% Dentro do SLA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">João Silva</td>
                  <td className="p-2">24</td>
                  <td className="p-2">1.5</td>
                  <td className="p-2">95%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Maria Oliveira</td>
                  <td className="p-2">18</td>
                  <td className="p-2">1.8</td>
                  <td className="p-2">89%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Pedro Santos</td>
                  <td className="p-2">22</td>
                  <td className="p-2">2.1</td>
                  <td className="p-2">82%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Ana Costa</td>
                  <td className="p-2">15</td>
                  <td className="p-2">1.7</td>
                  <td className="p-2">93%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAReport;
