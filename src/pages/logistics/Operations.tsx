
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Calendar, Box, AlertTriangle } from "lucide-react";

const Operations = () => {
  return (
    <>
      <PageHeader 
        title="Operações Logísticas" 
        description="Gerenciamento de operações logísticas em andamento"
      />
      
      <PageWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Truck className="mr-2 h-5 w-5 text-primary" />
                Entregas
              </CardTitle>
              <CardDescription>Entregas programadas hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-muted-foreground text-sm">5 concluídas, 7 pendentes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Manutenções
              </CardTitle>
              <CardDescription>Manutenções programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-muted-foreground text-sm">Próximas 48 horas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Box className="mr-2 h-5 w-5 text-primary" />
                Transferências
              </CardTitle>
              <CardDescription>Transferências de equipamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-muted-foreground text-sm">Agendadas para esta semana</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Operações em Andamento</CardTitle>
            <CardDescription>Visão geral das operações logísticas atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-2" />
              <p className="text-muted-foreground mb-2">
                Esta seção está em desenvolvimento
              </p>
              <p className="text-sm text-muted-foreground">
                O painel completo de operações estará disponível em breve
              </p>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
};

export default Operations;
