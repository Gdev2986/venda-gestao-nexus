
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatsCardsGroup: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">128</div>
          <p className="text-xs text-muted-foreground">↑ 12% desde o mês passado</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Máquinas Operando</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98</div>
          <p className="text-xs text-muted-foreground">76% do total</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">10 atendimentos hoje</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">SLA Médio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.5 dias</div>
          <p className="text-xs text-muted-foreground text-green-600">↓ Meta: 2 dias</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCardsGroup;
