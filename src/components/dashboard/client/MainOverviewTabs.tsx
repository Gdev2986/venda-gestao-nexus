
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, BarChart } from "@/components/charts";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/transactions/columns";
import { CreditCard, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MachineData {
  id: string;
  model: string;
  serial_number: string;
  status: string;
  created_at: string;
}

interface MainOverviewTabsProps {
  salesData: Array<{ name: string; total: number }>;
  paymentMethodsData: Array<{ name: string; value: number }>;
  filteredTransactions: any[];
  machines: MachineData[];
  loading: boolean;
}

export function MainOverviewTabs({
  salesData,
  paymentMethodsData,
  filteredTransactions,
  machines,
  loading
}: MainOverviewTabsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "INACTIVE":
        return <Badge className="bg-gray-500">Inativo</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-amber-500">Manutenção</Badge>;
      default:
        return <Badge className="bg-red-500">Bloqueado</Badge>;
    }
  };

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="w-full sm:w-auto grid grid-cols-3">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="transactions">Transações</TabsTrigger>
        <TabsTrigger value="machines">Equipamentos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Vendas Mensais</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <LineChart data={salesData} />
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <BarChart data={paymentMethodsData} />
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="transactions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Transações no Período</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <DataTable columns={columns} data={filteredTransactions} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="machines" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Meus Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : machines.length > 0 ? (
              <div className="space-y-4">
                {machines.map((machine) => (
                  <Card key={machine.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="p-2 rounded-full bg-primary/10">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{machine.model}</h4>
                            <p className="text-sm text-muted-foreground">Serial: {machine.serial_number}</p>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(machine.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Building className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Nenhum equipamento encontrado</h3>
                <p className="text-muted-foreground mt-1">
                  Você não tem equipamentos registrados atualmente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default MainOverviewTabs;
