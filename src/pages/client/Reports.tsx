
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, FileText, Download, Calendar, TrendingUp } from "lucide-react";

const ClientReports = () => {
  const availableReports = [
    {
      id: "sales",
      title: "Relatório de Vendas",
      description: "Vendas detalhadas por período, forma de pagamento e terminal",
      icon: TrendingUp,
      color: "blue"
    },
    {
      id: "payments",
      title: "Relatório de Pagamentos",
      description: "Histórico completo de solicitações e pagamentos recebidos",
      icon: FileText,
      color: "green"
    },
    {
      id: "financial",
      title: "Relatório Financeiro",
      description: "Resumo financeiro com receitas brutas e líquidas",
      icon: BarChart,
      color: "purple"
    }
  ];

  const recentReports = [
    {
      id: "1",
      name: "Vendas_Janeiro_2024.pdf",
      type: "Vendas",
      generated_at: "2024-01-30T10:00:00Z",
      size: "2.3 MB"
    },
    {
      id: "2", 
      name: "Pagamentos_Dezembro_2023.pdf",
      type: "Pagamentos",
      generated_at: "2024-01-02T14:30:00Z",
      size: "1.8 MB"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          border: "border-l-blue-500",
          icon: "text-blue-600",
          bg: "bg-blue-50"
        };
      case "green":
        return {
          border: "border-l-green-500", 
          icon: "text-green-600",
          bg: "bg-green-50"
        };
      case "purple":
        return {
          border: "border-l-purple-500",
          icon: "text-purple-600", 
          bg: "bg-purple-50"
        };
      default:
        return {
          border: "border-l-gray-500",
          icon: "text-gray-600",
          bg: "bg-gray-50"
        };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios"
        description="Gere e baixe relatórios detalhados sobre suas vendas e pagamentos"
      />
      
      {/* Gerar Novos Relatórios */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Gerar Relatórios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableReports.map((report) => {
            const colors = getColorClasses(report.color);
            const Icon = report.icon;
            
            return (
              <Card key={report.id} className={`${colors.border} border-l-4 hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${colors.bg}`}>
                      <Icon className={`h-4 w-4 ${colors.icon}`} />
                    </div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                  <Button size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Relatórios Recentes */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Relatórios Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length > 0 ? (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.type} • {report.size} • {new Date(report.generated_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum relatório gerado ainda.</p>
              <p className="text-sm">Gere seu primeiro relatório acima.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientReports;
