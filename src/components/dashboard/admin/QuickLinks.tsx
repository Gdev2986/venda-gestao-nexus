
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChartPie,
  BarChart,
  TrendingUp,
  Users,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function QuickLinks() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Function to generate quick links
  const links = [
    { name: "Vendas", icon: BarChart, path: "/admin/sales", color: "bg-blue-100 dark:bg-blue-900" },
    { name: "Pagamentos", icon: TrendingUp, path: "/admin/payments", color: "bg-green-100 dark:bg-green-900" },
    { name: "Relatórios", icon: ChartPie, path: "/admin/reports", color: "bg-yellow-100 dark:bg-yellow-900" },
    { name: "Parceiros", icon: Users, path: "/admin/partners", color: "bg-purple-100 dark:bg-purple-900" }
  ];

  const handleNavigate = (path: string, name: string) => {
    toast({
      title: `Navegando para ${name}`,
      description: `Redirecionando para a área de ${name.toLowerCase()}.`
    });
    // Use React Router navigation
    navigate(path);
  };

  return (
    <div>
      <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Atalhos Rápidos</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {links.map((link) => (
          <Card key={link.name} className="hover:shadow-md transition-shadow">
            <Button 
              variant="ghost" 
              className="h-full w-full flex flex-col items-center justify-center py-4 md:py-6"
              onClick={() => handleNavigate(link.path, link.name)}
            >
              <div className={cn("rounded-full p-2 md:p-3 mb-2", link.color)}>
                <link.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="text-sm md:text-base">{link.name}</span>
              <ArrowRight size={14} className="mt-1 opacity-50" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
