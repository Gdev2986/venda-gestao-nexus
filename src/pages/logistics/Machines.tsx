import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import MachineList from "@/components/logistics/MachineList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Server, Archive, Building2, BarChart4 } from "lucide-react";
import { PATHS } from "@/routes/paths";

const LogisticsMachines = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for machines in stock
  const stockMachines = [
    { serial: "SN-100003", model: "Terminal Pro", status: "Novo", location: "Depósito Central", arrivalDate: "15/04/2025" },
    { serial: "SN-100004", model: "Terminal Mini", status: "Novo", location: "Depósito Central", arrivalDate: "15/04/2025" },
    { serial: "SN-100006", model: "Terminal Pro", status: "Revisado", location: "Depósito Central", arrivalDate: "10/04/2025" },
  ];

  // Mock data for machines by client
  const clientMachines = [
    {
      clientName: "Supermercado ABC",
      machines: [
        { serial: "SN-100001", model: "Terminal Pro", status: "Ativa", establishment: "Loja Central" },
        { serial: "SN-100005", model: "Terminal Standard", status: "Ativa", establishment: "Loja Filial" }
      ]
    },
    {
      clientName: "Farmácia Saúde",
      machines: [
        { serial: "SN-100010", model: "Terminal Mini", status: "Ativa", establishment: "Matriz" }
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Máquinas" 
        description="Gerencie o estoque, instalações e manutenção de máquinas"
        actionLabel="Cadastrar Máquina"
        actionLink={PATHS.LOGISTICS.MACHINE_NEW}
      />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Server size={16} />
            <span>Todas</span>
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Archive size={16} />
            <span>Estoque</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Building2 size={16} />
            <span>Por Cliente</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart4 size={16} />
            <span>Estatísticas</span>
          </TabsTrigger>
        </TabsList>
        
        {/* All Machines Tab */}
        <TabsContent value="all">
          <MachineList />
        </TabsContent>
        
        {/* Stock Tab */}
        <TabsContent value="stock">
          <PageWrapper>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Máquinas em Estoque</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Gerar Relatório
                </Button>
                <Button size="sm">
                  Entrada no Estoque
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Data de Entrada</TableHead>
                      <TableHead className="w-[150px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMachines.map((machine, i) => (
                      <TableRow key={i}>
                        <TableCell>{machine.serial}</TableCell>
                        <TableCell>{machine.model}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            machine.status === "Novo" ? "bg-green-50 text-green-700" : 
                            "bg-blue-50 text-blue-700"
                          }`}>
                            {machine.status}
                          </span>
                        </TableCell>
                        <TableCell>{machine.location}</TableCell>
                        <TableCell>{machine.arrivalDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Associar
                            </Button>
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </PageWrapper>
        </TabsContent>
        
        {/* Client Machines Tab */}
        <TabsContent value="clients">
          <PageWrapper>
            <div className="space-y-6">
              {clientMachines.map((client, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{client.clientName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Serial</TableHead>
                          <TableHead>Modelo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Estabelecimento</TableHead>
                          <TableHead className="w-[150px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {client.machines.map((machine, i) => (
                          <TableRow key={i}>
                            <TableCell>{machine.serial}</TableCell>
                            <TableCell>{machine.model}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                                {machine.status}
                              </span>
                            </TableCell>
                            <TableCell>{machine.establishment}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  Transferir
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Histórico
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageWrapper>
        </TabsContent>
        
        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Modelo</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  Componente de gráfico seria mostrado aqui
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  Componente de gráfico seria mostrado aqui
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Operações</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  Componente de gráfico seria mostrado aqui
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsMachines;
