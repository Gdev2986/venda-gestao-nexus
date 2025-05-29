
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Bell
} from "lucide-react";

export const ClientActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Realizar Pagamento",
      description: "Faça um novo pagamento ou transfira valores",
      icon: CreditCard,
      onClick: () => navigate(PATHS.CLIENT.PAYMENTS),
      variant: "default" as const
    },
    {
      title: "Gerenciar Máquinas",
      description: "Visualize e gerencie suas máquinas",
      icon: Users,
      onClick: () => navigate(PATHS.CLIENT.MACHINES),
      variant: "outline" as const
    },
    {
      title: "Relatórios",
      description: "Acesse relatórios detalhados",
      icon: BarChart3,
      onClick: () => navigate(PATHS.CLIENT.REPORTS),
      variant: "outline" as const
    },
    {
      title: "Configurações",
      description: "Atualize suas preferências",
      icon: Settings,
      onClick: () => navigate(PATHS.CLIENT.SETTINGS),
      variant: "outline" as const
    },
    {
      title: "Suporte",
      description: "Entre em contato conosco",
      icon: HelpCircle,
      onClick: () => navigate(PATHS.CLIENT.SUPPORT),
      variant: "outline" as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
        <CardDescription>
          Acesse as principais funcionalidades do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <action.icon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
