
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, Warehouse, Settings, Calendar } from "lucide-react";

const AdminLogistics = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciamento de Logística"
        description="Administre máquinas, operações logísticas e estoque"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" /> Máquinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie o cadastro de máquinas, status e alocações.
            </p>
            <Button asChild>
              <Link to={PATHS.ADMIN.MACHINES}>Acessar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" /> Operações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie transferências, instalações e manutenções.
            </p>
            <Button asChild>
              <Link to={PATHS.LOGISTICS.OPERATIONS}>Acessar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Warehouse className="mr-2 h-5 w-5" /> Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Controle o estoque de máquinas e componentes.
            </p>
            <Button asChild>
              <Link to={PATHS.LOGISTICS.STOCK}>Acessar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Visualize e gerencie agendamentos de serviços.
            </p>
            <Button asChild>
              <Link to={PATHS.LOGISTICS.CALENDAR}>Acessar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" /> Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure parâmetros logísticos e fluxos de trabalho.
            </p>
            <Button asChild>
              <Link to={PATHS.LOGISTICS.SETTINGS}>Acessar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogistics;
