
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import {
  CreditCard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  DollarSign,
  TrendingUp,
  Calendar
} from "lucide-react";

interface SidebarContentProps {
  className?: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ className }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Pagamentos",
      icon: CreditCard,
      onClick: () => navigate(PATHS.CLIENT.PAYMENTS),
      badge: "3"
    },
    {
      label: "Máquinas",
      icon: Users,
      onClick: () => navigate(PATHS.CLIENT.MACHINES),
      badge: null
    },
    {
      label: "Relatórios",
      icon: BarChart3,
      onClick: () => navigate(PATHS.CLIENT.REPORTS),
      badge: null
    },
    {
      label: "Suporte",
      icon: HelpCircle,
      onClick: () => navigate(PATHS.CLIENT.SUPPORT),
      badge: "1"
    }
  ];

  const stats = [
    {
      label: "Saldo Atual",
      value: "R$ 12.450,00",
      icon: DollarSign,
      trend: "+5.2%"
    },
    {
      label: "Vendas do Mês",
      value: "R$ 8.720,00",
      icon: TrendingUp,
      trend: "+12.1%"
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumo Rápido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{stat.value}</div>
                <div className="text-xs text-green-600">{stat.trend}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={action.onClick}
              className="w-full justify-between h-auto p-3"
            >
              <div className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                <span className="text-sm">{action.label}</span>
              </div>
              {action.badge && (
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">Pagamento Recebido</div>
              <div className="text-xs text-muted-foreground">Há 2 horas</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Nova Máquina Associada</div>
              <div className="text-xs text-muted-foreground">Ontem</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Relatório Gerado</div>
              <div className="text-xs text-muted-foreground">2 dias atrás</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
